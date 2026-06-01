import Fastify from 'fastify';
import { onboardingRouter } from '../../../modules/users/http/routes/onboarding.routes.js';
import { globalExceptionHandler } from './middlewares/globalExceptionHandler.js';
const app = Fastify({
    logger: process.env.NODE_ENV === 'development',
});
// Registra o prefixo global para as rotas de Onboarding e Anamnese do Aluno
app.register(onboardingRouter, { prefix: '/v1/onboarding' });
app.setErrorHandler(globalExceptionHandler);
export { app };
