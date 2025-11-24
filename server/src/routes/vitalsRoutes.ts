import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateVitals, deleteVitals } from '../controllers/caseRecordController.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Vitals update/delete by ID
router.put('/:id', updateVitals);
router.delete('/:id', deleteVitals);

export default router;
