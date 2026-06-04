import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';

// A importação exata que você mapeou:
import { copilotRoutes } from '../../../modules/copilot/http/routes/copilot.routes.js'; 

export const app = fastify();

// habilita CORS
app.register(fastifyCors, {
  origin: '*', 
});

// habilita JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
});

// Registrando o módulo do copiloto:
app.register(copilotRoutes, { prefix: '/v1/copilot' });

// Suas outras rotas devem estar registradas aqui também (ex: plans, users, etc)

// exemplo de rota
app.get('/ping', async () => {
  return { message: 'pong' };
});