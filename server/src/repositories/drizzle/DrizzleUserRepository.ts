import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, UserSelect, UserInsert } from '../../db/schema/users.js';
import { IUserRepository } from '../interfaces/IUserRepository.js';

export class DrizzleUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserSelect | null> {
    const res = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return res[0] || null;
  }

  async findById(id: number): Promise<UserSelect | null> {
    const res = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return res[0] || null;
  }

  async create(user: UserInsert): Promise<UserSelect> {
    const res = await db.insert(users).values(user).returning();
    return res[0];
  }

  async update(id: number, updates: Partial<UserInsert>): Promise<UserSelect | null> {
    const res = await db.update(users).set({ ...updates, updated_at: new Date() }).where(eq(users.id, id)).returning();
    return res[0] || null;
  }

  async changePassword(userId: number, passwordHash: string): Promise<boolean> {
    const res = await db.update(users).set({ password_hash: passwordHash, updated_at: new Date() }).where(eq(users.id, userId)).returning();
    return res.length > 0;
  }

  async findAll(): Promise<UserSelect[]> {
    return db.select().from(users);
  }

  async delete(id: number): Promise<boolean> {
    const res = await db.delete(users).where(eq(users.id, id)).returning();
    return res.length > 0;
  }

  async isActive(userId: number): Promise<boolean> {
    const res = await db.select({ is_active: users.is_active }).from(users).where(eq(users.id, userId)).limit(1);
    return res[0]?.is_active || false;
  }

  async deactivate(userId: number): Promise<boolean> {
    const res = await db.update(users).set({ is_active: false, updated_at: new Date() }).where(eq(users.id, userId)).returning();
    return res.length > 0;
  }

  async activate(userId: number): Promise<boolean> {
    const res = await db.update(users).set({ is_active: true, updated_at: new Date() }).where(eq(users.id, userId)).returning();
    return res.length > 0;
  }
}
