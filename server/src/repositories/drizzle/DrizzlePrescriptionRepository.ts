import { eq, desc, ilike, count, gte, lte, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { prescriptions, PrescriptionSelect, PrescriptionInsert } from '../../db/schema/prescriptions.js';
import { patients } from '../../db/schema/patients.js';
import { IPrescriptionRepository } from '../interfaces/IPrescriptionRepository.js';

export class DrizzlePrescriptionRepository implements IPrescriptionRepository {
  async findByPatientId(patientId: number): Promise<PrescriptionSelect[]> {
    return db.select().from(prescriptions).where(eq(prescriptions.patient_id, patientId)).orderBy(desc(prescriptions.prescription_date));
  }

  async findByCaseRecordId(caseRecordId: number): Promise<PrescriptionSelect[]> {
    return db.select().from(prescriptions).where(eq(prescriptions.case_record_id, caseRecordId)).orderBy(desc(prescriptions.prescription_date));
  }

  async findById(id: number): Promise<PrescriptionSelect | null> {
    const res = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    return res[0] || null;
  }

  async findByIdWithDetails(id: number): Promise<any> {
    const res = await db
      .select({
        prescription: prescriptions,
        patient_name: patients.full_name,
        patient_case_id: patients.case_id,
      })
      .from(prescriptions)
      .leftJoin(patients, eq(prescriptions.patient_id, patients.id))
      .where(eq(prescriptions.id, id))
      .limit(1);

    if (!res[0]) return null;

    return {
      ...res[0].prescription,
      patient_name: res[0].patient_name,
      patient_case_id: res[0].patient_case_id,
    };
  }

  async create(data: PrescriptionInsert): Promise<PrescriptionSelect> {
    const res = await db.insert(prescriptions).values(data).returning();
    return res[0];
  }

  async update(id: number, updates: Partial<PrescriptionInsert>): Promise<PrescriptionSelect | null> {
    const res = await db.update(prescriptions).set({ ...updates, updated_at: new Date() }).where(eq(prescriptions.id, id)).returning();
    return res[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const res = await db.delete(prescriptions).where(eq(prescriptions.id, id)).returning();
    return res.length > 0;
  }

  async searchByRemedy(remedyName: string): Promise<PrescriptionSelect[]> {
    return db.select().from(prescriptions).where(ilike(prescriptions.remedy_name, `%${remedyName}%`)).orderBy(desc(prescriptions.prescription_date));
  }

  async getRecent(limit: number): Promise<PrescriptionSelect[]> {
    return db.select().from(prescriptions).orderBy(desc(prescriptions.created_at)).limit(limit);
  }

  async getUpcomingFollowUps(days: number): Promise<PrescriptionSelect[]> {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    return db
      .select()
      .from(prescriptions)
      .where(and(gte(prescriptions.follow_up_date, today), lte(prescriptions.follow_up_date, future)))
      .orderBy(prescriptions.follow_up_date);
  }

  async getStats(): Promise<any> {
    const total = await db.select({ count: count() }).from(prescriptions);
    return { totalPrescriptions: Number(total[0]?.count || 0) };
  }
}
