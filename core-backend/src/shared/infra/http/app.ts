import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt'; 
import { authConfig } from '../../../config/auth.js'; // 🚀 Aponta para src/config/auth.ts
import { onboardingRouter } from '../../../modules/users/http/routes/onboarding.routes.js'; // 🚀 Aponta para src/modules/...
import { plansRoutes } from '../../../modules/plans/infra/http/routes/plans.routes.js'; // 🚀 Aponta para src/modules/...
import { globalExceptionHandler } from './middlewares/globalExceptionHandler.js';

const app = fastify({
  logger: process.env.NODE_ENV === 'development',
});

// 🚀 REGISTRA O PLUGIN JWT (antes das rotas)
app.register(fastifyJwt, {
  secret: authConfig.jwt.secret,
});

// 1. Rotas de Onboarding e Anamnese do Aluno
app.register(onboardingRouter, { prefix: '/v1/onboarding' });

// 2. Rotas de Prescrição dos Profissionais (Dietas e Treinos)
app.register(plansRoutes, { prefix: '/v1/plans' });

app.setErrorHandler(globalExceptionHandler);

export { app };