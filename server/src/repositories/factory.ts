import { IPatientRepository } from './interfaces/IPatientRepository.js';
import { ICaseRecordRepository } from './interfaces/ICaseRecordRepository.js';
import { IPrescriptionRepository } from './interfaces/IPrescriptionRepository.js';
import { IUserRepository } from './interfaces/IUserRepository.js';

import { DrizzlePatientRepository } from './drizzle/DrizzlePatientRepository.js';
import { DrizzleCaseRecordRepository } from './drizzle/DrizzleCaseRecordRepository.js';
import { DrizzlePrescriptionRepository } from './drizzle/DrizzlePrescriptionRepository.js';
import { DrizzleUserRepository } from './drizzle/DrizzleUserRepository.js';

export class RepositoryFactory {
  private static patientRepo: IPatientRepository;
  private static caseRecordRepo: ICaseRecordRepository;
  private static prescriptionRepo: IPrescriptionRepository;
  private static userRepo: IUserRepository;

  public static getPatientRepository(): IPatientRepository {
    if (!this.patientRepo) {
      this.patientRepo = new DrizzlePatientRepository();
    }
    return this.patientRepo;
  }

  public static getCaseRecordRepository(): ICaseRecordRepository {
    if (!this.caseRecordRepo) {
      this.caseRecordRepo = new DrizzleCaseRecordRepository();
    }
    return this.caseRecordRepo;
  }

  public static getPrescriptionRepository(): IPrescriptionRepository {
    if (!this.prescriptionRepo) {
      this.prescriptionRepo = new DrizzlePrescriptionRepository();
    }
    return this.prescriptionRepo;
  }

  public static getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      this.userRepo = new DrizzleUserRepository();
    }
    return this.userRepo;
  }
}
