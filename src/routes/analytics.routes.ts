import { Router } from 'express';
import { getMonthlyAnalytics, getCategoryAnalytics } from '../controllers/analytics.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/monthly', getMonthlyAnalytics);
router.get('/categories', getCategoryAnalytics);

export default router;
