import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../../errors/AppError.js';

export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
  // 1. Pega o cabeçalho de autorização
  console.log("=== MIDDLEWARE DE AUTENTICAÇÃO DISPARADO ===");
  console.log("Cabeçalho recebido:", request.headers.authorization);

    const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de autenticação ausente. Acesso negado.', 401);
  }

  // 2. Extrai o token de dentro do "Bearer <TOKEN>"
  const [, token] = authHeader.split(' ');

  // 3. Se for o token de teste do fluxo de login, libera o acesso direto
  if (token === 'mock-jwt-token-from-auth-flow') {
    // Injeta um usuário fictício na requisição para não quebrar os controllers que usam o ID
    request.user = { sub: 'mock-user-id' };
    return;
  }

  // 4. Se não for o token de teste, roda a validação rigorosa do JWT real
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new AppError('Token de autenticação inválido ou expirou. Acesso negado.', 401);
  }
}