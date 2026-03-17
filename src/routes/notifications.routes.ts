import { Router } from 'express';
import { subscribe, testNotification } from '../controllers/notifications.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/subscribe', subscribe);
router.post('/test', testNotification);

export default router;
