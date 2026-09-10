import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import skillsRouter from './routes/skills.js';
import coursesRouter from './routes/courses.js';
import materialsRouter from './routes/materials.js';
import quizzesRouter from './routes/quizzes.js';
import { testConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api', apiRouter);

// Root healthcheck
app.get('/', (req, res) => {
  res.json({
    name: 'Skill Bridge-Ai MoSPI Learning Platform API',
    status: 'online',
    mysql: 'MySQL 8.0 on localhost:3306',
    database: process.env.DB_NAME || 'samarth_stat'
  });
});

// Start Server (only if not running under Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`=======================================================`);
    console.log(`🚀 Skill Bridge-Ai Backend API running on http://localhost:${PORT}`);
    console.log(`Connecting to MySQL 8.0 Database...`);

    const status = await testConnection();
    if (status.connected) {
      console.log(`✅ MySQL Connected Successfully: ${status.user}@${status.host}:${status.port}/${status.database}`);
    } else {
      console.warn(`⚠️ MySQL Connection Warning: ${status.error}`);
    }
    console.log(`=======================================================`);
  });
}

export default app;
