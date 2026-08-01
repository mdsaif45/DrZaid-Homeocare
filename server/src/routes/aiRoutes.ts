import { Router } from 'express';
import { matchRepertory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/repertory-match', matchRepertory);

export default router;
