import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateInvestigation, deleteInvestigation } from '../controllers/caseRecordController.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Investigation update/delete by ID
router.put('/:id', updateInvestigation);
router.delete('/:id', deleteInvestigation);

export default router;
