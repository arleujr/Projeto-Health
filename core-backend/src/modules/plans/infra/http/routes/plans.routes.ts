import { FastifyInstance } from 'fastify';
import { CreatePlanController } from '../../../controllers/CreatePlanController.js';
import { GetClientPlanController } from '../../../controllers/GetClientPlanController.js';
import { GetProfessionalDashboardController } from '../../../controllers/GetProfessionalDashboardController.js';
import { GetPatientByIdController } from '../../../controllers/GetPatientByIdController.js';
import { ListPatientTicketsController } from '../../../controllers/ListPatientTicketsController.js';
import { GeneratePatientSummaryController } from '../../../controllers/GeneratePatientSummaryController.js';

export async function plansRoutes(app: FastifyInstance) {
  const createPlanController = new CreatePlanController();
  const getClientPlanController = new GetClientPlanController();
  const getProfessionalDashboardController = new GetProfessionalDashboardController(); 
  const getPatientByIdController = new GetPatientByIdController(); 
  const listPatientTicketsController = new ListPatientTicketsController();
  const generatePatientSummaryController = new GeneratePatientSummaryController();

  // 🔒 JWT authentication guard
  const jwtAuth = {
    onRequest: [async (request: any, reply: any) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ 
          status: 'error', 
          message: 'Invalid or missing authentication token.' 
        });
      }
    }]
  };

  // 📌 Routes
  app.post('/', jwtAuth, createPlanController.handle);
  app.get('/my-plan', jwtAuth, getClientPlanController.handle);
  
  // 🎯 Professional dashboard route
  app.get('/dashboard', jwtAuth, getProfessionalDashboardController.handle);

  // 🔒 Protected route: Fetch specific patient profile
  app.get('/patient/:id', jwtAuth, getPatientByIdController.handle);

  // 📌 List patient tickets
  app.get('/patients/:id/tickets', listPatientTicketsController.handle);

  // 📌 Patient summary (Raio-X)
  app.get('/patients/:id/summary', generatePatientSummaryController.handle);
}
