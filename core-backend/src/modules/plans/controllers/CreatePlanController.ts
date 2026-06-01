import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePlanService } from '../services/CreatePlanService.js';
import { CreatePlanDTO } from '../dtos/CreatePlanDTO.js';

export class CreatePlanController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    // 🔑 Tenta capturar o ID de todas as formas possíveis que o Fastify-JWT injeta
    const creatorId = 
      (request.user as any)?.sub || 
      (request.user as any)?.id || 
      request.headers['x-user-id']; 
    
    // 🚨 DEFESA ABSOLUTA: Se o token não tiver o ID, barra aqui com a mensagem real
    if (!creatorId) {
      return reply.status(401).send({
        status: 'error',
        message: 'Não foi possível identificar o ID do profissional no Token JWT recebido.'
      });
    }

    const { title, description, category, content, clientId } = request.body as Omit<CreatePlanDTO, 'creatorId'>;

    const createPlanService = new CreatePlanService();

    const plan = await createPlanService.execute({
      title,
      description,
      category,
      content,
      clientId,
      creatorId: creatorId as string,
    });

    return reply.status(201).send(plan);
  }
}