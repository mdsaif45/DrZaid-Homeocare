import { db } from '../config/database.js';
import bcrypt from 'bcrypt';
import { User, UserResponse, RegisterRequest } from '../types/index.js';

export class UserModel {
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Create new user
   */
  static async create(userData: RegisterRequest): Promise<User> {
    const { email, password, full_name, phone, role = 'doctor' } = userData;

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password_hash, full_name, phone, role]
    );

    return result.rows[0];
  }

  /**
   * Update user
   */
  static async update(id: number, updates: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
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
      UPDATE users
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Change password
   */
  static async changePassword(userId: number, newPassword: string): Promise<boolean> {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const result = await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [password_hash, userId]
    );

    return result.rowCount! > 0;
  }

  /**
   * Get all users (admin only)
   */
  static async findAll(): Promise<User[]> {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  /**
   * Convert User to UserResponse (remove sensitive data)
   */
  static toResponse(user: User): UserResponse {
    const { password_hash, ...userResponse } = user;
    return userResponse as UserResponse;
  }

  /**
   * Check if user is active
   */
  static async isActive(userId: number): Promise<boolean> {
    const result = await db.query(
      'SELECT is_active FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0]?.is_active || false;
  }

  /**
   * Deactivate user
   */
  static async deactivate(userId: number): Promise<boolean> {
    const result = await db.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    return result.rowCount! > 0;
  }

  /**
   * Activate user
   */
  static async activate(userId: number): Promise<boolean> {
    const result = await db.query(
      'UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    return result.rowCount! > 0;
  }
}
