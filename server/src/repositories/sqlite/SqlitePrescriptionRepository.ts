import { IPrescriptionRepository } from '../interfaces/IPrescriptionRepository.js';
import { dbGet, dbQuery, dbRun } from '../../config/sqlite.js';

export class SqlitePrescriptionRepository implements IPrescriptionRepository {
  async findByPatientId(patientId: number): Promise<any[]> {
    return dbQuery('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY prescription_date DESC', [patientId]);
  }

  async findByCaseRecordId(caseRecordId: number): Promise<any[]> {
    return dbQuery('SELECT * FROM prescriptions WHERE case_record_id = ? ORDER BY prescription_date DESC', [caseRecordId]);
  }

  async findById(id: number): Promise<any | null> {
    const row = await dbGet('SELECT * FROM prescriptions WHERE id = ?', [id]);
    return row || null;
  }

  async findByIdWithDetails(id: number): Promise<any> {
    const row = await dbGet(
      `SELECT p.*, pt.full_name AS patient_name, pt.case_id AS patient_case_id
       FROM prescriptions p
       LEFT JOIN patients pt ON p.patient_id = pt.id
       WHERE p.id = ?`,
      [id]
    );
    return row || null;
  }

  async create(data: any): Promise<any> {
    const {
      case_record_id,
      patient_id,
      prescribed_by,
      remedy_name,
      potency,
      dosage,
      repetition,
      instructions,
      prescription_date,
      follow_up_date,
    } = data;

    await dbRun(
      `INSERT INTO prescriptions (
        case_record_id, patient_id, prescribed_by, remedy_name,
        potency, dosage, repetition, instructions, prescription_date, follow_up_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_record_id || null,
        patient_id,
        prescribed_by || null,
        remedy_name,
        potency || null,
        dosage || null,
        repetition || null,
        instructions || null,
        prescription_date ? new Date(prescription_date).toISOString() : new Date().toISOString(),
        follow_up_date ? new Date(follow_up_date).toISOString() : null,
      ]
    );

    const rows = await dbQuery('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY id DESC LIMIT 1', [patient_id]);
    return rows[0];
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

    await dbRun(`UPDATE prescriptions SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await dbRun('DELETE FROM prescriptions WHERE id = ?', [id]);
    return res.changes > 0;
  }

  async searchByRemedy(remedyName: string): Promise<any[]> {
    return dbQuery('SELECT * FROM prescriptions WHERE remedy_name LIKE ? ORDER BY prescription_date DESC', [`%${remedyName}%`]);
  }

  async getRecent(limit: number): Promise<any[]> {
    return dbQuery('SELECT * FROM prescriptions ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async getUpcomingFollowUps(days: number): Promise<any[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    return dbQuery(
      `SELECT * FROM prescriptions
       WHERE follow_up_date IS NOT NULL
         AND datetime(follow_up_date) >= datetime('now')
         AND datetime(follow_up_date) <= datetime(?)
       ORDER BY follow_up_date ASC`,
      [targetDate.toISOString()]
    );
  }

  async getStats(): Promise<any> {
    const row = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM prescriptions');
    return { totalPrescriptions: row?.count || 0 };
  }
}
