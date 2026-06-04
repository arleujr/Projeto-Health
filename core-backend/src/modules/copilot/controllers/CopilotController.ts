import { FastifyRequest, FastifyReply } from 'fastify';
import { CopilotChatService } from '../services/CopilotChatService.js'; // Adicione .js se o seu TS exigir

interface ChatBody {
  message: string;
  userRole: string;
  userName: string;
}

export class CopilotController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { message, userRole, userName } = request.body as ChatBody;

    const copilotChatService = new CopilotChatService();

    const responseText = await copilotChatService.execute({
      message,
      userRole,
      userName,
    });

    return reply.status(200).send({ reply: responseText });
  }
}