import { Response } from 'express';
import { CaseRecordService } from '../services/CaseRecordService.js';
import { VitalsModel } from '../models/Vitals.js';
import { InvestigationModel } from '../models/Investigation.js';
import { AuthRequest, CreateCaseRecordRequest, CreateVitalsRequest, CreateInvestigationRequest } from '../types/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const caseRecordService = new CaseRecordService();

export const getCaseRecordsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const patientId = String(req.params.patientId);
  const caseRecords = await caseRecordService.getCaseRecordsByPatient(parseInt(patientId));

  res.json({
    success: true,
    data: { caseRecords, count: caseRecords.length },
  });
});

export const getCaseRecordById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const caseRecord = await caseRecordService.getCaseRecordById(parseInt(id));

  if (!caseRecord) {
    throw new AppError('Case record not found', 404);
  }

  res.json({
    success: true,
    data: { caseRecord },
  });
});

export const createCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: CreateCaseRecordRequest = req.body;
  const userId = req.user!.id;

  const caseRecord = await caseRecordService.createCaseRecord(data, userId);

  res.status(201).json({
    success: true,
    message: 'Case record created successfully',
    data: { caseRecord },
  });
});

export const updateCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const data: Partial<CreateCaseRecordRequest> = req.body;

  const caseRecord = await caseRecordService.updateCaseRecord(parseInt(id), data);

  res.json({
    success: true,
    message: 'Case record updated successfully',
    data: { caseRecord },
  });
});

export const deleteCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  await caseRecordService.deleteCaseRecord(parseInt(id));

  res.json({
    success: true,
    message: 'Case record deleted successfully',
  });
});

export const searchCaseRecordsByTags = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    throw new AppError('Please provide tags array', 400);
  }

  const caseRecords = await caseRecordService.searchByTags(tags);

  res.json({
    success: true,
    data: { caseRecords, count: caseRecords.length },
  });
});

export const getRecentCaseRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const caseRecords = await caseRecordService.getRecent(limit);

  res.json({
    success: true,
    data: { caseRecords },
  });
});

export const getVitalsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const caseRecordId = String(req.params.caseRecordId);
  const vitals = await VitalsModel.findByCaseRecordId(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { vitals },
  });
});

export const createVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const caseRecordId = String(req.params.caseRecordId);
  const data: CreateVitalsRequest = {
    ...req.body,
    case_record_id: parseInt(caseRecordId),
  };

  const vitals = await VitalsModel.create(data);

  res.status(201).json({
    success: true,
    message: 'Vitals recorded successfully',
    data: { vitals },
  });
});

export const updateVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const data: Partial<CreateVitalsRequest> = req.body;

  const vitals = await VitalsModel.update(parseInt(id), data);

  res.json({
    success: true,
    message: 'Vitals updated successfully',
    data: { vitals },
  });
});

export const deleteVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  await VitalsModel.delete(parseInt(id));

  res.json({
    success: true,
    message: 'Vitals deleted successfully',
  });
});

export const getInvestigationsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const caseRecordId = String(req.params.caseRecordId);
  const investigations = await InvestigationModel.findByCaseRecordId(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { investigations },
  });
});

export const createInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const caseRecordId = String(req.params.caseRecordId);
  const data: CreateInvestigationRequest = {
    ...req.body,
    case_record_id: parseInt(caseRecordId),
  };

  const investigation = await InvestigationModel.create(data);

  res.status(201).json({
    success: true,
    message: 'Investigation record created successfully',
    data: { investigation },
  });
});

export const updateInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const data: Partial<CreateInvestigationRequest> = req.body;

  const investigation = await InvestigationModel.update(parseInt(id), data);

  res.json({
    success: true,
    message: 'Investigation updated successfully',
    data: { investigation },
  });
});

export const deleteInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  await InvestigationModel.delete(parseInt(id));

  res.json({
    success: true,
    message: 'Investigation deleted successfully',
  });
});
