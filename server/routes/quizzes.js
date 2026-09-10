import express from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { generateQuizFromMaterialWithAI } from '../services/geminiService.js';

const router = express.Router();

// Require auth on all quiz routes
router.use(requireAuth);

/**
 * GET /api/quizzes
 * Retrieve all quizzes created by or assigned to authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const [quizzes] = await pool.query(
      `SELECT q.id, q.title, q.difficulty, q.total_questions, q.created_at,
              lm.file_name as source_material_name,
              qa.score as latest_score, qa.percentage as latest_percentage, qa.completed_at as latest_attempt_at
       FROM quizzes q
       LEFT JOIN learning_materials lm ON q.source_material_id = lm.id
       LEFT JOIN (
         SELECT quiz_id, score, percentage, completed_at
         FROM quiz_attempts
         WHERE user_id = ?
         ORDER BY completed_at DESC
       ) qa ON qa.quiz_id = q.id
       WHERE q.user_id = ?
       GROUP BY q.id
       ORDER BY q.created_at DESC`,
      [req.user.id, req.user.id]
    );

    res.json(quizzes);
  } catch (err) {
    console.error('Fetch quizzes error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/quizzes/attempts/history
 * Retrieve full attempt history for authenticated user
 */
router.get('/attempts/history', async (req, res) => {
  try {
    const [attempts] = await pool.query(
      `SELECT qa.id, qa.quiz_id, qa.score, qa.percentage, qa.completed_at,
              q.title, q.difficulty, q.total_questions
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.id
       WHERE qa.user_id = ?
       ORDER BY qa.completed_at DESC`,
      [req.user.id]
    );

    res.json(attempts);
  } catch (err) {
    console.error('Fetch quiz attempts error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/quizzes/:id
 * Retrieve a specific quiz and its questions
 */
router.get('/:id', async (req, res) => {
  try {
    const [quizRows] = await pool.query(
      'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or unauthorized' });
    }

    const quiz = quizRows[0];
    const [questions] = await pool.query(
      'SELECT id, quiz_id, question, option_a, option_b, option_c, option_d, explanation FROM quiz_questions WHERE quiz_id = ?',
      [quiz.id]
    );

    res.json({
      ...quiz,
      questions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/quizzes/generate
 * Generate quiz from uploaded learning material using Gemini AI
 */
router.post('/generate', async (req, res) => {
  const {
    source_material_id,
    title = 'Assessment Quiz',
    difficulty = 'Medium',
    total_questions = 5,
    raw_text
  } = req.body;

  let textToUse = raw_text;
  let materialId = source_material_id || null;
  let quizTitle = title;

  try {
    // If source_material_id provided, fetch material owned by this user
    if (materialId) {
      const [materials] = await pool.query(
        'SELECT id, file_name, extracted_text FROM learning_materials WHERE id = ? AND user_id = ?',
        [materialId, req.user.id]
      );

      if (materials.length > 0) {
        textToUse = materials[0].extracted_text;
        quizTitle = quizTitle || `Quiz on ${materials[0].file_name}`;
      }
    }

    if (!textToUse || textToUse.trim().length < 20) {
      return res.status(400).json({ error: 'Valid learning material or text is required to generate a quiz.' });
    }

    // Call AI service to generate structured questions
    const generatedQuestions = await generateQuizFromMaterialWithAI(
      textToUse,
      quizTitle,
      difficulty,
      parseInt(total_questions, 10) || 5
    );

    if (!generatedQuestions || generatedQuestions.length === 0) {
      return res.status(500).json({ error: 'Failed to generate questions from provided material.' });
    }

    // Insert Quiz into MySQL
    const [quizResult] = await pool.query(
      `INSERT INTO quizzes (user_id, title, source_material_id, difficulty, total_questions)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, quizTitle, materialId, difficulty, generatedQuestions.length]
    );

    const quizId = quizResult.insertId;

    // Insert Questions
    for (const q of generatedQuestions) {
      await pool.query(
        `INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quizId,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer || 'A',
          q.explanation || ''
        ]
      );
    }

    // Notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, 'Quiz Generated', ?, 'success')`,
      [req.user.id, `New assessment "${quizTitle}" (${generatedQuestions.length} MCQs) has been synthesized by AI.`]
    );

    // Return created quiz with questions
    const [insertedQuestions] = await pool.query(
      'SELECT id, quiz_id, question, option_a, option_b, option_c, option_d FROM quiz_questions WHERE quiz_id = ?',
      [quizId]
    );

    res.status(201).json({
      success: true,
      quiz: {
        id: quizId,
        user_id: req.user.id,
        title: quizTitle,
        difficulty,
        total_questions: generatedQuestions.length,
        questions: insertedQuestions
      }
    });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/quizzes/:id/attempt
 * Submit quiz answers, calculate score, evaluate answers, update user competency & credits
 */
router.post('/:id/attempt', async (req, res) => {
  const quizId = req.params.id;
  const { answers = [] } = req.body; // Array of { question_id, selected_answer }

  try {
    // 1. Fetch questions to evaluate
    const [questions] = await pool.query(
      'SELECT id, correct_answer, explanation FROM quiz_questions WHERE quiz_id = ?',
      [quizId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or has no questions.' });
    }

    const questionMap = new Map();
    questions.forEach(q => questionMap.set(q.id, q));

    let correctCount = 0;
    const answerEvaluations = [];

    answers.forEach(a => {
      const q = questionMap.get(a.question_id);
      if (q) {
        const isCorrect = (a.selected_answer || '').toUpperCase() === (q.correct_answer || '').toUpperCase();
        if (isCorrect) correctCount++;
        answerEvaluations.push({
          question_id: a.question_id,
          selected_answer: (a.selected_answer || '').toUpperCase(),
          is_correct: isCorrect,
          correct_answer: q.correct_answer,
          explanation: q.explanation
        });
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? ((correctCount / total) * 100).toFixed(2) : 0;
    const passed = percentage >= 60;

    // 2. Insert into quiz_attempts
    const [attemptResult] = await pool.query(
      `INSERT INTO quiz_attempts (quiz_id, user_id, score, percentage)
       VALUES (?, ?, ?, ?)`,
      [quizId, req.user.id, correctCount, percentage]
    );

    const attemptId = attemptResult.insertId;

    // 3. Insert into quiz_answers
    for (const item of answerEvaluations) {
      await pool.query(
        `INSERT INTO quiz_answers (attempt_id, question_id, selected_answer, is_correct)
         VALUES (?, ?, ?, ?)`,
        [attemptId, item.question_id, item.selected_answer, item.is_correct]
      );
    }

    // 4. Update user credits and streak
    const creditsAwarded = passed ? 60 : 25;
    await pool.query(
      `UPDATE users
       SET karmayogi_credits = karmayogi_credits + ?,
           learning_hours = learning_hours + 0.5
       WHERE id = ?`,
      [creditsAwarded, req.user.id]
    );

    // 5. Add notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        passed ? 'Quiz Passed!' : 'Quiz Completed',
        `You scored ${correctCount}/${total} (${percentage}%). +${creditsAwarded} Karmayogi credits added.`,
        passed ? 'success' : 'info'
      ]
    );

    res.json({
      success: true,
      attemptId,
      score: correctCount,
      totalQuestions: total,
      percentage: parseFloat(percentage),
      passed,
      creditsAwarded,
      evaluations: answerEvaluations
    });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
