import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { CreatePatientRequest, AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

const patientService = new PatientService();

/**
 * Get all patients with pagination and search
 * GET /api/patients?page=1&limit=20&search=keyword
 */
export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;

  const { patients, total } = await patientService.getPatients(page, limit, search);

  res.status(200).json({
    success: true,
    data: {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const patient = await patientService.getPatientById(parseInt(id));

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { patient },
  });
});

/**
 * Create new patient
 * POST /api/patients
 */
export const createPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const patientData: CreatePatientRequest = req.body;

  const patient = await patientService.createPatient(patientData);

  logger.info(`New patient created: ${patient.case_id} by user ${req.user?.email}`);

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: { patient },
  });
});

/**
 * Update patient
 * PUT /api/patients/:id
 */
export const updatePatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<CreatePatientRequest> = req.body;

  const patient = await patientService.updatePatient(parseInt(id), updates);

  logger.info(`Patient updated: ${patient?.case_id} by user ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Patient updated successfully',
    data: { patient },
  });
});

/**
 * Delete patient
 * DELETE /api/patients/:id
 */
export const deletePatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await patientService.deletePatient(parseInt(id));

  logger.info(`Patient deleted ID: ${id} by user ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Patient deleted successfully',
  });
});

/**
 * Get patient statistics
 * GET /api/patients/stats
 */
export const getPatientStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await patientService.getStats();

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

/**
 * Search patients by criteria
 * POST /api/patients/search
 */
export const searchPatients = asyncHandler(async (req: Request, res: Response) => {
  const criteria = req.body;

  const patients = await patientService.searchPatients(criteria);

  res.status(200).json({
    success: true,
    data: { patients, count: patients.length },
  });
});

/**
 * Get recent patients
 * GET /api/patients/recent
 */
export const getRecentPatients = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const patients = await patientService.getRecent(limit);

  res.status(200).json({
    success: true,
    data: { patients },
  });
});

/**
 * Get patient by case ID
 * GET /api/patients/case/:caseId
 */
export const getPatientByCaseId = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;

  const patient = await patientService.getPatientByCaseId(caseId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { patient },
  });
});
