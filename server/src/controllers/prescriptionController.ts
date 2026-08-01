import { Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService.js';
import { AuthRequest, CreatePrescriptionRequest } from '../types/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const prescriptionService = new PrescriptionService();

/**
 * @desc    Get all prescriptions for a patient
 * @route   GET /api/prescriptions/patient/:patientId
 * @access  Private
 */
export const getPrescriptionsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const prescriptions = await prescriptionService.getPrescriptionsByPatient(parseInt(patientId));

  res.json({
    success: true,
    data: { prescriptions, count: prescriptions.length },
  });
});

/**
 * @desc    Get prescriptions for a case record
 * @route   GET /api/prescriptions/case-record/:caseRecordId
 * @access  Private
 */
export const getPrescriptionsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { caseRecordId } = req.params;
  const prescriptions = await prescriptionService.getPrescriptionsByCaseRecord(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { prescriptions, count: prescriptions.length },
  });
});

/**
 * @desc    Get single prescription with details
 * @route   GET /api/prescriptions/:id
 * @access  Private
 */
export const getPrescriptionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const prescription = await prescriptionService.getPrescriptionById(parseInt(id));

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  res.json({
    success: true,
    data: { prescription },
  });
});

/**
 * @desc    Create new prescription
 * @route   POST /api/prescriptions
 * @access  Private
 */
export const createPrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: CreatePrescriptionRequest = req.body;
  const userId = req.user!.id;

  const prescription = await prescriptionService.createPrescription(data, userId);

  res.status(201).json({
    success: true,
    message: 'Prescription created successfully',
    data: { prescription },
  });
});

/**
 * @desc    Update prescription
 * @route   PUT /api/prescriptions/:id
 * @access  Private
 */
export const updatePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data: Partial<CreatePrescriptionRequest> = req.body;

  const prescription = await prescriptionService.updatePrescription(parseInt(id), data);

  res.json({
    success: true,
    message: 'Prescription updated successfully',
    data: { prescription },
  });
});

/**
 * @desc    Delete prescription
 * @route   DELETE /api/prescriptions/:id
 * @access  Private
 */
export const deletePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prescriptionService.deletePrescription(parseInt(id));

  res.json({
    success: true,
    message: 'Prescription deleted successfully',
  });
});

/**
 * @desc    Search prescriptions by remedy name
 * @route   GET /api/prescriptions/search?remedy=name
 * @access  Private
 */
export const searchPrescriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { remedy } = req.query;

  if (!remedy || typeof remedy !== 'string') {
    throw new AppError('Please provide a remedy name to search', 400);
  }

  const prescriptions = await prescriptionService.searchByRemedy(remedy);

  res.json({
    success: true,
    data: { prescriptions, count: prescriptions.length },
  });
});

/**
 * @desc    Get recent prescriptions
 * @route   GET /api/prescriptions/recent
 * @access  Private
 */
export const getRecentPrescriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const prescriptions = await prescriptionService.getRecent(limit);

  res.json({
    success: true,
    data: { prescriptions },
  });
});

/**
 * @desc    Get upcoming follow-ups
 * @route   GET /api/prescriptions/follow-ups
 * @access  Private
 */
export const getUpcomingFollowUps = asyncHandler(async (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 7;
  const prescriptions = await prescriptionService.getUpcomingFollowUps(days);

  res.json({
    success: true,
    data: { followUps: prescriptions, count: prescriptions.length },
  });
});

/**
 * @desc    Get prescription statistics
 * @route   GET /api/prescriptions/stats
 * @access  Private
 */
export const getPrescriptionStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await prescriptionService.getStats();

  res.json({
    success: true,
    data: stats,
  });
});
