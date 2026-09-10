-- 004_create_competency_gaps.sql: AI competency gap assessment table
CREATE TABLE IF NOT EXISTS competency_gaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  skill_name VARCHAR(128) NOT NULL,
  current_score INT NOT NULL DEFAULT 0,
  target_score INT NOT NULL DEFAULT 0,
  gap_score INT NOT NULL DEFAULT 0,
  priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  ai_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_competency_gaps_user_id (user_id),
  CONSTRAINT fk_competency_gaps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
