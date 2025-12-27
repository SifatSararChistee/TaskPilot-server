-- Create database
CREATE DATABASE IF NOT EXISTS user_management_system;
USE user_management_system;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table with proper constraints and data types
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO users (name, email, password, phone, gender) VALUES
('John Doe', 'john.doe@example.com', '$2b$10$samplehashedpassword1', '+1234567890', 'Male'),
('Jane Smith', 'jane.smith@example.com', '$2b$10$samplehashedpassword2', '+0987654321', 'Female'),
('Alex Johnson', 'alex.johnson@example.com', '$2b$10$samplehashedpassword3', '+1122334455', 'Other');