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
    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.query(
      'SELECT id, full_name, email, job_role, department, organization, experience_level, career_goal, karmayogi_credits, streak_days, learning_hours FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
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
