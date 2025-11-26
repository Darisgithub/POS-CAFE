const TransactionService = require('../services/transactionService');

const TransactionController = {
    getAll: async (req, res, next) => {
        try {
            const transactions = await TransactionService.getAllTransactions();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const transaction = await TransactionService.getTransactionById(req.params.id);
            res.json(transaction);
        } catch (error) {
            if (error.message === 'Transaction not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const transaction = await TransactionService.createTransaction(req.body);
            res.status(201).json(transaction);
        } catch (error) {
            if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    }
};

module.exports = TransactionController;
