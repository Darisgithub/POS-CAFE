const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

class AuthController {
    // Register new user
    static async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // Check if email already exists
            const emailExists = await UserModel.emailExists(email);
            if (emailExists) {
                return res.status(400).json({
                    message: 'Email already registered'
                });
            }

            // Create user
            const user = await UserModel.create({
                name,
                email,
                password,
                role: role || 'user'
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Login user
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await UserModel.findByEmail(email);

            if (!user) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isPasswordValid = await UserModel.comparePassword(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.json({
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get current user profile
    static async getProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json({
                message: 'Profile retrieved successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all users (admin only)
    static async getAllUsers(req, res, next) {
        try {
            const users = await UserModel.getAll();

            res.json({
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    // Reset all users (DEVELOPMENT ONLY - Remove in production!)
    static async resetUsers(req, res, next) {
        try {
            const { pool } = require('../config/database');

            // Delete all users
            await pool.query('DELETE FROM users');

            res.json({
                message: 'All users have been deleted successfully',
                note: 'You can now register new users'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
