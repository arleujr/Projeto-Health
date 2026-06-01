import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { prisma } from '../../../shared/prisma/client.js';
import { authConfig } from '../../../config/auth.js';
import { AppError } from '../../../shared/errors/AppError.js';
export class AuthenticateUserService {
    async execute({ email, password }) {
        if (!password) {
            throw new AppError('Senha é obrigatória para efetuar o login.', 400);
        }
        // 1. Busca o usuário incluindo a assinatura
        const user = await prisma.user.findUnique({
            where: { email },
            include: { subscription: true }
        });
        // Usamos "as any" para contornar o cache antigo das propriedades do prisma no node_modules
        if (!user || !user.password) {
            throw new AppError('Combinação de e-mail/senha incorreta.', 401);
        }
        // 2. Compara a senha digitada com a criptografada usando leitura dinâmica
        const passwordMatched = await bcryptjs.compare(password, user.password);
        if (!passwordMatched) {
            throw new AppError('Combinação de e-mail/senha incorreta.', 401);
        }
        // 3. Força as opções de expiração para bater com o formato estrito do JWT
        const jwtOptions = {
            subject: user.id,
            expiresIn: (authConfig.jwt.expiresIn || '1d'),
        };
        // 4. Cria o Token com a Role e Assinatura salvas dinamicamente
        const token = jwt.sign({
            role: user.role,
            subscription: {
                tier: user.subscription?.tier || null,
                status: user.subscription?.status || null,
            },
        }, authConfig.jwt.secret, jwtOptions);
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
