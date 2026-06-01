import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../../errors/AppError.js';
import { UserRole } from '@prisma/client';

export function ensureRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // O usuário precisa estar autenticado (o JWT injeta o 'request.user')
    const user = (request as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      reply.status(403).send({
        status: 'error',
        message: 'Acesso negado. Seu nível de permissão não autoriza esta ação.'
      });
      return reply;
    }
  };
}