import { Router } from 'express';
import { getBudgets, setBudget, getBudgetSummary } from '../controllers/budget.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.get('/summary', getBudgetSummary);

export default router;
