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
import { validateRequest } from '../middleware/validate.js';
import { createPatientSchema, updatePatientSchema } from '../schemas/index.js';

const router: Router = Router();

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
router.post('/', validateRequest(createPatientSchema), createPatient);
router.put('/:id', validateRequest(updatePatientSchema), updatePatient);
router.delete('/:id', deletePatient);

export default router;
