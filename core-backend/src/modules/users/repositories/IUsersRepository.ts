import { User, Prisma } from '@prisma/client';

export interface IUserSessionContext {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription: {
    tier: string;
    status: string;
  } | null;
}

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findUserSessionContext(id: string): Promise<IUserSessionContext | null>;
}
