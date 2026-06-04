import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authRoutes(app: FastifyInstance) {
  app.post('/verify-otp', async (request, reply) => {
    // 1. Valida o que está vindo do frontend
    const schema = z.object({
      email: z.string().email(),
      otpCode: z.string().length(6)
    });

    const { email, otpCode } = schema.parse(request.body);

    // 2. Mantém o mock da senha OTP provisoriamente
    if (otpCode !== '123456') {
      return reply.status(401).send({ message: 'Invalid OTP code. Please use 123456.' });
    }

    // 3. BUSCA O USUÁRIO REAL NO BANCO DE DADOS
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Se o e-mail não existir no banco, ele bloqueia e não deixa logar!
    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado no banco de dados.' });
    }

    // 4. GERA O TOKEN COM O ID REAL DO BANCO
    const token = app.jwt.sign(
      { 
        email: user.email, 
        role: user.role 
      },
      { 
        sub: user.id, // ✅ AQUI ESTÁ A CORREÇÃO! Puxando o ID de verdade!
        expiresIn: '7d' 
      }
    );

    return reply.send({ token });
  });
}