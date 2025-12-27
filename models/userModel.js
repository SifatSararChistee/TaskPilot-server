const { promisePool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password, phone, gender } = userData;
    
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    
    const query = `
      INSERT INTO users (name, email, password, phone, gender) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const [result] = await promisePool.execute(query, [name, email, hashedPassword, phone, gender]);
      return { id: result.insertId, name, email, phone, gender };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    const query = 'SELECT id, name, email, phone, gender, created_at, updated_at FROM users';
    const [rows] = await promisePool.execute(query);
    return rows;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, phone, gender, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await promisePool.execute(query, [id]);
    return rows[0] || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await promisePool.execute(query, [email]);
    return rows[0] || null;
  }

  // Update user
  static async update(id, userData) {
    const { name, email, phone, gender } = userData;
    
    const query = `
      UPDATE users 
      SET name = ?, email = ?, phone = ?, gender = ? 
      WHERE id = ?
    `;
    
    try {
      const [result] = await promisePool.execute(query, [name, email, phone, gender, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.findById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await promisePool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;