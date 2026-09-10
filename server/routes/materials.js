import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure storage for uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Require authentication for all materials routes
router.use(requireAuth);

/**
 * GET /api/materials
 * List all uploaded learning materials for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const [materials] = await pool.query(
      `SELECT id, file_name, file_type, file_url, uploaded_at,
              CHAR_LENGTH(extracted_text) as text_length,
              SUBSTRING(extracted_text, 1, 200) as snippet
       FROM learning_materials
       WHERE user_id = ?
       ORDER BY uploaded_at DESC`,
      [req.user.id]
    );

    res.json(materials);
  } catch (err) {
    console.error('Fetch materials error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/materials/:id
 * Get single learning material by ID (user isolated)
 */
router.get('/:id', async (req, res) => {
  try {
    const [materials] = await pool.query(
      'SELECT * FROM learning_materials WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (materials.length === 0) {
      return res.status(404).json({ error: 'Learning material not found' });
    }

    res.json(materials[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/materials/upload
 * Upload document or submit text for quiz generation
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    let fileName = req.body.file_name || 'Uploaded Document';
    let fileType = 'text/plain';
    let extractedText = '';

    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype || path.extname(fileName);
      
      // Convert buffer to UTF-8 text string
      // For plain text, markdown, CSV, or formatted text
      extractedText = req.file.buffer.toString('utf-8');
      
      // Clean non-printable characters if binary file
      if (fileType.includes('pdf') || fileType.includes('octet-stream')) {
        // Basic plain text extraction heuristic from buffer
        extractedText = extractedText.replace(/[^\x20-\x7E\t\r\n]/g, ' ');
      }
    } else if (req.body.text_content) {
      extractedText = req.body.text_content;
      fileType = 'text/plain';
    } else {
      return res.status(400).json({ error: 'Please upload a file or provide text_content.' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'The uploaded file contains no readable text content.' });
    }

    const [result] = await pool.query(
      `INSERT INTO learning_materials (user_id, file_name, file_type, file_url, extracted_text)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, fileName, fileType, null, extractedText]
    );

    // Add notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, 'Material Uploaded', ?, 'info')`,
      [req.user.id, `Document "${fileName}" uploaded successfully. You can now generate AI quizzes.`]
    );

    res.status(201).json({
      success: true,
      materialId: result.insertId,
      fileName,
      fileType,
      textLength: extractedText.length,
      snippet: extractedText.substring(0, 200)
    });
  } catch (err) {
    console.error('Upload material error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/materials/:id
 * Delete a user's uploaded material
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM learning_materials WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found or access denied.' });
    }

    res.json({ success: true, message: 'Material deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
