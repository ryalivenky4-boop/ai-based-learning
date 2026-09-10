import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'venkatesh2007';
const DB_NAME = process.env.DB_NAME || 'samarth_stat';

export async function initializeDatabase() {
  console.log(`Connecting to MySQL server at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);

  // Step 1: Connect to server without database
  const serverConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  try {
    // Create database if not exists
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database '${DB_NAME}' verified/created.`);
  } finally {
    await serverConn.end();
  }

  // Step 2: Connect to specific database
  const dbConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  try {
    console.log(`Creating database tables in '${DB_NAME}'...`);

    // Table: trainees
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS trainees (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        avatar VARCHAR(16) NOT NULL,
        designation VARCHAR(128) NOT NULL,
        role_key VARCHAR(64) NOT NULL,
        cadre VARCHAR(128) NOT NULL,
        division VARCHAR(128) NOT NULL,
        posting VARCHAR(255) NOT NULL,
        employee_id VARCHAR(64) NOT NULL,
        email VARCHAR(128) NOT NULL,
        qualification VARCHAR(255),
        experience_years DECIMAL(4, 1) DEFAULT 0,
        current_assignment TEXT,
        target_role VARCHAR(64) NOT NULL,
        karmayogi_credits INT DEFAULT 0,
        streak_days INT DEFAULT 0,
        learning_hours DECIMAL(6, 1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Table: trainee_competencies
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS trainee_competencies (
        trainee_id VARCHAR(64) NOT NULL,
        competency_id VARCHAR(64) NOT NULL,
        score INT NOT NULL DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (trainee_id, competency_id),
        FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE
      );
    `);

    // Table: course_enrollments
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trainee_id VARCHAR(64) NOT NULL,
        course_id VARCHAR(64) NOT NULL,
        course_type VARCHAR(32) DEFAULT 'iGOT',
        progress INT DEFAULT 0,
        status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        UNIQUE KEY unique_trainee_course (trainee_id, course_id),
        FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE
      );
    `);

    // Table: quiz_submissions
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trainee_id VARCHAR(64) NOT NULL,
        quiz_title VARCHAR(255) NOT NULL,
        total_questions INT NOT NULL,
        correct_count INT NOT NULL,
        score_percentage INT NOT NULL,
        passed BOOLEAN NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details_json JSON,
        FOREIGN KEY (trainee_id) REFERENCES trainees(id) ON DELETE CASCADE
      );
    `);

    // Table: workforce_analytics
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS workforce_analytics (
        division_code VARCHAR(32) PRIMARY KEY,
        division_name VARCHAR(128) NOT NULL,
        headquarters VARCHAR(255),
        officer_count INT DEFAULT 0,
        avg_competency DECIMAL(4, 1) DEFAULT 0,
        igot_adoption_rate DECIMAL(4, 1) DEFAULT 0,
        metrics_json JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    console.log('All MySQL tables verified successfully.');

    // Step 3: Seed initial data if trainees table is empty
    const [traineeRows] = await dbConn.query('SELECT COUNT(*) as count FROM trainees;');
    if (traineeRows[0].count === 0) {
      console.log('Seeding initial MoSPI Trainee personas into MySQL...');

      const defaultPersonas = [
        {
          id: 'persona_ananya',
          name: 'Smt. Ananya Sharma',
          avatar: 'AS',
          designation: 'Junior Statistical Officer (JSO)',
          roleKey: 'jso',
          cadre: 'Subordinate Statistical Service (SSS)',
          division: 'Field Operations Division (FOD)',
          posting: 'Regional Office, Jaipur, Rajasthan',
          employeeId: 'MoSPI/SSS/2021/8412',
          email: 'ananya.sharma@mospi.gov.in',
          qualification: 'M.Sc. in Statistics (University of Rajasthan)',
          experienceYears: 3.5,
          currentAssignment: 'PLFS Quarterly Field Survey & Annual Survey of Industries (ASI) factory verification',
          targetRole: 'sso',
          karmayogiCredits: 420,
          streakDays: 14,
          learningHours: 38.5,
          competencies: {
            stat_survey_sampling: 3,
            stat_national_accounts: 1,
            stat_price_statistics: 2,
            stat_labour_statistics: 4,
            stat_industrial_stats: 3,
            stat_sdg_indicators: 1,
            stat_data_quality: 2,
            tech_python_stats: 1,
            tech_r_econometrics: 1,
            tech_sql_databases: 2,
            tech_gis_spatial: 2,
            tech_data_viz: 1,
            tech_ai_ml: 1,
            tech_cloud_apis: 1,
            gov_cybersecurity: 2,
            gov_data_privacy: 3,
            gov_dpi_cloud: 1,
            gov_eoffice_workflows: 4,
            mgmt_ethics_conduct: 4,
            mgmt_project_management: 2,
            mgmt_communication_briefs: 2,
            mgmt_leadership_change: 1
          }
        },
        {
          id: 'persona_rajesh',
          name: 'Shri Rajesh Kumar Verma',
          avatar: 'RV',
          designation: 'Senior Statistical Officer (SSO)',
          roleKey: 'sso',
          cadre: 'Subordinate Statistical Service (SSS)',
          division: 'National Accounts Division (NAD)',
          posting: 'MoSPI Headquarters, Sardar Patel Bhawan, New Delhi',
          employeeId: 'MoSPI/SSS/2016/3291',
          email: 'rajesh.verma@mospi.gov.in',
          qualification: 'M.A. in Econometrics (Delhi School of Economics)',
          experienceYears: 8.5,
          currentAssignment: 'Supply and Use Tables (SUT) compilation & Gross Value Added estimation for Manufacturing',
          targetRole: 'asst_dir',
          karmayogiCredits: 890,
          streakDays: 22,
          learningHours: 64.0,
          competencies: {
            stat_survey_sampling: 4,
            stat_national_accounts: 4,
            stat_price_statistics: 3,
            stat_labour_statistics: 3,
            stat_industrial_stats: 4,
            stat_sdg_indicators: 2,
            stat_data_quality: 3,
            tech_python_stats: 2,
            tech_r_econometrics: 3,
            tech_sql_databases: 2,
            tech_gis_spatial: 2,
            tech_data_viz: 2,
            tech_ai_ml: 1,
            tech_cloud_apis: 1,
            gov_cybersecurity: 2,
            gov_data_privacy: 4,
            gov_dpi_cloud: 2,
            gov_eoffice_workflows: 4,
            mgmt_ethics_conduct: 4,
            mgmt_project_management: 3,
            mgmt_communication_briefs: 3,
            mgmt_leadership_change: 2
          }
        },
        {
          id: 'persona_priya',
          name: 'Dr. Priya Nair, ISS',
          avatar: 'PN',
          designation: 'Assistant Director',
          roleKey: 'asst_dir',
          cadre: 'Indian Statistical Service (ISS - 43rd Batch)',
          division: 'Data Informatics & Innovation Division (DIID)',
          posting: 'MoSPI, Sankhyiki Bhawan, CBD Belapur / New Delhi',
          employeeId: 'MoSPI/ISS/2018/0043',
          email: 'priya.nair@mospi.gov.in',
          qualification: 'Ph.D. in Data Science & Official Statistics (ISI Kolkata)',
          experienceYears: 6.0,
          currentAssignment: 'MoSPI Microdata Portal modernization, SDMX API integration & AI in Survey Processing',
          targetRole: 'dep_dir',
          karmayogiCredits: 1450,
          streakDays: 31,
          learningHours: 112.5,
          competencies: {
            stat_survey_sampling: 4,
            stat_national_accounts: 3,
            stat_price_statistics: 3,
            stat_labour_statistics: 4,
            stat_industrial_stats: 3,
            stat_sdg_indicators: 4,
            stat_data_quality: 4,
            tech_python_stats: 5,
            tech_r_econometrics: 4,
            tech_sql_databases: 4,
            tech_gis_spatial: 3,
            tech_data_viz: 4,
            tech_ai_ml: 4,
            tech_cloud_apis: 4,
            gov_cybersecurity: 4,
            gov_data_privacy: 4,
            gov_dpi_cloud: 4,
            gov_eoffice_workflows: 4,
            mgmt_ethics_conduct: 5,
            mgmt_project_management: 3,
            mgmt_communication_briefs: 4,
            mgmt_leadership_change: 3
          }
        }
      ];

      for (const p of defaultPersonas) {
        await dbConn.query(`
          INSERT INTO trainees (
            id, name, avatar, designation, role_key, cadre, division, posting,
            employee_id, email, qualification, experience_years, current_assignment,
            target_role, karmayogi_credits, streak_days, learning_hours
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.id, p.name, p.avatar, p.designation, p.roleKey, p.cadre, p.division, p.posting,
          p.employeeId, p.email, p.qualification, p.experienceYears, p.currentAssignment,
          p.targetRole, p.karmayogiCredits, p.streakDays, p.learningHours
        ]);

        // Insert competencies
        for (const [compId, score] of Object.entries(p.competencies)) {
          await dbConn.query(`
            INSERT INTO trainee_competencies (trainee_id, competency_id, score)
            VALUES (?, ?, ?)
          `, [p.id, compId, score]);
        }
      }

      console.log('Seeded 3 MoSPI personas and 66 competency records into MySQL.');
    }

    console.log('Database initialization complete!');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  } finally {
    await dbConn.end();
  }
}

// Run standalone if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase()
    .then(() => {
      console.log('MySQL setup script finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('MySQL setup script failed:', err);
      process.exit(1);
    });
}
