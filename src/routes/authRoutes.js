const express = require('express');
const AuthController = require('../controllers/authController');
const validate = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../utils/schema');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.get('/users', authenticateToken, isAdmin, AuthController.getAllUsers);

// DEVELOPMENT ONLY - Reset all users (remove in production!)
router.delete('/reset-users', AuthController.resetUsers);

module.exports = router;
