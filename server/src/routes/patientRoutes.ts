import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats,
  searchPatients,
  getRecentPatients,
  getPatientByCaseId,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All patient routes require authentication
router.use(protect);

// Stats and special routes (must be before :id routes)
router.get('/stats', getPatientStats);
router.get('/recent', getRecentPatients);
router.post('/search', searchPatients);
router.get('/case/:caseId', getPatientByCaseId);

// CRUD routes
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
