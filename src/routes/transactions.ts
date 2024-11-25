import express from 'express';
import { createTransaction, getTransactionById, filterTransactions, getTransactionsByUser } from '../services/transactionService';

const router = express.Router();

router.post('/create', createTransaction);
router.get('/', getTransactionsByUser);
// router.get('/download', generateReport);
// router.get('/:id', getTransactionById);
router.get('/filter', filterTransactions);

export default router;
