import { Router } from 'express';
import { register, login, refresh, logout, changePassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changePassword);

export default router;
