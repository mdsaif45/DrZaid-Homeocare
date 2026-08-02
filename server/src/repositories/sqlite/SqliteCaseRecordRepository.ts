import { ICaseRecordRepository } from '../interfaces/ICaseRecordRepository.js';
import { dbGet, dbQuery, dbRun } from '../../config/sqlite.js';

export class SqliteCaseRecordRepository implements ICaseRecordRepository {
  async findByPatientId(patientId: number): Promise<any[]> {
    const rows = await dbQuery('SELECT * FROM case_records WHERE patient_id = ? ORDER BY consultation_date DESC', [patientId]);
    return rows.map((r) => this.mapRecord(r));
  }

  async findById(id: number): Promise<any | null> {
    const row = await dbGet('SELECT * FROM case_records WHERE id = ?', [id]);
    return row ? this.mapRecord(row) : null;
  }

  async findByIdWithDetails(id: number): Promise<any> {
    const caseRec = await this.findById(id);
    if (!caseRec) return null;

    const vitalsList = await dbQuery('SELECT * FROM vitals WHERE case_record_id = ?', [id]);
    const investigationsList = await dbQuery('SELECT * FROM investigations WHERE case_record_id = ?', [id]);

    return {
      ...caseRec,
      vitals: vitalsList[0] || null,
      investigations: investigationsList,
    };
  }

  async create(data: any): Promise<any> {
    const {
      patient_id,
      consultation_date,
      chief_complaints,
      complaint_tags,
      complaint_duration,
      past_history,
      family_history,
      surgical_history,
      general_examination,
      mental_state_examination,
      clinical_notes,
      diagnosis,
      treatment_plan,
      follow_up_notes,
      next_follow_up_date,
      created_by,
    } = data;

    const tagsJson = Array.isArray(complaint_tags) ? JSON.stringify(complaint_tags) : complaint_tags || null;

    await dbRun(
      `INSERT INTO case_records (
        patient_id, consultation_date, chief_complaints, complaint_tags,
        complaint_duration, past_history, family_history, surgical_history,
        general_examination, mental_state_examination, clinical_notes,
        diagnosis, treatment_plan, follow_up_notes, next_follow_up_date, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        consultation_date ? new Date(consultation_date).toISOString() : new Date().toISOString(),
        chief_complaints || null,
        tagsJson,
        complaint_duration || null,
        past_history || null,
        family_history || null,
        surgical_history || null,
        general_examination || null,
        mental_state_examination || null,
        clinical_notes || null,
        diagnosis || null,
        treatment_plan || null,
        follow_up_notes || null,
        next_follow_up_date ? new Date(next_follow_up_date).toISOString() : null,
        created_by || null,
      ]
    );

    const rows = await dbQuery('SELECT * FROM case_records WHERE patient_id = ? ORDER BY id DESC LIMIT 1', [patient_id]);
    return this.mapRecord(rows[0]);
  }

  async update(id: number, updates: any): Promise<any | null> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(key === 'complaint_tags' && Array.isArray(val) ? JSON.stringify(val) : val);
      }
    });

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await dbRun(`UPDATE case_records SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await dbRun('DELETE FROM case_records WHERE id = ?', [id]);
    return res.changes > 0;
  }

  async searchByComplaintTags(tags: string[]): Promise<any[]> {
    const all = await dbQuery('SELECT * FROM case_records');
    return all
      .map((r) => this.mapRecord(r))
      .filter((r) => tags.some((t) => r.complaint_tags?.includes(t)));
  }

  async getRecent(limit: number): Promise<any[]> {
    const rows = await dbQuery('SELECT * FROM case_records ORDER BY created_at DESC LIMIT ?', [limit]);
    return rows.map((r) => this.mapRecord(r));
  }

  private mapRecord(row: any) {
    let complaint_tags = [];
    if (row?.complaint_tags) {
      try {
        complaint_tags = typeof row.complaint_tags === 'string' ? JSON.parse(row.complaint_tags) : row.complaint_tags;
      } catch {
        complaint_tags = [row.complaint_tags];
      }
    }
    return {
      ...row,
      complaint_tags,
    };
  }
}
