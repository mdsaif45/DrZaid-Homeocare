import { UserSelect, UserInsert } from '../../db/schema/users.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserSelect | null>;
  findById(id: number): Promise<UserSelect | null>;
  create(user: UserInsert): Promise<UserSelect>;
  update(id: number, updates: Partial<UserInsert>): Promise<UserSelect | null>;
  changePassword(userId: number, passwordHash: string): Promise<boolean>;
  findAll(): Promise<UserSelect[]>;
  delete(id: number): Promise<boolean>;
  isActive(userId: number): Promise<boolean>;
  deactivate(userId: number): Promise<boolean>;
  activate(userId: number): Promise<boolean>;
}
