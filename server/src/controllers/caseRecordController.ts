// @ts-nocheck
import { Response } from 'express';
import { CaseRecordModel } from '../models/CaseRecord.js';
import { VitalsModel } from '../models/Vitals.js';
import { InvestigationModel } from '../models/Investigation.js';
import { AuthRequest, CreateCaseRecordRequest, CreateVitalsRequest, CreateInvestigationRequest } from '../types/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all case records for a patient
 * @route   GET /api/case-records/patient/:patientId
 * @access  Private
 */
export const getCaseRecordsByPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const caseRecords = await CaseRecordModel.findByPatientId(parseInt(patientId));

  res.json({
    success: true,
    data: { caseRecords, count: caseRecords.length },
  });
});

/**
 * @desc    Get single case record with details (vitals, investigations)
 * @route   GET /api/case-records/:id
 * @access  Private
 */
export const getCaseRecordById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const caseRecord = await CaseRecordModel.findByIdWithDetails(parseInt(id));

  if (!caseRecord) {
    throw new AppError('Case record not found', 404);
  }

  res.json({
    success: true,
    data: { caseRecord },
  });
});

/**
 * @desc    Create new case record
 * @route   POST /api/case-records
 * @access  Private
 */
export const createCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: CreateCaseRecordRequest = req.body;
  const userId = req.user!.id;

  const caseRecord = await CaseRecordModel.create(data, userId);

  res.status(201).json({
    success: true,
    message: 'Case record created successfully',
    data: { caseRecord },
  });
});

/**
 * @desc    Update case record
 * @route   PUT /api/case-records/:id
 * @access  Private
 */
export const updateCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data: Partial<CreateCaseRecordRequest> = req.body;

  const caseRecord = await CaseRecordModel.update(parseInt(id), data);

  res.json({
    success: true,
    message: 'Case record updated successfully',
    data: { caseRecord },
  });
});

/**
 * @desc    Delete case record
 * @route   DELETE /api/case-records/:id
 * @access  Private
 */
export const deleteCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await CaseRecordModel.delete(parseInt(id));

  res.json({
    success: true,
    message: 'Case record deleted successfully',
  });
});

/**
 * @desc    Search case records by complaint tags
 * @route   POST /api/case-records/search
 * @access  Private
 */
export const searchCaseRecordsByTags = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    throw new AppError('Please provide tags array', 400);
  }

  const caseRecords = await CaseRecordModel.searchByComplaintTags(tags);

  res.json({
    success: true,
    data: { caseRecords, count: caseRecords.length },
  });
});

/**
 * @desc    Get recent case records
 * @route   GET /api/case-records/recent
 * @access  Private
 */
export const getRecentCaseRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const caseRecords = await CaseRecordModel.getRecent(limit);

  res.json({
    success: true,
    data: { caseRecords },
  });
});

// ============= VITALS CONTROLLERS =============

/**
 * @desc    Get vitals for a case record
 * @route   GET /api/case-records/:caseRecordId/vitals
 * @access  Private
 */
export const getVitalsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { caseRecordId } = req.params;
  const vitals = await VitalsModel.findByCaseRecordId(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { vitals },
  });
});

/**
 * @desc    Create vitals record
 * @route   POST /api/case-records/:caseRecordId/vitals
 * @access  Private
 */
export const createVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { caseRecordId } = req.params;
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

/**
 * @desc    Update vitals record
 * @route   PUT /api/vitals/:id
 * @access  Private
 */
export const updateVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data: Partial<CreateVitalsRequest> = req.body;

  const vitals = await VitalsModel.update(parseInt(id), data);

  res.json({
    success: true,
    message: 'Vitals updated successfully',
    data: { vitals },
  });
});

/**
 * @desc    Delete vitals record
 * @route   DELETE /api/vitals/:id
 * @access  Private
 */
export const deleteVitals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await VitalsModel.delete(parseInt(id));

  res.json({
    success: true,
    message: 'Vitals deleted successfully',
  });
});

// ============= INVESTIGATIONS CONTROLLERS =============

/**
 * @desc    Get investigations for a case record
 * @route   GET /api/case-records/:caseRecordId/investigations
 * @access  Private
 */
export const getInvestigationsByCaseRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { caseRecordId } = req.params;
  const investigations = await InvestigationModel.findByCaseRecordId(parseInt(caseRecordId));

  res.json({
    success: true,
    data: { investigations },
  });
});

/**
 * @desc    Create investigation record (without file)
 * @route   POST /api/case-records/:caseRecordId/investigations
 * @access  Private
 */
export const createInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { caseRecordId } = req.params;
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

/**
 * @desc    Update investigation record
 * @route   PUT /api/investigations/:id
 * @access  Private
 */
export const updateInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data: Partial<CreateInvestigationRequest> = req.body;

  const investigation = await InvestigationModel.update(parseInt(id), data);

  res.json({
    success: true,
    message: 'Investigation updated successfully',
    data: { investigation },
  });
});

/**
 * @desc    Delete investigation record
 * @route   DELETE /api/investigations/:id
 * @access  Private
 */
export const deleteInvestigation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await InvestigationModel.delete(parseInt(id));

  res.json({
    success: true,
    message: 'Investigation deleted successfully',
  });
});
