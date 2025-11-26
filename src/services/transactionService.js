const TransactionModel = require('../models/transactionModel');

const TransactionService = {
    getAllTransactions: async () => {
        return await TransactionModel.findAll();
    },

    getTransactionById: async (id) => {
        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    },

    createTransaction: async (data) => {
        return await TransactionModel.create(data);
    }
};

module.exports = TransactionService;
