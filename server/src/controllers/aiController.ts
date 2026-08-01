import { Response } from 'express';
import { AiRepertoryService } from '../services/AiRepertoryService.js';
import { AuthRequest } from '../types/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const aiService = new AiRepertoryService();

/**
 * @desc    Get AI Homeopathic Remedy Repertory Match
 * @route   POST /api/ai/repertory-match
 * @access  Private
 */
export const matchRepertory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { chief_complaints, general_examination, mental_state_examination, tags } = req.body;

  if (!chief_complaints && !tags?.length) {
    throw new AppError('Please provide chief complaints or symptom tags for AI analysis', 400);
  }

  const result = await aiService.matchRepertory({
    chief_complaints,
    general_examination,
    mental_state_examination,
    tags,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
