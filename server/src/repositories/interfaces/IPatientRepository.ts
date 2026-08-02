import { PatientSelect, PatientInsert } from '../../db/schema/patients.js';

export interface IPatientRepository {
  findAll(page: number, limit: number, search?: string): Promise<{ patients: PatientSelect[]; total: number }>;
  findById(id: number): Promise<PatientSelect | null>;
  findByCaseId(caseId: string): Promise<PatientSelect | null>;
  findByPhone(phone: string): Promise<PatientSelect | null>;
  create(patient: PatientInsert): Promise<PatientSelect>;
  update(id: number, updates: Partial<PatientInsert>): Promise<PatientSelect | null>;
  delete(id: number): Promise<boolean>;
  getStats(): Promise<{ total: number; today: number; thisWeek: number; thisMonth: number }>;
  getAnalytics(timeframe?: string): Promise<{ visits: { month: string; visits: number }[]; topRemedies: { remedy: string; count: number }[] }>;
  getRecent(limit: number): Promise<PatientSelect[]>;
  search(criteria: Record<string, any>): Promise<PatientSelect[]>;
}
