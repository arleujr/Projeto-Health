import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';

// 1. IMPORTAÇÃO DAS ROTAS (Com os caminhos exatos que você mapeou)
import { copilotRoutes } from '../../../modules/copilot/http/routes/copilot.routes.js';
import { plansRoutes } from '../../../modules/plans/infra/http/routes/plans.routes.js'
import { authRoutes } from '../../../modules/users/http/routes/auth.routes.js';

export const app = fastify();

// Habilita CORS
app.register(fastifyCors, {
  origin: '*', 
});

// Habilita JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'uma-chave-secreta-extremamente-longa-e-segura-para-o-projeto-health',
});

// 2. REGISTRO DOS MÓDULOS (Aqui as rotas ganham vida!)
app.register(authRoutes, { prefix: '/v1/auth' });       // Traz o /v1/auth/verify-otp de volta
app.register(plansRoutes, { prefix: '/v1/plans' });     // Traz o dashboard e os planos de volta
app.register(copilotRoutes, { prefix: '/v1/copilot' }); // Mantém o copiloto rodando perfeitamente

// Exemplo de rota de teste
app.get('/ping', async () => {
  return { message: 'pong' };
});