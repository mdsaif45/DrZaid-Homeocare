import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPrescriptionsByPatient,
  getPrescriptionsByCaseRecord,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  searchPrescriptions,
  getRecentPrescriptions,
  getUpcomingFollowUps,
  getPrescriptionStats,
} from '../controllers/prescriptionController.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Special routes (before :id routes)
router.get('/stats', getPrescriptionStats);
router.get('/recent', getRecentPrescriptions);
router.get('/follow-ups', getUpcomingFollowUps);
router.get('/search', searchPrescriptions);
router.get('/patient/:patientId', getPrescriptionsByPatient);
router.get('/case-record/:caseRecordId', getPrescriptionsByCaseRecord);

// CRUD routes
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
