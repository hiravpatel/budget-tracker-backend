import { Router } from 'express';
import { exportCSV, exportPDF } from '../controllers/export.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

export default router;
