import { query } from '../config/database.js';
import { CaseRecord, CreateCaseRecordRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class CaseRecordModel {
  /**
   * Find all case records for a specific patient
   */
  static async findByPatientId(patientId: number): Promise<CaseRecord[]> {
    const result = await query(
      `SELECT * FROM case_records
       WHERE patient_id = $1
       ORDER BY consultation_date DESC`,
      [patientId]
    );
    return result.rows;
  }

  /**
   * Find case record by ID
   */
  static async findById(id: number): Promise<CaseRecord | null> {
    const result = await query(
      'SELECT * FROM case_records WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Find case record by ID with vitals and investigations
   */
  static async findByIdWithDetails(id: number): Promise<CaseRecord | null> {
    const caseRecord = await this.findById(id);
    if (!caseRecord) return null;

    // Fetch vitals
    const vitalsResult = await query(
      'SELECT * FROM vitals WHERE case_record_id = $1 ORDER BY recorded_at DESC LIMIT 1',
      [id]
    );
    if (vitalsResult.rows.length > 0) {
      caseRecord.vitals = vitalsResult.rows[0];
    }

    // Fetch investigations
    const investigationsResult = await query(
      'SELECT * FROM investigations WHERE case_record_id = $1 ORDER BY investigation_date DESC',
      [id]
    );
    caseRecord.investigations = investigationsResult.rows;

    return caseRecord;
  }

  /**
   * Create a new case record
   */
  static async create(data: CreateCaseRecordRequest, userId: number): Promise<CaseRecord> {
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
    } = data;

    const result = await query(
      `INSERT INTO case_records (
        patient_id, consultation_date, created_by,
        chief_complaints, complaint_tags, complaint_duration,
        past_history, family_history, surgical_history,
        general_examination, mental_state_examination,
        clinical_notes, diagnosis, treatment_plan,
        follow_up_notes, next_follow_up_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        patient_id,
        consultation_date || new Date(),
        userId,
        chief_complaints,
        complaint_tags ? JSON.stringify(complaint_tags) : '[]',
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
      ]
    );

    return result.rows[0];
  }

  /**
   * Update a case record
   */
  static async update(id: number, data: Partial<CreateCaseRecordRequest>): Promise<CaseRecord> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new AppError('Case record not found', 404);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Dynamically build update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'patient_id') { // Don't allow changing patient_id
        if (key === 'complaint_tags') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const result = await query(
      `UPDATE case_records SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Delete a case record
   */
  static async delete(id: number): Promise<void> {
    const result = await query('DELETE FROM case_records WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Case record not found', 404);
    }
  }

  /**
   * Get case records count for a patient
   */
  static async getCountByPatientId(patientId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM case_records WHERE patient_id = $1',
      [patientId]
    );
    return parseInt(result.rows[0].count);
  }

  /**
   * Search case records by complaint tags
   */
  static async searchByComplaintTags(tags: string[]): Promise<CaseRecord[]> {
    const result = await query(
      `SELECT cr.*, p.full_name as patient_name, p.case_id as patient_case_id
       FROM case_records cr
       JOIN patients p ON cr.patient_id = p.id
       WHERE cr.complaint_tags ?| $1
       ORDER BY cr.consultation_date DESC
       LIMIT 50`,
      [tags]
    );
    return result.rows;
  }

  /**
   * Get recent case records (for dashboard)
   */
  static async getRecent(limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT cr.*, p.full_name as patient_name, p.case_id as patient_case_id
       FROM case_records cr
       JOIN patients p ON cr.patient_id = p.id
       ORDER BY cr.consultation_date DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
