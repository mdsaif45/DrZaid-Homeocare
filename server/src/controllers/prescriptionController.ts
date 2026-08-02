import { Response } from 'express';
import { PrescriptionService } from '../services/PrescriptionService.js';
import { AuthRequest, CreatePrescriptionRequest } from '../types/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const prescriptionService = new PrescriptionService();

export const getPrescriptionsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const patientId = String(req.params.patientId);
  const prescriptions = await prescriptionService.getPrescriptionsByPatient(parseInt(patientId));

  res.json({
    success: true,
    data: { prescriptions, count: prescriptions.length },
  });
});

export const getPrescriptionsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const caseRecordId = String(req.params.caseRecordId);
  const prescriptions = await prescriptionService.getPrescriptionsByCaseRecord(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { prescriptions, count: prescriptions.length },
  });
});

export const getPrescriptionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const prescription = await prescriptionService.getPrescriptionById(parseInt(id));

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  res.json({
    success: true,
    data: { prescription },
  });
});

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

export const updatePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const data: Partial<CreatePrescriptionRequest> = req.body;

  const prescription = await prescriptionService.updatePrescription(parseInt(id), data);

  res.json({
    success: true,
    message: 'Prescription updated successfully',
    data: { prescription },
  });
});

export const deletePrescription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  await prescriptionService.deletePrescription(parseInt(id));

  res.json({
    success: true,
    message: 'Prescription deleted successfully',
  });
});

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

export const getRecentPrescriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const prescriptions = await prescriptionService.getRecent(limit);

  res.json({
    success: true,
    data: { prescriptions },
  });
});

export const getUpcomingFollowUps = asyncHandler(async (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 7;
  const prescriptions = await prescriptionService.getUpcomingFollowUps(days);

  res.json({
    success: true,
    data: { followUps: prescriptions, count: prescriptions.length },
  });
});

export const getPrescriptionStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await prescriptionService.getStats();

  res.json({
    success: true,
    data: stats,
  });
});
