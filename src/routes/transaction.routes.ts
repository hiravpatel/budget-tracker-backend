import { Router } from 'express';
import { getTransactions, createTransaction, getTransactionById, updateTransaction, deleteTransaction } from '../controllers/transaction.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
