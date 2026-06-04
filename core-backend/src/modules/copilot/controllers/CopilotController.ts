import { Request, Response } from 'express';
import { CopilotChatService } from '../services/CopilotChatService';

export class CopilotController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { message, userRole, userName } = request.body;

    const copilotChatService = new CopilotChatService();

    const reply = await copilotChatService.execute({
      message,
      userRole,
      userName,
    });

    return response.json({ reply });
  }
}
