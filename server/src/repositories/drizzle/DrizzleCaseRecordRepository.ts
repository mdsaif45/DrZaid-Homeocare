import { eq, desc, arrayContains } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { caseRecords, CaseRecordSelect, CaseRecordInsert } from '../../db/schema/caseRecords.js';
import { vitals } from '../../db/schema/vitals.js';
import { investigations } from '../../db/schema/investigations.js';
import { ICaseRecordRepository } from '../interfaces/ICaseRecordRepository.js';

export class DrizzleCaseRecordRepository implements ICaseRecordRepository {
  async findByPatientId(patientId: number): Promise<CaseRecordSelect[]> {
    return db.select().from(caseRecords).where(eq(caseRecords.patient_id, patientId)).orderBy(desc(caseRecords.consultation_date));
  }

  async findById(id: number): Promise<CaseRecordSelect | null> {
    const res = await db.select().from(caseRecords).where(eq(caseRecords.id, id)).limit(1);
    return res[0] || null;
  }

  async findByIdWithDetails(id: number): Promise<any> {
    const caseRec = await this.findById(id);
    if (!caseRec) return null;

    const vitalsList = await db.select().from(vitals).where(eq(vitals.case_record_id, id));
    const investigationsList = await db.select().from(investigations).where(eq(investigations.case_record_id, id));

    return {
      ...caseRec,
      vitals: vitalsList[0] || null,
      investigations: investigationsList,
    };
  }

  async create(data: CaseRecordInsert): Promise<CaseRecordSelect> {
    const res = await db.insert(caseRecords).values(data).returning();
    return res[0];
  }

  async update(id: number, updates: Partial<CaseRecordInsert>): Promise<CaseRecordSelect | null> {
    const res = await db.update(caseRecords).set({ ...updates, updated_at: new Date() }).where(eq(caseRecords.id, id)).returning();
    return res[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const res = await db.delete(caseRecords).where(eq(caseRecords.id, id)).returning();
    return res.length > 0;
  }

  async searchByComplaintTags(tags: string[]): Promise<CaseRecordSelect[]> {
    return db.select().from(caseRecords).where(arrayContains(caseRecords.complaint_tags, tags));
  }

  async getRecent(limit: number): Promise<CaseRecordSelect[]> {
    return db.select().from(caseRecords).orderBy(desc(caseRecords.created_at)).limit(limit);
  }
}
