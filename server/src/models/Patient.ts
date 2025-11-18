import { db } from '../config/database.js';
import { Patient, CreatePatientRequest } from '../types/index.js';

export class PatientModel {
  /**
   * Get all patients with pagination and search
   */
  static async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<{ patients: Patient[]; total: number }> {
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM patients';
    let countQuery = 'SELECT COUNT(*) FROM patients';
    const params: any[] = [];
    let paramCount = 1;

    // Add search filter if provided
    if (search && search.trim()) {
      const searchCondition = `
        WHERE full_name ILIKE $${paramCount}
        OR contact_phone ILIKE $${paramCount}
        OR case_id ILIKE $${paramCount}
      `;
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Execute queries
    const [patientsResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, search ? [params[0]] : []),
    ]);

    return {
      patients: patientsResult.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  /**
   * Find patient by ID
   */
  static async findById(id: number): Promise<Patient | null> {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find patient by case ID
   */
  static async findByCaseId(caseId: string): Promise<Patient | null> {
    const result = await db.query('SELECT * FROM patients WHERE case_id = $1', [caseId]);
    return result.rows[0] || null;
  }

  /**
   * Find patient by phone
   */
  static async findByPhone(phone: string): Promise<Patient | null> {
    const result = await db.query('SELECT * FROM patients WHERE contact_phone = $1', [phone]);
    return result.rows[0] || null;
  }

  /**
   * Create new patient
   */
  static async create(patientData: CreatePatientRequest): Promise<Patient> {
    const {
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

    const result = await db.query(
      `INSERT INTO patients (
        full_name, age, gender, contact_phone, contact_email,
        occupation, address, lifestyle_habits, emergency_contact, emergency_phone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
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
      ]
    );

    return result.rows[0];
  }

  /**
   * Update patient
   */
  static async update(id: number, updates: Partial<CreatePatientRequest>): Promise<Patient | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'case_id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE patients
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete patient
   */
  static async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM patients WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  /**
   * Get patient statistics
   */
  static async getStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const result = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as this_week,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as this_month
      FROM patients
    `);

    const row = result.rows[0];
    return {
      total: parseInt(row.total),
      today: parseInt(row.today),
      thisWeek: parseInt(row.this_week),
      thisMonth: parseInt(row.this_month),
    };
  }

  /**
   * Search patients by multiple criteria
   */
  static async search(criteria: {
    name?: string;
    phone?: string;
    caseId?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
  }): Promise<Patient[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (criteria.name) {
      conditions.push(`full_name ILIKE $${paramCount}`);
      params.push(`%${criteria.name}%`);
      paramCount++;
    }

    if (criteria.phone) {
      conditions.push(`contact_phone ILIKE $${paramCount}`);
      params.push(`%${criteria.phone}%`);
      paramCount++;
    }

    if (criteria.caseId) {
      conditions.push(`case_id ILIKE $${paramCount}`);
      params.push(`%${criteria.caseId}%`);
      paramCount++;
    }

    if (criteria.gender) {
      conditions.push(`gender = $${paramCount}`);
      params.push(criteria.gender);
      paramCount++;
    }

    if (criteria.minAge) {
      conditions.push(`age >= $${paramCount}`);
      params.push(criteria.minAge);
      paramCount++;
    }

    if (criteria.maxAge) {
      conditions.push(`age <= $${paramCount}`);
      params.push(criteria.maxAge);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM patients ${whereClause} ORDER BY created_at DESC LIMIT 50`;

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Get recent patients
   */
  static async getRecent(limit: number = 10): Promise<Patient[]> {
    const result = await db.query(
      'SELECT * FROM patients ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }
}
