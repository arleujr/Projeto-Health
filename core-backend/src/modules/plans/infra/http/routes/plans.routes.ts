import { FastifyInstance } from 'fastify';
import { CreatePlanController } from '../../../controllers/CreatePlanController.js';
import { GetClientPlanController } from '../../../controllers/GetClientPlanController.js';
import { GetProfessionalDashboardController } from '../../../controllers/GetProfessionalDashboardController.js'; // 🚀 Import novo

export async function plansRoutes(app: FastifyInstance) {
  const createPlanController = new CreatePlanController();
  const getClientPlanController = new GetClientPlanController();
  const getProfessionalDashboardController = new GetProfessionalDashboardController(); // 🚀 Instancia aqui

  const jwtAuth = {
    onRequest: [async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Token inválido ou ausente.' });
      }
    }]
  };

  app.post('/', jwtAuth, createPlanController.handle);
  app.get('/my-plan', jwtAuth, getClientPlanController.handle);
  
  // 🎯 NOVA ROTA DO PAINEL: (GET /v1/plans/dashboard)
  app.get('/dashboard', jwtAuth, getProfessionalDashboardController.handle);
}