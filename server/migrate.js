import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import sample courses from existing frontend data to preserve them in MySQL
import { IGOT_COURSES } from '../src/data/igotCourses.js';
import { NSSTA_TPAC_PROGRAMMES } from '../src/data/nsstaCalendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'venkatesh2007';
const DB_NAME = process.env.DB_NAME || 'samarth_stat';

export async function runMigrations() {
  console.log(`=======================================================`);
  console.log(`Starting MySQL Database Migration for '${DB_NAME}'...`);
  console.log(`Host: ${DB_HOST}:${DB_PORT} | User: ${DB_USER}`);
  console.log(`=======================================================`);

  // 1. Ensure database exists
  const serverConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  try {
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database '${DB_NAME}' verified.`);
  } finally {
    await serverConn.end();
  }

  // 2. Connect to the database
  const dbConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  try {
    // Clean up old demo tables and sample users if they exist
    console.log('Removing old demo/sample user tables...');
    await dbConn.query(`
      DROP TABLE IF EXISTS trainee_competencies;
      DROP TABLE IF EXISTS course_enrollments;
      DROP TABLE IF EXISTS quiz_submissions;
      DROP TABLE IF EXISTS trainees;
    `);
    console.log('Old demo user tables purged.');

    // 3. Read and execute migration files
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      console.log(`Applying migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Split multiple statements if needed
      const statements = sql
        .split(/;\s*$/m)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        await dbConn.query(statement);
      }
    }
    console.log('All 10 migration files applied successfully.');

    // 4. Preserve and seed existing sample course data into the new 'courses' table
    console.log('Preserving existing sample course data into MySQL...');
    const [existingCourses] = await dbConn.query('SELECT COUNT(*) as count FROM courses');

    if (existingCourses[0].count === 0) {
      // Seed iGOT Courses
      for (const c of IGOT_COURSES) {
        await dbConn.query(`
          INSERT INTO courses (
            id, title, description, provider, category, skill, difficulty,
            duration, duration_hours, course_url, source, external_course_id,
            is_sample, karmayogi_credits, syllabus_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SAMPLE', ?, TRUE, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)
        `, [
          c.id,
          c.title,
          c.overview || c.title,
          c.provider || 'Karmayogi Bharat',
          'Statistical & Technical Competency',
          c.tags?.[0] || 'Official Statistics',
          c.level >= 3 ? 'Advanced' : 'Intermediate',
          `${c.durationHours || 10} Hours`,
          c.durationHours || 10.0,
          `https://igotkarmayogi.gov.in/course/${c.code}`,
          c.code,
          c.karmayogiCredits || 150,
          JSON.stringify(c.syllabus || [])
        ]);
      }

      // Seed NSSTA TPAC Programmes
      for (const prog of NSSTA_TPAC_PROGRAMMES) {
        await dbConn.query(`
          INSERT INTO courses (
            id, title, description, provider, category, skill, difficulty,
            duration, duration_hours, course_url, source, external_course_id,
            is_sample, karmayogi_credits, syllabus_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SAMPLE', ?, TRUE, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)
        `, [
          prog.id,
          prog.title,
          `NSSTA Residential/Hybrid Programme at Greater Noida. Target: ${prog.targetCadre}`,
          'NSSTA (Greater Noida) - MoSPI',
          'NSSTA TPAC In-Service Workshop',
          prog.category || 'Official Statistics',
          'Advanced',
          `${prog.durationDays} Days Residential`,
          prog.durationDays * 6.0,
          `https://nssta.gov.in/programmes/${prog.code}`,
          prog.code,
          200,
          JSON.stringify(prog.syllabusFocus || [])
        ]);
      }

      const [totalSeeded] = await dbConn.query('SELECT COUNT(*) as count FROM courses');
      console.log(`Successfully preserved ${totalSeeded[0].count} sample courses in MySQL.`);
    } else {
      console.log(`Courses table already contains ${existingCourses[0].count} courses. Preserved intact.`);
    }

    console.log(`=======================================================`);
    console.log(`Database migration and course preservation finished!`);
    console.log(`=======================================================`);
    return true;
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    await dbConn.end();
  }
}

// If executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('Migration script complete.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration error:', err);
      process.exit(1);
    });
}
