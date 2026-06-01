import { FastifyInstance } from 'fastify';
import { OnboardingController } from '../controllers/OnboardingController.js';
import { AdminController } from '../controllers/AdminController.js';
import { AuthenticateUserService } from '../../services/AuthenticateUserService.js';
import { CreateOnboardingController } from '../../controllers/CreateOnboardingController.js';
import { CreateProfessionalByAdminController } from '../../controllers/CreateProfessionalByAdminController.js';
import { AllowCpfByAdminController } from '../controllers/AllowCpfByAdminController.js';
import { GetClientAnamnesisController } from '../controllers/GetClientAnamnesisController.js';
// Caminho corrigido apontando para o módulo correto de planos!
import { CreateDietPrescriptionController } from '../../../plans/controllers/CreateDietPrescriptionController.js';
export async function onboardingRouter(app: FastifyInstance) {
  const controller = new OnboardingController();
  const adminController = new AdminController();
  const createOnboardingController = new CreateOnboardingController();
  const createProfessionalByAdminController = new CreateProfessionalByAdminController();
  const allowCpfByAdminController = new AllowCpfByAdminController();
  const getClientAnamnesisController = new GetClientAnamnesisController();
  const createDietPrescriptionController = new CreateDietPrescriptionController();

  // Public route: Authenticate user and generate token
  app.post('/sessions', async (request, reply) => {
    const { email, password } = request.body as any;
    
    const authenticateUser = new AuthenticateUserService();
    const { user } = await authenticateUser.execute({ email, password });

    const token = app.jwt.sign({ role: user.role }, { sub: user.id, expiresIn: '15m' });

    return reply.status(200).send({
      user,
      token
    });
  });

  // Public routes: Webhook processing and initial user signup
  app.post('/webhook-payment', controller.preRegister);
  app.post('/register', controller.complete);

  // Protected route: Multi-stage patient anamnesis profile submission
  app.post('/anamnesis', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Invalid or missing authentication token.' });
      }
    }]
  }, createOnboardingController.handle);

  // Protected route: Administrative authorization engine modification
  app.patch('/admin/change-role', adminController.changeRole);

  // Protected route: Administrative resource handling for corporate team ingestion
  app.post('/professionals', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Invalid or missing token.' });
      }
    }]
  }, createProfessionalByAdminController.handle);

  // Protected route: Secure inline bypass validation for payment gateways
  app.post('/allow-cpf', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
        
        // Strictly assert ADMIN authorizations
        const { role } = request.user as { role: string };
        if (role !== 'ADMIN') {
          return reply.status(403).send({ status: 'error', message: 'Access denied. Insufficient permissions.' });
        }
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Invalid or missing authentication token.' });
      }
    }]
  }, allowCpfByAdminController.handle);

  // 🔒 Protected route: Allows professionals (NUTRI/EFI) to audit specific patient health profiles
  app.get('/anamnesis/:userId', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
        
        const { role } = request.user as { role: string };
        if (role !== 'NUTRI' && role !== 'EFI') {
          return reply.status(403).send({ status: 'error', message: 'Access denied. Only health professionals can view anamneses.' });
        }
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Invalid or missing authentication token.' });
      }
    }]
  }, getClientAnamnesisController.handle);

  // 🔒 Protected route: Allows only NUTRITIONISTS to prescribe diets and activate clients
  app.post('/prescribe-diet', {
    onRequest: [async (request, reply) => {
      try {
        await request.jwtVerify();
        const { role } = request.user as { role: string };
        if (role !== 'NUTRI') {
          return reply.status(403).send({ status: 'error', message: 'Access denied. Only nutritionists can prescribe diets.' });
        }
      } catch (err) {
        return reply.status(401).send({ status: 'error', message: 'Invalid or missing authentication token.' });
      }
    }]
  }, createDietPrescriptionController.handle);
}
