import { eq, ilike, or, count, desc, gte, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { patients, PatientSelect, PatientInsert } from '../../db/schema/patients.js';
import { prescriptions } from '../../db/schema/prescriptions.js';
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

  async getStats(): Promise<{ total: number; today: number; thisWeek: number; thisMonth: number }> {
    const total = await db.select({ count: count() }).from(patients);
    const today = await db.select({ count: count() }).from(patients).where(sql`DATE(created_at) = CURRENT_DATE`);
    const week = await db.select({ count: count() }).from(patients).where(sql`created_at >= NOW() - INTERVAL '7 days'`);
    const month = await db.select({ count: count() }).from(prescriptions).where(sql`created_at >= NOW() - INTERVAL '30 days'`);

    return {
      total: Number(total[0]?.count || 0),
      today: Number(today[0]?.count || 0),
      thisWeek: Number(week[0]?.count || 0),
      thisMonth: Number(month[0]?.count || 0),
    };
  }

  async getAnalytics(): Promise<{ visits: { month: string; visits: number }[]; topRemedies: { remedy: string; count: number }[] }> {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const rawVisits = await db
      .select({
        m: sql<string>`TO_CHAR(created_at, 'MM')`,
        c: count(),
      })
      .from(patients)
      .groupBy(sql`TO_CHAR(created_at, 'MM')`);

    const visits = monthNames.map((name, idx) => {
      const monthNumStr = String(idx + 1).padStart(2, '0');
      const found = rawVisits.find((v) => v.m === monthNumStr);
      return {
        month: name,
        visits: found ? Number(found.c) : 0,
      };
    });

    const rawRemedies = await db
      .select({
        remedy: prescriptions.remedy_name,
        count: count(),
      })
      .from(prescriptions)
      .groupBy(prescriptions.remedy_name)
      .orderBy(desc(count()))
      .limit(6);

    return {
      visits,
      topRemedies: rawRemedies.map((r) => ({ remedy: r.remedy || 'Unknown', count: Number(r.count) })),
    };
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
