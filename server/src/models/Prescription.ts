import { query } from '../config/database.js';
import { Prescription, CreatePrescriptionRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class PrescriptionModel {
  /**
   * Find all prescriptions for a specific patient
   */
  static async findByPatientId(patientId: number): Promise<Prescription[]> {
    const result = await query(
      `SELECT * FROM prescriptions
       WHERE patient_id = $1
       ORDER BY prescription_date DESC`,
      [patientId]
    );
    return result.rows;
  }

  /**
   * Find prescriptions by case record ID
   */
  static async findByCaseRecordId(caseRecordId: number): Promise<Prescription[]> {
    const result = await query(
      `SELECT * FROM prescriptions
       WHERE case_record_id = $1
       ORDER BY prescription_date DESC`,
      [caseRecordId]
    );
    return result.rows;
  }

  /**
   * Find prescription by ID
   */
  static async findById(id: number): Promise<Prescription | null> {
    const result = await query('SELECT * FROM prescriptions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find prescription by ID with patient and case record details
   */
  static async findByIdWithDetails(id: number): Promise<any | null> {
    const result = await query(
      `SELECT
        p.*,
        pat.full_name as patient_name,
        pat.case_id as patient_case_id,
        u.full_name as prescribed_by_name,
        cr.consultation_date as case_consultation_date
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.id
       JOIN users u ON p.prescribed_by = u.id
       LEFT JOIN case_records cr ON p.case_record_id = cr.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new prescription
   */
  static async create(data: CreatePrescriptionRequest, userId: number): Promise<Prescription> {
    const {
      case_record_id,
      patient_id,
      remedy_name,
      potency,
      dosage,
      repetition,
      instructions,
      prescription_date,
      follow_up_date,
    } = data;

    const result = await query(
      `INSERT INTO prescriptions (
        case_record_id, patient_id, prescribed_by,
        remedy_name, potency, dosage, repetition, instructions,
        prescription_date, follow_up_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        case_record_id || null,
        patient_id,
        userId,
        remedy_name,
        potency,
        dosage,
        repetition,
        instructions,
        prescription_date || new Date(),
        follow_up_date || null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Update a prescription
   */
  static async update(id: number, data: Partial<CreatePrescriptionRequest>): Promise<Prescription> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new AppError('Prescription not found', 404);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Dynamically build update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'patient_id') {
        // Don't allow changing patient_id
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const result = await query(
      `UPDATE prescriptions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Delete a prescription
   */
  static async delete(id: number): Promise<void> {
    const result = await query('DELETE FROM prescriptions WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Prescription not found', 404);
    }
  }

  /**
   * Get prescriptions count for a patient
   */
  static async getCountByPatientId(patientId: number): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = $1',
      [patientId]
    );
    return parseInt(result.rows[0].count);
  }

  /**
   * Search prescriptions by remedy name
   */
  static async searchByRemedy(remedyName: string): Promise<any[]> {
    const result = await query(
      `SELECT
        p.*,
        pat.full_name as patient_name,
        pat.case_id as patient_case_id
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.id
       WHERE p.remedy_name ILIKE $1
       ORDER BY p.prescription_date DESC
       LIMIT 50`,
      [`%${remedyName}%`]
    );
    return result.rows;
  }

  /**
   * Get recent prescriptions (for dashboard)
   */
  static async getRecent(limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT
        p.*,
        pat.full_name as patient_name,
        pat.case_id as patient_case_id
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.id
       ORDER BY p.prescription_date DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  /**
   * Get prescriptions with upcoming follow-ups
   */
  static async getUpcomingFollowUps(days: number = 7): Promise<any[]> {
    const result = await query(
      `SELECT
        p.*,
        pat.full_name as patient_name,
        pat.case_id as patient_case_id,
        pat.contact_phone
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.id
       WHERE p.follow_up_date IS NOT NULL
       AND p.follow_up_date BETWEEN CURRENT_DATE AND CURRENT_DATE + $1
       ORDER BY p.follow_up_date ASC`,
      [days]
    );
    return result.rows;
  }

  /**
   * Get prescription statistics
   */
  static async getStats(): Promise<{
    total: number;
    thisWeek: number;
    thisMonth: number;
    upcomingFollowUps: number;
  }> {
    const totalResult = await query('SELECT COUNT(*) as count FROM prescriptions');

    const weekResult = await query(
      `SELECT COUNT(*) as count FROM prescriptions
       WHERE prescription_date >= CURRENT_DATE - INTERVAL '7 days'`
    );

    const monthResult = await query(
      `SELECT COUNT(*) as count FROM prescriptions
       WHERE prescription_date >= CURRENT_DATE - INTERVAL '30 days'`
    );

    const followUpResult = await query(
      `SELECT COUNT(*) as count FROM prescriptions
       WHERE follow_up_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`
    );

    return {
      total: parseInt(totalResult.rows[0].count),
      thisWeek: parseInt(weekResult.rows[0].count),
      thisMonth: parseInt(monthResult.rows[0].count),
      upcomingFollowUps: parseInt(followUpResult.rows[0].count),
    };
  }
}
