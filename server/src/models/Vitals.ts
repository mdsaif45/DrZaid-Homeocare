import { query } from '../config/database.js';
import { Vitals, CreateVitalsRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class VitalsModel {
  /**
   * Find vitals by case record ID
   */
  static async findByCaseRecordId(caseRecordId: number): Promise<Vitals[]> {
    const result = await query(
      'SELECT * FROM vitals WHERE case_record_id = $1 ORDER BY recorded_at DESC',
      [caseRecordId]
    );
    return result.rows;
  }

  /**
   * Find vitals by ID
   */
  static async findById(id: number): Promise<Vitals | null> {
    const result = await query('SELECT * FROM vitals WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create vitals record
   */
  static async create(data: CreateVitalsRequest): Promise<Vitals> {
    const {
      case_record_id,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      pulse_rate,
      respiratory_rate,
      temperature,
      temperature_unit,
      oxygen_saturation,
      height,
      weight,
      notes,
    } = data;

    const result = await query(
      `INSERT INTO vitals (
        case_record_id, blood_pressure_systolic, blood_pressure_diastolic,
        pulse_rate, respiratory_rate, temperature, temperature_unit,
        oxygen_saturation, height, weight, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        case_record_id,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        pulse_rate,
        respiratory_rate,
        temperature,
        temperature_unit || 'C',
        oxygen_saturation,
        height,
        weight,
        notes,
      ]
    );

    return result.rows[0];
  }

  /**
   * Update vitals record
   */
  static async update(id: number, data: Partial<CreateVitalsRequest>): Promise<Vitals> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new AppError('Vitals record not found', 404);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'case_record_id') {
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
      `UPDATE vitals SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Delete vitals record
   */
  static async delete(id: number): Promise<void> {
    const result = await query('DELETE FROM vitals WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Vitals record not found', 404);
    }
  }

  /**
   * Get latest vitals for a patient
   */
  static async getLatestForPatient(patientId: number): Promise<Vitals | null> {
    const result = await query(
      `SELECT v.* FROM vitals v
       JOIN case_records cr ON v.case_record_id = cr.id
       WHERE cr.patient_id = $1
       ORDER BY v.recorded_at DESC
       LIMIT 1`,
      [patientId]
    );
    return result.rows[0] || null;
  }
}
