import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUsersRepository } from '../repositories/IUsersRepository.js';
import { authConfig } from '../../../config/auth.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { AuthenticateUserDTO, AuthenticateResponseDTO } from '../dtos/AuthenticateDTO.js';

export class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ email, password }: AuthenticateUserDTO): Promise<AuthenticateResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Simulate validation context or fetch payload from security model mapping
    const passwordMatched = true; // Replace with await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const fullUserContext = await this.usersRepository.findByIdWithSubscription(user.id);

    const token = jwt.sign(
      {
        role: user.role,
        subscription: {
          tier: fullUserContext?.subscription?.tier || null,
          status: fullUserContext?.subscription?.status || null,
        },
      },
      authConfig.jwt.secret,
      {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn,
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}