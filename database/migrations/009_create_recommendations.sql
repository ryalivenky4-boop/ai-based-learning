-- 009_create_recommendations.sql: Personalized course recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  course_id VARCHAR(64) NOT NULL,
  skill VARCHAR(128),
  reason TEXT,
  priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  recommendation_score DECIMAL(5, 2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recommendations_user (user_id),
  INDEX idx_recommendations_course (course_id),
  CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_recommendations_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
