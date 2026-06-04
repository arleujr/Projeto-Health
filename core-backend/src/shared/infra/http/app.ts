import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';

const app = fastify();

// habilita CORS
app.register(fastifyCors, {
  origin: '*', // ou configure os domínios permitidos
});

// habilita JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
});

// exemplo de rota
app.get('/ping', async () => {
  return { message: 'pong' };
});

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
