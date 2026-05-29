import { User, Prisma } from '@prisma/client';
import { prisma } from '@shared/infra/database/prisma';
import { IUsersRepository, IUserSessionContext } from '../IUsersRepository';

export class PrismaUsersRepository implements IUsersRepository {
  // 1. Criação de usuário padrão
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  // 2. Busca rápida por e-mail (Usando o índice que criamos no schema)
  public async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  // 3. Busca rápida por telefone para o Bot do WhatsApp (Usando o índice do schema)
  public async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { phone } });
  }

  // 4. Sua estratégia de Elite de SELECT estrito eliminando o include antigo
  public async findUserSessionContext(id: string): Promise<IUserSessionContext | null> {
    // Zero tables inclusion overflow. Strict project SELECT schema strategy.
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscription: {
          select: {
            tier: true,
            status: true,
          }
        }
      }
    }) as Promise<IUserSessionContext | null>;
  }
}
