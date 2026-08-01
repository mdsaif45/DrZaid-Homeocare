import { PrescriptionSelect, PrescriptionInsert } from '../../db/schema/prescriptions.js';

export interface IPrescriptionRepository {
  findByPatientId(patientId: number): Promise<PrescriptionSelect[]>;
  findByCaseRecordId(caseRecordId: number): Promise<PrescriptionSelect[]>;
  findById(id: number): Promise<PrescriptionSelect | null>;
  findByIdWithDetails(id: number): Promise<any>;
  create(data: PrescriptionInsert): Promise<PrescriptionSelect>;
  update(id: number, updates: Partial<PrescriptionInsert>): Promise<PrescriptionSelect | null>;
  delete(id: number): Promise<boolean>;
  searchByRemedy(remedyName: string): Promise<PrescriptionSelect[]>;
  getRecent(limit: number): Promise<PrescriptionSelect[]>;
  getUpcomingFollowUps(days: number): Promise<PrescriptionSelect[]>;
  getStats(): Promise<any>;
}
