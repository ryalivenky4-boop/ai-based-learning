import express from 'express';
import { pool, testConnection } from '../db.js';

const router = express.Router();

// 1. Health & Database Status
router.get('/db-status', async (req, res) => {
  try {
    const connInfo = await testConnection();
    if (!connInfo.connected) {
      return res.status(503).json({
        connected: false,
        error: connInfo.error,
        config: { host: connInfo.host, port: connInfo.port, database: connInfo.database }
      });
    }

    // Query stats from MySQL
    const [traineeCount] = await pool.query('SELECT COUNT(*) as count FROM trainees');
    const [compCount] = await pool.query('SELECT COUNT(*) as count FROM trainee_competencies');
    const [quizCount] = await pool.query('SELECT COUNT(*) as count FROM quiz_submissions');
    const [enrollCount] = await pool.query('SELECT COUNT(*) as count FROM course_enrollments');

    res.json({
      connected: true,
      service: 'MySQL 8.0 (MySQL80)',
      database: connInfo.database,
      host: connInfo.host,
      port: connInfo.port,
      user: connInfo.user,
      stats: {
        trainees: traineeCount[0].count,
        competencyRecords: compCount[0].count,
        quizSubmissions: quizCount[0].count,
        courseEnrollments: enrollCount[0].count
      }
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// 2. Get all trainees with their competency scores
router.get('/trainees', async (req, res) => {
  try {
    const [trainees] = await pool.query('SELECT * FROM trainees ORDER BY name ASC');

    const result = [];
    for (const t of trainees) {
      const [comps] = await pool.query(
        'SELECT competency_id, score FROM trainee_competencies WHERE trainee_id = ?',
        [t.id]
      );
      const competencyScores = {};
      comps.forEach(c => {
        competencyScores[c.competency_id] = c.score;
      });

      const [enrollments] = await pool.query(
        'SELECT course_id, course_type, progress, status, enrolled_at, completed_at FROM course_enrollments WHERE trainee_id = ?',
        [t.id]
      );
      const enrollmentsMap = {};
      enrollments.forEach(e => {
        enrollmentsMap[e.course_id] = e;
      });

      result.push({
        id: t.id,
        name: t.name,
        avatar: t.avatar,
        designation: t.designation,
        roleKey: t.role_key,
        cadre: t.cadre,
        division: t.division,
        posting: t.posting,
        employeeId: t.employee_id,
        email: t.email,
        qualification: t.qualification,
        experienceYears: parseFloat(t.experience_years),
        currentAssignment: t.current_assignment,
        targetRole: t.target_role,
        karmayogiCredits: t.karmayogi_credits,
        streakDays: t.streak_days,
        learningHours: parseFloat(t.learning_hours),
        competencyScores,
        enrollments: enrollmentsMap
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching trainees:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Get single trainee by ID
router.get('/trainees/:id', async (req, res) => {
  try {
    const [trainees] = await pool.query('SELECT * FROM trainees WHERE id = ?', [req.params.id]);
    if (trainees.length === 0) {
      return res.status(404).json({ error: 'Trainee not found' });
    }

    const t = trainees[0];
    const [comps] = await pool.query(
      'SELECT competency_id, score FROM trainee_competencies WHERE trainee_id = ?',
      [t.id]
    );
    const competencyScores = {};
    comps.forEach(c => {
      competencyScores[c.competency_id] = c.score;
    });

    const [enrollments] = await pool.query(
      'SELECT course_id, course_type, progress, status, enrolled_at, completed_at FROM course_enrollments WHERE trainee_id = ?',
      [t.id]
    );
    const enrollmentsMap = {};
    enrollments.forEach(e => {
      enrollmentsMap[e.course_id] = e;
    });

    res.json({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      designation: t.designation,
      roleKey: t.role_key,
      cadre: t.cadre,
      division: t.division,
      posting: t.posting,
      employeeId: t.employee_id,
      email: t.email,
      qualification: t.qualification,
      experienceYears: parseFloat(t.experience_years),
      currentAssignment: t.current_assignment,
      targetRole: t.target_role,
      karmayogiCredits: t.karmayogi_credits,
      streakDays: t.streak_days,
      learningHours: parseFloat(t.learning_hours),
      competencyScores,
      enrollments: enrollmentsMap
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update competency score in MySQL
router.put('/trainees/:id/competency', async (req, res) => {
  const { competencyId, score } = req.body;
  const traineeId = req.params.id;

  if (!competencyId || typeof score !== 'number') {
    return res.status(400).json({ error: 'competencyId and numeric score required' });
  }

  try {
    await pool.query(
      `INSERT INTO trainee_competencies (trainee_id, competency_id, score)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score), updated_at = CURRENT_TIMESTAMP`,
      [traineeId, competencyId, score]
    );

    res.json({ success: true, traineeId, competencyId, score });
  } catch (err) {
    console.error('Error updating competency:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Enroll in a course (iGOT or NSSTA)
router.post('/trainees/:id/enroll', async (req, res) => {
  const traineeId = req.params.id;
  const { courseId, courseType = 'iGOT', progress = 0 } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId required' });
  }

  try {
    await pool.query(
      `INSERT INTO course_enrollments (trainee_id, course_id, course_type, progress, status)
       VALUES (?, ?, ?, ?, 'in_progress')
       ON DUPLICATE KEY UPDATE progress = VALUES(progress)`,
      [traineeId, courseId, courseType, progress]
    );

    res.json({ success: true, traineeId, courseId, progress, status: 'in_progress' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Complete course and boost competency in MySQL
router.post('/trainees/:id/complete-course', async (req, res) => {
  const traineeId = req.params.id;
  const {
    courseId,
    courseType = 'iGOT',
    competencyId,
    creditsAwarded = 150,
    hoursAdded = 8.0
  } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId required' });
  }

  try {
    // 1. Mark enrollment completed
    await pool.query(
      `INSERT INTO course_enrollments (trainee_id, course_id, course_type, progress, status, completed_at)
       VALUES (?, ?, ?, 100, 'completed', CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE progress = 100, status = 'completed', completed_at = CURRENT_TIMESTAMP`,
      [traineeId, courseId, courseType]
    );

    // 2. Increment hours and karma credits on trainee
    await pool.query(
      `UPDATE trainees
       SET learning_hours = learning_hours + ?,
           karmayogi_credits = karmayogi_credits + ?
       WHERE id = ?`,
      [hoursAdded, creditsAwarded, traineeId]
    );

    // 3. Boost competency level (+1, up to max 5)
    let newScore = null;
    if (competencyId) {
      const [compRows] = await pool.query(
        'SELECT score FROM trainee_competencies WHERE trainee_id = ? AND competency_id = ?',
        [traineeId, competencyId]
      );
      const currentScore = compRows.length > 0 ? compRows[0].score : 1;
      newScore = Math.min(5, currentScore + 1);

      await pool.query(
        `INSERT INTO trainee_competencies (trainee_id, competency_id, score)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE score = ?, updated_at = CURRENT_TIMESTAMP`,
        [traineeId, competencyId, newScore, newScore]
      );
    }

    // Fetch updated trainee profile
    const [updatedTrainee] = await pool.query('SELECT * FROM trainees WHERE id = ?', [traineeId]);

    res.json({
      success: true,
      courseId,
      competencyId,
      newScore,
      learningHours: parseFloat(updatedTrainee[0].learning_hours),
      karmayogiCredits: updatedTrainee[0].karmayogi_credits
    });
  } catch (err) {
    console.error('Error completing course:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Save AI Quiz Submission to MySQL
router.post('/quizzes/submit', async (req, res) => {
  const {
    traineeId,
    quizTitle,
    totalQuestions,
    correctCount,
    scorePercentage,
    passed,
    evaluations
  } = req.body;

  if (!traineeId || !quizTitle) {
    return res.status(400).json({ error: 'traineeId and quizTitle required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO quiz_submissions (
        trainee_id, quiz_title, total_questions, correct_count, score_percentage, passed, details_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        traineeId,
        quizTitle,
        totalQuestions,
        correctCount,
        scorePercentage,
        passed,
        JSON.stringify(evaluations || [])
      ]
    );

    // Award bonus karma credits if passed
    if (passed) {
      await pool.query(
        'UPDATE trainees SET karmayogi_credits = karmayogi_credits + 50 WHERE id = ?',
        [traineeId]
      );
    }

    res.json({
      success: true,
      submissionId: result.insertId,
      scorePercentage,
      passed
    });
  } catch (err) {
    console.error('Error saving quiz submission:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Get Quiz Submissions History
router.get('/quizzes/history/:traineeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, quiz_title, total_questions, correct_count, score_percentage, passed, submitted_at
       FROM quiz_submissions
       WHERE trainee_id = ?
       ORDER BY submitted_at DESC
       LIMIT 10`,
      [req.params.traineeId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
