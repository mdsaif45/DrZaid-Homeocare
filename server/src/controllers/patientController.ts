// @ts-nocheck
import { Request, Response } from 'express';
import { PatientModel } from '../models/Patient.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { CreatePatientRequest, AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Get all patients with pagination and search
 * GET /api/patients?page=1&limit=20&search=keyword
 */
export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;

  const { patients, total } = await PatientModel.findAll(page, limit, search);

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

  const patient = await PatientModel.findById(parseInt(id));

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

  // Validate required fields
  if (!patientData.full_name || !patientData.contact_phone) {
    throw new AppError('Full name and contact phone are required', 400);
  }

  // Check if patient with same phone already exists
  const existingPatient = await PatientModel.findByPhone(patientData.contact_phone);
  if (existingPatient) {
    throw new AppError('Patient with this phone number already exists', 409);
  }

  // Create patient
  const patient = await PatientModel.create(patientData);

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

  // Check if patient exists
  const existingPatient = await PatientModel.findById(parseInt(id));
  if (!existingPatient) {
    throw new AppError('Patient not found', 404);
  }

  // If updating phone, check for duplicates
  if (updates.contact_phone && updates.contact_phone !== existingPatient.contact_phone) {
    const duplicatePatient = await PatientModel.findByPhone(updates.contact_phone);
    if (duplicatePatient) {
      throw new AppError('Another patient with this phone number already exists', 409);
    }
  }

  // Update patient
  const patient = await PatientModel.update(parseInt(id), updates);

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

  // Check if patient exists
  const patient = await PatientModel.findById(parseInt(id));
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Delete patient
  await PatientModel.delete(parseInt(id));

  logger.info(`Patient deleted: ${patient.case_id} by user ${req.user?.email}`);

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
  const stats = await PatientModel.getStats();

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

  const patients = await PatientModel.search(criteria);

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

  const patients = await PatientModel.getRecent(limit);

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

  const patient = await PatientModel.findByCaseId(caseId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { patient },
  });
});
