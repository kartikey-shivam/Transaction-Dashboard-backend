import express from 'express';
import { createTransaction, getTransactionById, filterTransactions, getTransactionsByUser, downloadCSV } from '../services/transactionService';

const router = express.Router();

router.post('/create', createTransaction);
router.get('/', getTransactionsByUser);
router.post('/download-csv', downloadCSV);
// router.get('/:id', getTransactionById);
router.get('/filter', filterTransactions);

export default router;
