import { RepositoryFactory } from '../repositories/factory.js';
import { IPatientRepository } from '../repositories/interfaces/IPatientRepository.js';
import { CreatePatientRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class PatientService {
  private patientRepo: IPatientRepository;

  constructor(patientRepo?: IPatientRepository) {
    this.patientRepo = patientRepo || RepositoryFactory.getPatientRepository();
  }

  private generateCaseId(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `HC-${new Date().getFullYear()}-${randomDigits}`;
  }

  async getPatients(page: number, limit: number, search?: string) {
    return this.patientRepo.findAll(page, limit, search);
  }

  async getPatientById(id: number) {
    return this.patientRepo.findById(id);
  }

  async getPatientByCaseId(caseId: string) {
    return this.patientRepo.findByCaseId(caseId);
  }

  async createPatient(data: CreatePatientRequest) {
    if (!data.full_name || !data.contact_phone) {
      throw new AppError('Full name and contact phone are required', 400);
    }

    const existing = await this.patientRepo.findByPhone(data.contact_phone);
    if (existing) {
      throw new AppError('Patient with this phone number already exists', 409);
    }

    const case_id = this.generateCaseId();

    return this.patientRepo.create({
      ...data,
      case_id,
    });
  }

  async updatePatient(id: number, updates: Partial<CreatePatientRequest>) {
    const existing = await this.patientRepo.findById(id);
    if (!existing) {
      throw new AppError('Patient not found', 404);
    }

    if (updates.contact_phone && updates.contact_phone !== existing.contact_phone) {
      const duplicate = await this.patientRepo.findByPhone(updates.contact_phone);
      if (duplicate) {
        throw new AppError('Another patient with this phone number already exists', 409);
      }
    }

    return this.patientRepo.update(id, updates);
  }

  async deletePatient(id: number) {
    const existing = await this.patientRepo.findById(id);
    if (!existing) {
      throw new AppError('Patient not found', 404);
    }
    return this.patientRepo.delete(id);
  }

  async getStats() {
    return this.patientRepo.getStats();
  }

  async getRecent(limit: number) {
    return this.patientRepo.getRecent(limit);
  }

  async searchPatients(criteria: Record<string, any>) {
    return this.patientRepo.search(criteria);
  }
}
