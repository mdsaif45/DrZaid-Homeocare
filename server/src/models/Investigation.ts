import { query } from '../config/database.js';
import { Investigation, CreateInvestigationRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class InvestigationModel {
  /**
   * Find investigations by case record ID
   */
  static async findByCaseRecordId(caseRecordId: number): Promise<Investigation[]> {
    const result = await query(
      'SELECT * FROM investigations WHERE case_record_id = $1 ORDER BY investigation_date DESC',
      [caseRecordId]
    );
    return result.rows;
  }

  /**
   * Find investigation by ID
   */
  static async findById(id: number): Promise<Investigation | null> {
    const result = await query('SELECT * FROM investigations WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create investigation record
   */
  static async create(
    data: CreateInvestigationRequest,
    fileData?: {
      file_url: string;
      file_name: string;
      file_type: string;
      file_size: number;
    }
  ): Promise<Investigation> {
    const {
      case_record_id,
      investigation_type,
      investigation_name,
      notes,
      findings,
      investigation_date,
    } = data;

    const result = await query(
      `INSERT INTO investigations (
        case_record_id, investigation_type, investigation_name,
        notes, findings, investigation_date,
        file_url, file_name, file_type, file_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        case_record_id,
        investigation_type,
        investigation_name,
        notes,
        findings,
        investigation_date || new Date(),
        fileData?.file_url || null,
        fileData?.file_name || null,
        fileData?.file_type || null,
        fileData?.file_size || null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Update investigation record
   */
  static async update(
    id: number,
    data: Partial<CreateInvestigationRequest>,
    fileData?: {
      file_url: string;
      file_name: string;
      file_type: string;
      file_size: number;
    }
  ): Promise<Investigation> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new AppError('Investigation record not found', 404);
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

    if (fileData) {
      fields.push(`file_url = $${paramCount}`);
      values.push(fileData.file_url);
      paramCount++;

      fields.push(`file_name = $${paramCount}`);
      values.push(fileData.file_name);
      paramCount++;

      fields.push(`file_type = $${paramCount}`);
      values.push(fileData.file_type);
      paramCount++;

      fields.push(`file_size = $${paramCount}`);
      values.push(fileData.file_size);
      paramCount++;
    }

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const result = await query(
      `UPDATE investigations SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Delete investigation record
   */
  static async delete(id: number): Promise<void> {
    const result = await query('DELETE FROM investigations WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new AppError('Investigation record not found', 404);
    }
  }

  /**
   * Get all investigations for a patient
   */
  static async findByPatientId(patientId: number): Promise<Investigation[]> {
    const result = await query(
      `SELECT i.* FROM investigations i
       JOIN case_records cr ON i.case_record_id = cr.id
       WHERE cr.patient_id = $1
       ORDER BY i.investigation_date DESC`,
      [patientId]
    );
    return result.rows;
  }
}
