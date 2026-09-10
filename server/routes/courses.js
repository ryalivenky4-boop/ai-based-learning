import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/courses - Public / Protected course catalogue
 */
router.get('/', async (req, res) => {
  const { source, skill } = req.query;
  try {
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (source) {
      query += ' AND source = ?';
      params.push(source.toUpperCase());
    }
    if (skill) {
      query += ' AND (skill LIKE ? OR title LIKE ?)';
      params.push(`%${skill}%`, `%${skill}%`);
    }

    query += ' ORDER BY is_sample DESC, title ASC';
    const [courses] = await pool.query(query, params);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Protected routes below
 */
router.use(requireAuth);

/**
 * GET /api/courses/recommendations - Personalized recommendations for authenticated user
 */
router.get('/recommendations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id as recommendation_id, r.skill, r.reason, r.priority, r.recommendation_score,
             c.id, c.title, c.description, c.provider, c.category, c.difficulty,
             c.duration, c.duration_hours, c.course_url, c.source, c.is_sample,
             c.karmayogi_credits, c.syllabus_json
      FROM recommendations r
      JOIN courses c ON r.course_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.recommendation_score DESC, r.created_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/courses/progress - Real course progress for authenticated user
 */
router.get('/progress', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cp.id, cp.course_id, cp.progress_percentage, cp.started_at, cp.last_accessed_at, cp.completed_at,
             c.title, c.provider, c.duration_hours, c.karmayogi_credits, c.source
      FROM course_progress cp
      JOIN courses c ON cp.course_id = c.id
      WHERE cp.user_id = ?
      ORDER BY cp.last_accessed_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/courses/progress - Update or complete course progress
 */
router.post('/progress', async (req, res) => {
  const { course_id, progress_percentage = 0, is_completed = false } = req.body;

  if (!course_id) {
    return res.status(400).json({ error: 'course_id is required' });
  }

  try {
    const [courseRows] = await pool.query('SELECT * FROM courses WHERE id = ?', [course_id]);
    if (courseRows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const course = courseRows[0];

    const completedAt = is_completed || progress_percentage >= 100 ? new Date() : null;
    const finalProgress = is_completed ? 100 : Math.min(100, Math.max(0, progress_percentage));

    await pool.query(`
      INSERT INTO course_progress (user_id, course_id, progress_percentage, completed_at)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        progress_percentage = VALUES(progress_percentage),
        completed_at = COALESCE(completed_at, VALUES(completed_at)),
        last_accessed_at = CURRENT_TIMESTAMP
    `, [req.user.id, course_id, finalProgress, completedAt]);

    // If newly completed, update user stats & boost skill
    if (completedAt) {
      const hoursToAdd = parseFloat(course.duration_hours) || 8.0;
      const creditsToAdd = course.karmayogi_credits || 150;

      await pool.query(`
        UPDATE users
        SET learning_hours = learning_hours + ?,
            karmayogi_credits = karmayogi_credits + ?
        WHERE id = ?
      `, [hoursToAdd, creditsToAdd, req.user.id]);

      // Boost matching skill proficiency in user_skills
      if (course.skill) {
        const [existingSkill] = await pool.query(`
          SELECT id, proficiency_score FROM user_skills
          WHERE user_id = ? AND (LOWER(skill_name) = LOWER(?) OR LOWER(?) LIKE CONCAT('%', LOWER(skill_name), '%'))
        `, [req.user.id, course.skill, course.skill]);

        if (existingSkill.length > 0) {
          const newScore = Math.min(100, existingSkill[0].proficiency_score + 15);
          const newLevel = newScore >= 80 ? 'Expert' : newScore >= 65 ? 'Advanced' : 'Intermediate';
          await pool.query(`
            UPDATE user_skills
            SET proficiency_score = ?, proficiency_level = ?
            WHERE id = ?
          `, [newScore, newLevel, existingSkill[0].id]);
        }
      }

      // Record notification
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, 'Course Completed!', ?, 'success')
      `, [req.user.id, `Congratulations! You completed "${course.title}". +${creditsToAdd} Karma credits and +${hoursToAdd} learning hours added.`]);
    }

    res.json({
      success: true,
      course_id,
      progress_percentage: finalProgress,
      is_completed: !!completedAt
    });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
