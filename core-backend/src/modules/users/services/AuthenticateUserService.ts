import bcryptjs from 'bcryptjs';
import { prisma } from '../../../shared/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { AuthenticateUserDTO } from '../dtos/AuthenticateDTO.js';

const { compare } = bcryptjs;

export class AuthenticateUserService {
  public async execute({ email, password }: AuthenticateUserDTO) {
    // 1. Busca o usuário pelo e-mail de forma estrita
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Combinação de e-mail/senha incorreta.', 401);
    }

    // 2. Compara as senhas garantindo que ambas sejam strings válidas (resolve o erro 2769 do TS)
    const passwordMatched = await compare(password || '', user.password || '');

    if (!passwordMatched) {
      throw new AppError('Combinação de e-mail/senha incorreta.', 401);
    }

    // 3. Remove a senha do objeto de retorno por segurança estrita (LGPD)
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isOnboardingDone: user.isOnboardingDone,
    };

    // Retorna os dados do usuário. Os tokens JWT serão assinados na camada do controller/HTTP
    return {
      user: userWithoutPassword,
    };
  }
}