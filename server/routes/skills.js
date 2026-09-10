import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import {
  analyzeCompetencyGapsWithAI,
  generateRecommendationsWithAI
} from '../services/geminiService.js';

const router = express.Router();

// Apply requireAuth to all skill routes
router.use(requireAuth);

/**
 * GET /api/skills - Get current user's skills
 */
router.get('/', async (req, res) => {
  try {
    const [skills] = await pool.query(
      'SELECT id, skill_name, proficiency_level, proficiency_score, updated_at FROM user_skills WHERE user_id = ? ORDER BY proficiency_score DESC',
      [req.user.id]
    );
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/skills - Add or update a user skill
 */
router.post('/', async (req, res) => {
  const { skill_name, proficiency_level = 'Intermediate', proficiency_score = 50 } = req.body;

  if (!skill_name) {
    return res.status(400).json({ error: 'skill_name is required' });
  }

  try {
    // Check if skill already exists for user
    const [existing] = await pool.query(
      'SELECT id FROM user_skills WHERE user_id = ? AND LOWER(skill_name) = LOWER(?)',
      [req.user.id, skill_name.trim()]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE user_skills SET proficiency_level = ?, proficiency_score = ? WHERE id = ?',
        [proficiency_level, proficiency_score, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO user_skills (user_id, skill_name, proficiency_level, proficiency_score) VALUES (?, ?, ?, ?)',
        [req.user.id, skill_name.trim(), proficiency_level, proficiency_score]
      );
    }

    // Trigger background gap update
    triggerGapUpdate(req.user);

    res.json({ success: true, message: 'Skill saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/target-skills - Get user's desired target skills
 */
router.get('/target', async (req, res) => {
  try {
    const [targets] = await pool.query(
      'SELECT id, skill_name, priority, created_at FROM target_skills WHERE user_id = ? ORDER BY priority DESC',
      [req.user.id]
    );
    res.json(targets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/target-skills - Add a target skill
 */
router.post('/target', async (req, res) => {
  const { skill_name, priority = 'Medium' } = req.body;

  if (!skill_name) {
    return res.status(400).json({ error: 'skill_name is required' });
  }

  try {
    await pool.query(
      'INSERT INTO target_skills (user_id, skill_name, priority) VALUES (?, ?, ?)',
      [req.user.id, skill_name.trim(), priority]
    );

    triggerGapUpdate(req.user);

    res.json({ success: true, message: 'Target skill added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/competency-gaps - Get real competency gaps for user
 */
router.get('/gaps', async (req, res) => {
  try {
    const [gaps] = await pool.query(
      'SELECT id, skill_name, current_score, target_score, gap_score, priority, ai_reason, updated_at FROM competency_gaps WHERE user_id = ? ORDER BY gap_score DESC',
      [req.user.id]
    );
    res.json(gaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/competency-gaps/analyze - Re-run AI analysis
 */
router.post('/gaps/analyze', async (req, res) => {
  try {
    const [userSkills] = await pool.query('SELECT * FROM user_skills WHERE user_id = ?', [req.user.id]);
    const [targetSkills] = await pool.query('SELECT * FROM target_skills WHERE user_id = ?', [req.user.id]);

    const gaps = await analyzeCompetencyGapsWithAI(req.user, userSkills, targetSkills);

    // Delete existing gaps and insert new ones
    await pool.query('DELETE FROM competency_gaps WHERE user_id = ?', [req.user.id]);

    for (const gap of gaps) {
      await pool.query(`
        INSERT INTO competency_gaps (user_id, skill_name, current_score, target_score, gap_score, priority, ai_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, gap.skill_name, gap.current_score, gap.target_score, gap.gap_score, gap.priority, gap.ai_reason]);
    }

    // Refresh recommendations
    const [courses] = await pool.query('SELECT * FROM courses');
    const recs = await generateRecommendationsWithAI(req.user, gaps, courses);

    await pool.query('DELETE FROM recommendations WHERE user_id = ?', [req.user.id]);
    for (const r of recs) {
      await pool.query(`
        INSERT INTO recommendations (user_id, course_id, skill, reason, priority, recommendation_score)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [req.user.id, r.course_id, r.skill, r.reason, r.priority, r.recommendation_score]);
    }

    res.json({ success: true, gaps, recommendationsCount: recs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function triggerGapUpdate(user) {
  try {
    const [userSkills] = await pool.query('SELECT * FROM user_skills WHERE user_id = ?', [user.id]);
    const [targetSkills] = await pool.query('SELECT * FROM target_skills WHERE user_id = ?', [user.id]);
    const gaps = await analyzeCompetencyGapsWithAI(user, userSkills, targetSkills);

    await pool.query('DELETE FROM competency_gaps WHERE user_id = ?', [user.id]);
    for (const gap of gaps) {
      await pool.query(`
        INSERT INTO competency_gaps (user_id, skill_name, current_score, target_score, gap_score, priority, ai_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [user.id, gap.skill_name, gap.current_score, gap.target_score, gap.gap_score, gap.priority, gap.ai_reason]);
    }
  } catch (e) {
    console.warn('Background gap update warning:', e.message);
  }
}

export default router;
