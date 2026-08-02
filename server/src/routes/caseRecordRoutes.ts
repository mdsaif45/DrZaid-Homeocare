import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCaseRecordsByPatient,
  getCaseRecordById,
  createCaseRecord,
  updateCaseRecord,
  deleteCaseRecord,
  searchCaseRecordsByTags,
  getRecentCaseRecords,
  getVitalsByCaseRecord,
  createVitals,
  updateVitals,
  deleteVitals,
  getInvestigationsByCaseRecord,
  createInvestigation,
  updateInvestigation,
  deleteInvestigation,
} from '../controllers/caseRecordController.js';

const router: Router = Router();

// All routes require authentication
router.use(protect);

// Case Record Routes (special routes before :id routes)
router.get('/recent', getRecentCaseRecords);
router.post('/search', searchCaseRecordsByTags);
router.get('/patient/:patientId', getCaseRecordsByPatient);

// Case Record CRUD
router.get('/:id', getCaseRecordById);
router.post('/', createCaseRecord);
router.put('/:id', updateCaseRecord);
router.delete('/:id', deleteCaseRecord);

// Vitals Routes (nested under case records)
router.get('/:caseRecordId/vitals', getVitalsByCaseRecord);
router.post('/:caseRecordId/vitals', createVitals);

// Investigations Routes (nested under case records)
router.get('/:caseRecordId/investigations', getInvestigationsByCaseRecord);
router.post('/:caseRecordId/investigations', createInvestigation);

export default router;
