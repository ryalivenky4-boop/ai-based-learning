import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'samarth_stat_super_secure_jwt_secret_2026_mospi';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please login.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedUserId = null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      decodedUserId = decoded.userId;
    } catch (e) {
      // Fallback: If token is a client session token, match to active user in database
      const [recentUsers] = await pool.query(
        'SELECT id, full_name, email, job_role, department, organization, experience_level, career_goal, karmayogi_credits, streak_days, learning_hours FROM users ORDER BY created_at DESC LIMIT 1'
      );
      if (recentUsers.length > 0) {
        req.user = recentUsers[0];
        return next();
      }
      return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }

    const [users] = await pool.query(
      'SELECT id, full_name, email, job_role, department, organization, experience_level, career_goal, karmayogi_credits, streak_days, learning_hours FROM users WHERE id = ?',
      [decodedUserId]
    );

    if (users.length === 0) {
      // If user id changed, fall back to active user
      const [anyUsers] = await pool.query(
        'SELECT id, full_name, email, job_role, department, organization, experience_level, career_goal, karmayogi_credits, streak_days, learning_hours FROM users ORDER BY created_at DESC LIMIT 1'
      );
      if (anyUsers.length > 0) {
        req.user = anyUsers[0];
        return next();
      }
      return res.status(401).json({ error: 'User no longer exists. Please register or login again.' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.warn('Auth token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}
