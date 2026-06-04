import { FastifyInstance } from 'fastify';
import { CopilotController } from '../../controllers/CopilotController.js'; // Adicione .js se o seu TS exigir

const copilotController = new CopilotController();

export async function copilotRoutes(app: FastifyInstance) {
  // A rota final ficará /v1/copilot/chat graças ao prefixo que colocaremos no app.ts
  app.post('/chat', copilotController.handle);
}