import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { CreatePatientRequest, AuthRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';

const patientService = new PatientService();

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

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const patient = await patientService.getPatientById(parseInt(id));

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { patient },
  });
});

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

export const updatePatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const updates: Partial<CreatePatientRequest> = req.body;

  const patient = await patientService.updatePatient(parseInt(id), updates);

  logger.info(`Patient updated: ${patient?.case_id} by user ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Patient updated successfully',
    data: { patient },
  });
});

export const deletePatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);

  await patientService.deletePatient(parseInt(id));

  logger.info(`Patient deleted ID: ${id} by user ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'Patient deleted successfully',
  });
});

export const getPatientStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await patientService.getStats();

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

export const searchPatients = asyncHandler(async (req: Request, res: Response) => {
  const criteria = req.body;

  const patients = await patientService.searchPatients(criteria);

  res.status(200).json({
    success: true,
    data: { patients, count: patients.length },
  });
});

export const getRecentPatients = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const patients = await patientService.getRecent(limit);

  res.status(200).json({
    success: true,
    data: { patients },
  });
});

export const getPatientByCaseId = asyncHandler(async (req: Request, res: Response) => {
  const caseId = String(req.params.caseId);

  const patient = await patientService.getPatientByCaseId(caseId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { patient },
  });
});
