const express = require('express');
const TransactionController = require('../controllers/transactionController');
const validate = require('../middlewares/validation');
const { transactionSchema } = require('../utils/schema');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// All authenticated users can create transactions
router.post('/', authenticateToken, validate(transactionSchema), TransactionController.create);

// Only admin can view all transactions
router.get('/', authenticateToken, isAdmin, TransactionController.getAll);
router.get('/:id', authenticateToken, isAdmin, TransactionController.getById);

module.exports = router;
