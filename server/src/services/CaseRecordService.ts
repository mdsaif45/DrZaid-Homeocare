import { RepositoryFactory } from '../repositories/factory.js';
import { ICaseRecordRepository } from '../repositories/interfaces/ICaseRecordRepository.js';
import { CreateCaseRecordRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class CaseRecordService {
  private caseRecordRepo: ICaseRecordRepository;

  constructor(caseRecordRepo?: ICaseRecordRepository) {
    this.caseRecordRepo = caseRecordRepo || RepositoryFactory.getCaseRecordRepository();
  }

  async getCaseRecordsByPatient(patientId: number) {
    return this.caseRecordRepo.findByPatientId(patientId);
  }

  async getCaseRecordById(id: number) {
    return this.caseRecordRepo.findByIdWithDetails(id);
  }

  async createCaseRecord(data: CreateCaseRecordRequest, userId: number) {
    return this.caseRecordRepo.create({
      ...data,
      consultation_date: data.consultation_date ? new Date(data.consultation_date) : new Date(),
      next_follow_up_date: data.next_follow_up_date ? new Date(data.next_follow_up_date) : undefined,
      created_by: userId,
    });
  }

  async updateCaseRecord(id: number, updates: Partial<CreateCaseRecordRequest>) {
    const existing = await this.caseRecordRepo.findById(id);
    if (!existing) {
      throw new AppError('Case record not found', 404);
    }
    return this.caseRecordRepo.update(id, {
      ...updates,
      consultation_date: updates.consultation_date ? new Date(updates.consultation_date) : undefined,
      next_follow_up_date: updates.next_follow_up_date ? new Date(updates.next_follow_up_date) : undefined,
    });
  }

  async deleteCaseRecord(id: number) {
    const existing = await this.caseRecordRepo.findById(id);
    if (!existing) {
      throw new AppError('Case record not found', 404);
    }
    return this.caseRecordRepo.delete(id);
  }

  async searchByTags(tags: string[]) {
    return this.caseRecordRepo.searchByComplaintTags(tags);
  }

  async getRecent(limit: number) {
    return this.caseRecordRepo.getRecent(limit);
  }
}
