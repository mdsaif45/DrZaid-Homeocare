import { CaseRecordSelect, CaseRecordInsert } from '../../db/schema/caseRecords.js';

export interface ICaseRecordRepository {
  findByPatientId(patientId: number): Promise<CaseRecordSelect[]>;
  findById(id: number): Promise<CaseRecordSelect | null>;
  findByIdWithDetails(id: number): Promise<any>;
  create(data: CaseRecordInsert): Promise<CaseRecordSelect>;
  update(id: number, updates: Partial<CaseRecordInsert>): Promise<CaseRecordSelect | null>;
  delete(id: number): Promise<boolean>;
  searchByComplaintTags(tags: string[]): Promise<CaseRecordSelect[]>;
  getRecent(limit: number): Promise<CaseRecordSelect[]>;
}
