const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Authentication error' });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Check if user is admin or the same user
const isAdminOrSelf = (req, res, next) => {
    const userId = parseInt(req.params.id);

    if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({
            message: 'Access denied. Insufficient privileges.'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    isAdmin,
    isAdminOrSelf
};
