-- 005_update_courses.sql: Courses table preserving sample course records & supporting live iGOT data
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  provider VARCHAR(128),
  category VARCHAR(128),
  skill VARCHAR(128),
  difficulty VARCHAR(64) DEFAULT 'Intermediate',
  duration VARCHAR(64),
  duration_hours DECIMAL(5, 1) DEFAULT 0.0,
  course_url VARCHAR(512),
  source ENUM('SAMPLE', 'IGOT') NOT NULL DEFAULT 'SAMPLE',
  external_course_id VARCHAR(128),
  is_sample BOOLEAN NOT NULL DEFAULT TRUE,
  karmayogi_credits INT DEFAULT 150,
  syllabus_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_courses_skill (skill),
  INDEX idx_courses_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
