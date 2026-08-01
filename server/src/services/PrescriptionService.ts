import { RepositoryFactory } from '../repositories/factory.js';
import { IPrescriptionRepository } from '../repositories/interfaces/IPrescriptionRepository.js';
import { CreatePrescriptionRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class PrescriptionService {
  private prescriptionRepo: IPrescriptionRepository;

  constructor(prescriptionRepo?: IPrescriptionRepository) {
    this.prescriptionRepo = prescriptionRepo || RepositoryFactory.getPrescriptionRepository();
  }

  async getPrescriptionsByPatient(patientId: number) {
    return this.prescriptionRepo.findByPatientId(patientId);
  }

  async getPrescriptionsByCaseRecord(caseRecordId: number) {
    return this.prescriptionRepo.findByCaseRecordId(caseRecordId);
  }

  async getPrescriptionById(id: number) {
    return this.prescriptionRepo.findByIdWithDetails(id);
  }

  async createPrescription(data: CreatePrescriptionRequest, userId: number) {
    if (!data.patient_id || !data.remedy_name) {
      throw new AppError('Patient ID and remedy name are required', 400);
    }
    return this.prescriptionRepo.create({
      ...data,
      prescribed_by: userId,
      prescription_date: data.prescription_date ? new Date(data.prescription_date) : new Date(),
      follow_up_date: data.follow_up_date ? new Date(data.follow_up_date) : undefined,
    });
  }

  async updatePrescription(id: number, updates: Partial<CreatePrescriptionRequest>) {
    const existing = await this.prescriptionRepo.findById(id);
    if (!existing) {
      throw new AppError('Prescription not found', 404);
    }
    return this.prescriptionRepo.update(id, {
      ...updates,
      prescription_date: updates.prescription_date ? new Date(updates.prescription_date) : undefined,
      follow_up_date: updates.follow_up_date ? new Date(updates.follow_up_date) : undefined,
    });
  }

  async deletePrescription(id: number) {
    const existing = await this.prescriptionRepo.findById(id);
    if (!existing) {
      throw new AppError('Prescription not found', 404);
    }
    return this.prescriptionRepo.delete(id);
  }

  async searchByRemedy(remedyName: string) {
    return this.prescriptionRepo.searchByRemedy(remedyName);
  }

  async getRecent(limit: number) {
    return this.prescriptionRepo.getRecent(limit);
  }

  async getUpcomingFollowUps(days: number) {
    return this.prescriptionRepo.getUpcomingFollowUps(days);
  }

  async getStats() {
    return this.prescriptionRepo.getStats();
  }
}
