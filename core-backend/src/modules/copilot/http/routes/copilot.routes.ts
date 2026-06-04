import { Router } from 'express';
import { CopilotController } from '../../controllers/CopilotController';

const copilotRouter = Router();
const copilotController = new CopilotController();

// Se quiser proteger essa rota, basta injetar seu middleware de autenticação aqui
copilotRouter.post('/chat', copilotController.handle);

export default copilotRouter;