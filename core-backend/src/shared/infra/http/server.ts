import { app } from './app.js';

const port = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`[ProductionEngine]: Fastify Premium Core listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();