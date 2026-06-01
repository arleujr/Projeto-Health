import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../../errors/AppError.js';

export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Valida o token JWT enviado no cabeçalho "Authorization: Bearer <TOKEN>"
    await request.jwtVerify();
  } catch (err) {
    // Se o token for inválido ou expirou, barra na hora impedindo vazamento de dados
    throw new AppError('Token de autenticação ausente ou inválido. Acesso negado.', 401);
  }
}