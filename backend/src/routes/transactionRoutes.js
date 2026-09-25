import express from 'express';
import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionController.js';
import { validateTransaction } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/', validateTransaction, createTransaction);
router.put('/:id', validateTransaction, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
