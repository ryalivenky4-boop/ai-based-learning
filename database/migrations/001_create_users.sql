-- 001_create_users.sql: Real User table with secure authentication fields
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  phone_number VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  job_role VARCHAR(128),
  department VARCHAR(128),
  organization VARCHAR(128) DEFAULT 'MoSPI',
  experience_level VARCHAR(64) DEFAULT 'Intermediate',
  career_goal TEXT,
  karmayogi_credits INT DEFAULT 100,
  streak_days INT DEFAULT 1,
  learning_hours DECIMAL(6, 1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
