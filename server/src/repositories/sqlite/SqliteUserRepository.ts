import { IUserRepository } from '../interfaces/IUserRepository.js';
import { dbGet, dbQuery, dbRun } from '../../config/sqlite.js';

export class SqliteUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<any | null> {
    const row = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return row ? this.mapUser(row) : null;
  }

  async findById(id: number): Promise<any | null> {
    const row = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return row ? this.mapUser(row) : null;
  }

  async create(userData: any): Promise<any> {
    const { email, password_hash, full_name, phone, role = 'doctor' } = userData;
    await dbRun(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [email, password_hash, full_name, phone || null, role]
    );

    const created = await this.findByEmail(email);
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

    await dbRun(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async changePassword(userId: number, passwordHash: string): Promise<boolean> {
    const res = await dbRun(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, userId]
    );
    return res.changes > 0;
  }

  async findAll(): Promise<any[]> {
    const rows = await dbQuery('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map((r) => this.mapUser(r));
  }

  async delete(id: number): Promise<boolean> {
    const res = await dbRun('DELETE FROM users WHERE id = ?', [id]);
    return res.changes > 0;
  }

  async isActive(userId: number): Promise<boolean> {
    const row = await dbGet<{ is_active: number }>('SELECT is_active FROM users WHERE id = ?', [userId]);
    return row ? Boolean(row.is_active) : false;
  }

  async deactivate(userId: number): Promise<boolean> {
    const res = await dbRun('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    return res.changes > 0;
  }

  async activate(userId: number): Promise<boolean> {
    const res = await dbRun('UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    return res.changes > 0;
  }

  private mapUser(row: any) {
    return {
      ...row,
      is_active: Boolean(row.is_active),
    };
  }
}
