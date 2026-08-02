import { IPatientRepository } from '../interfaces/IPatientRepository.js';
import { dbGet, dbQuery, dbRun } from '../../config/sqlite.js';

export class SqlitePatientRepository implements IPatientRepository {
  async findAll(page: number, limit: number, search?: string): Promise<{ patients: any[]; total: number }> {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM patients';
    let countSql = 'SELECT COUNT(*) as count FROM patients';
    const params: any[] = [];

    if (search) {
      const searchClause = ' WHERE full_name LIKE ? OR case_id LIKE ? OR contact_phone LIKE ?';
      sql += searchClause;
      countSql += searchClause;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const patients = await dbQuery(sql, [...params, limit, offset]);
    const totalRow = await dbGet<{ count: number }>(countSql, params);

    return {
      patients,
      total: totalRow?.count || 0,
    };
  }

  async findById(id: number): Promise<any | null> {
    const row = await dbGet('SELECT * FROM patients WHERE id = ?', [id]);
    return row || null;
  }

  async findByCaseId(caseId: string): Promise<any | null> {
    const row = await dbGet('SELECT * FROM patients WHERE case_id = ?', [caseId]);
    return row || null;
  }

  async findByPhone(phone: string): Promise<any | null> {
    const row = await dbGet('SELECT * FROM patients WHERE contact_phone = ?', [phone]);
    return row || null;
  }

  async create(patientData: any): Promise<any> {
    const {
      case_id,
      full_name,
      age,
      gender,
      contact_phone,
      contact_email,
      occupation,
      address,
      lifestyle_habits,
      emergency_contact,
      emergency_phone,
    } = patientData;

    await dbRun(
      `INSERT INTO patients (
        case_id, full_name, age, gender, contact_phone, contact_email,
        occupation, address, lifestyle_habits, emergency_contact, emergency_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_id,
        full_name,
        age || null,
        gender || null,
        contact_phone,
        contact_email || null,
        occupation || null,
        address || null,
        lifestyle_habits || null,
        emergency_contact || null,
        emergency_phone || null,
      ]
    );

    const created = await this.findByCaseId(case_id);
    return created!;
  }

  async update(id: number, updates: any): Promise<any | null> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    });

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await dbRun(`UPDATE patients SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await dbRun('DELETE FROM patients WHERE id = ?', [id]);
    return res.changes > 0;
  }

  async getStats(): Promise<{ total: number; today: number; thisWeek: number; thisMonth: number }> {
    const totalRow = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM patients');
    const todayRow = await dbGet<{ count: number }>(
      "SELECT COUNT(*) as count FROM patients WHERE date(created_at) = date('now')"
    );
    const weekRow = await dbGet<{ count: number }>(
      "SELECT COUNT(*) as count FROM patients WHERE created_at >= date('now', '-7 days')"
    );
    const monthRow = await dbGet<{ count: number }>(
      "SELECT COUNT(*) as count FROM prescriptions WHERE created_at >= date('now', '-30 days')"
    );

    return {
      total: totalRow?.count || 0,
      today: todayRow?.count || 0,
      thisWeek: weekRow?.count || 0,
      thisMonth: monthRow?.count || 0,
    };
  }

  async getAnalytics(timeframe?: string): Promise<{ visits: { month: string; visits: number }[]; topRemedies: { remedy: string; count: number }[] }> {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let dateFilter = "WHERE strftime('%Y', created_at) = strftime('%Y', 'now')";
    let prescriptionDateFilter = "WHERE remedy_name IS NOT NULL AND remedy_name != '' AND strftime('%Y', created_at) = strftime('%Y', 'now')";

    if (timeframe === 'This Month') {
      dateFilter = "WHERE date(created_at) >= date('now', 'start of month')";
      prescriptionDateFilter = "WHERE remedy_name IS NOT NULL AND remedy_name != '' AND date(created_at) >= date('now', 'start of month')";
    } else if (timeframe === 'All Time') {
      dateFilter = '';
      prescriptionDateFilter = "WHERE remedy_name IS NOT NULL AND remedy_name != ''";
    }

    const rawVisits = await dbQuery<{ m: string; c: number }>(
      `SELECT strftime('%m', created_at) as m, COUNT(*) as c 
       FROM patients 
       ${dateFilter}
       GROUP BY m 
       ORDER BY m ASC`
    );

    const visits = monthNames.map((name, idx) => {
      const monthNumStr = String(idx + 1).padStart(2, '0');
      const found = rawVisits.find((v) => v.m === monthNumStr);
      return {
        month: name,
        visits: found ? Number(found.c) : 0,
      };
    });

    const rawRemedies = await dbQuery<{ remedy: string; count: number }>(
      `SELECT remedy_name as remedy, COUNT(*) as count 
       FROM prescriptions 
       ${prescriptionDateFilter}
       GROUP BY remedy_name 
       ORDER BY count DESC 
       LIMIT 6`
    );

    return {
      visits,
      topRemedies: rawRemedies.map((r) => ({ remedy: r.remedy, count: Number(r.count) })),
    };
  }

  async getRecent(limit: number): Promise<any[]> {
    return dbQuery('SELECT * FROM patients ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async search(criteria: Record<string, any>): Promise<any[]> {
    if (criteria.name) {
      return dbQuery('SELECT * FROM patients WHERE full_name LIKE ?', [`%${criteria.name}%`]);
    }
    return dbQuery('SELECT * FROM patients');
  }
}
