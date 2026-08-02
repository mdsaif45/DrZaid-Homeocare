import { envConfig } from '../config/env.js';
import { IPatientRepository } from './interfaces/IPatientRepository.js';
import { ICaseRecordRepository } from './interfaces/ICaseRecordRepository.js';
import { IPrescriptionRepository } from './interfaces/IPrescriptionRepository.js';
import { IUserRepository } from './interfaces/IUserRepository.js';

import { SqlitePatientRepository } from './sqlite/SqlitePatientRepository.js';
import { SqliteCaseRecordRepository } from './sqlite/SqliteCaseRecordRepository.js';
import { SqlitePrescriptionRepository } from './sqlite/SqlitePrescriptionRepository.js';
import { SqliteUserRepository } from './sqlite/SqliteUserRepository.js';

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
      switch (envConfig.dbProvider) {
        case 'postgres':
        case 'drizzle':
          this.patientRepo = new DrizzlePatientRepository();
          break;
        case 'sqlite':
        default:
          this.patientRepo = new SqlitePatientRepository();
          break;
      }
    }
    return this.patientRepo;
  }

  public static getCaseRecordRepository(): ICaseRecordRepository {
    if (!this.caseRecordRepo) {
      switch (envConfig.dbProvider) {
        case 'postgres':
        case 'drizzle':
          this.caseRecordRepo = new DrizzleCaseRecordRepository();
          break;
        case 'sqlite':
        default:
          this.caseRecordRepo = new SqliteCaseRecordRepository();
          break;
      }
    }
    return this.caseRecordRepo;
  }

  public static getPrescriptionRepository(): IPrescriptionRepository {
    if (!this.prescriptionRepo) {
      switch (envConfig.dbProvider) {
        case 'postgres':
        case 'drizzle':
          this.prescriptionRepo = new DrizzlePrescriptionRepository();
          break;
        case 'sqlite':
        default:
          this.prescriptionRepo = new SqlitePrescriptionRepository();
          break;
      }
    }
    return this.prescriptionRepo;
  }

  public static getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      switch (envConfig.dbProvider) {
        case 'postgres':
        case 'drizzle':
          this.userRepo = new DrizzleUserRepository();
          break;
        case 'sqlite':
        default:
          this.userRepo = new SqliteUserRepository();
          break;
      }
    }
    return this.userRepo;
  }
}
