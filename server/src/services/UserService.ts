import bcrypt from 'bcrypt';
import { RepositoryFactory } from '../repositories/factory.js';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { RegisterRequest, UserResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class UserService {
  private userRepo: IUserRepository;

  constructor(userRepo?: IUserRepository) {
    this.userRepo = userRepo || RepositoryFactory.getUserRepository();
  }

  async registerUser(data: RegisterRequest): Promise<UserResponse> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new AppError('User with this email already exists', 409);
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepo.create({
      email: data.email,
      password_hash,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role || 'doctor',
    });

    return this.toResponse(user);
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await this.userRepo.findById(id);
    return user ? this.toResponse(user) : null;
  }

  async getUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  toResponse(user: any): UserResponse {
    const { password_hash, ...userResponse } = user;
    return userResponse as UserResponse;
  }
}
