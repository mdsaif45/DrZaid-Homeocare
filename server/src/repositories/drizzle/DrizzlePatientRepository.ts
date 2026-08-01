import { eq, ilike, or, count, desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { patients, PatientSelect, PatientInsert } from '../../db/schema/patients.js';
import { IPatientRepository } from '../interfaces/IPatientRepository.js';

export class DrizzlePatientRepository implements IPatientRepository {
  async findAll(page: number, limit: number, search?: string): Promise<{ patients: PatientSelect[]; total: number }> {
    const offset = (page - 1) * limit;
    let whereCondition;

    if (search) {
      whereCondition = or(
        ilike(patients.full_name, `%${search}%`),
        ilike(patients.case_id, `%${search}%`),
        ilike(patients.contact_phone, `%${search}%`)
      );
    }

    const data = await db
      .select()
      .from(patients)
      .where(whereCondition)
      .orderBy(desc(patients.created_at))
      .limit(limit)
      .offset(offset);

    const totalCountRes = await db
      .select({ count: count() })
      .from(patients)
      .where(whereCondition);

    return {
      patients: data,
      total: Number(totalCountRes[0]?.count || 0),
    };
  }

  async findById(id: number): Promise<PatientSelect | null> {
    const res = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
    return res[0] || null;
  }

  async findByCaseId(caseId: string): Promise<PatientSelect | null> {
    const res = await db.select().from(patients).where(eq(patients.case_id, caseId)).limit(1);
    return res[0] || null;
  }

  async findByPhone(phone: string): Promise<PatientSelect | null> {
    const res = await db.select().from(patients).where(eq(patients.contact_phone, phone)).limit(1);
    return res[0] || null;
  }

  async create(patient: PatientInsert): Promise<PatientSelect> {
    const res = await db.insert(patients).values(patient).returning();
    return res[0];
  }

  async update(id: number, updates: Partial<PatientInsert>): Promise<PatientSelect | null> {
    const res = await db.update(patients).set({ ...updates, updated_at: new Date() }).where(eq(patients.id, id)).returning();
    return res[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const res = await db.delete(patients).where(eq(patients.id, id)).returning();
    return res.length > 0;
  }

  async getStats(): Promise<{ totalPatients: number }> {
    const total = await db.select({ count: count() }).from(patients);
    return { totalPatients: Number(total[0]?.count || 0) };
  }

  async getRecent(limit: number): Promise<PatientSelect[]> {
    return db.select().from(patients).orderBy(desc(patients.created_at)).limit(limit);
  }

  async search(criteria: Record<string, any>): Promise<PatientSelect[]> {
    let query = db.select().from(patients);
    if (criteria.name) {
      query.where(ilike(patients.full_name, `%${criteria.name}%`));
    }
    return query;
  }
}
