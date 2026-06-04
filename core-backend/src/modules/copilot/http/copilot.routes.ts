import { Router } from 'express';
import { CopilotController } from '../controllers/CopilotController';
// Se você tiver middleware de autenticação, importe-o aqui (ex: ensureAuthenticated)

const copilotRouter = Router();
const copilotController = new CopilotController();

// Você pode adicionar seu middleware de autenticação aqui se desejar proteger a rota
copilotRouter.post('/chat', copilotController.handle);

export default copilotRouter;