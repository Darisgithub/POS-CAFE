const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
    // Create new user
    static async create(userData) {
        const { name, email, password, role = 'user' } = userData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        return {
            id: result.insertId,
            name,
            email,
            role
        };
    }

    // Find user by email
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Get all users (admin only)
    static async getAll() {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, created_at FROM users'
        );
        return rows;
    }

    // Compare password
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Check if email exists
    static async emailExists(email) {
        const [rows] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        return rows.length > 0;
    }
}

module.exports = UserModel;
