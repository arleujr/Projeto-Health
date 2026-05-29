import Fastify from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../../errors/AppError.js';
import { usersRouter } from '../../../modules/users/http/routes/users.routes.js';
import { webhooksRouter } from '../../../modules/webhooks/http/routes/webhooks.routes.js';

const app = Fastify({
  logger: process.env.NODE_ENV === 'development',
});

// Register Domain Route Plugins
app.register(usersRouter, { prefix: '/v1/users' });
app.register(webhooksRouter, { prefix: '/v1/webhooks' });

// Non-blocking Global Exception Handler
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: 'validation_error',
      message: 'Invalid input data.',
      issues: error.format(),
    });
  }

  app.log.error(error);

  return reply.status(500).send({
    status: 'error',
    message: 'Internal server error.',
  });
});

export { app };