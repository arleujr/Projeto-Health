import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt'; 
import cors from '@fastify/cors';
import { authConfig } from '../../../config/auth.js';
import { onboardingRouter } from '../../../modules/users/http/routes/onboarding.routes.js';
import { plansRoutes } from '../../../modules/plans/infra/http/routes/plans.routes.js';
import { authRoutes } from '../../../modules/users/http/routes/auth.routes.js'; // 👈 NOVA IMPORTAÇÃO
import { globalExceptionHandler } from './middlewares/globalExceptionHandler.js';

const app = fastify({
  logger: process.env.NODE_ENV === 'development',
});

// 🚀 Register CORS
app.register(cors, { origin: '*' });

// 🚀 Register JWT plugin
app.register(fastifyJwt, {
  secret: authConfig.jwt.secret,
});

// 1. Auth routes (O FIM DO ERRO 401)
app.register(authRoutes, { prefix: '/v1/auth' }); // 👈 REGISTRO DA ROTA

// 2. Onboarding and anamnesis routes
app.register(onboardingRouter, { prefix: '/v1/onboarding' });

// 3. Professional prescription routes
app.register(plansRoutes, { prefix: '/v1/plans' });

// Global error handler
app.setErrorHandler(globalExceptionHandler);

export { app };