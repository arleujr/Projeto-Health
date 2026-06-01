import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateDietPrescriptionService } from '../services/CreateDietPrescriptionService.js';

export class CreateDietPrescriptionController {
  public async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    // Captura o ID do nutricionista logado através do token JWT
    const nutriId = (request.user as { id: string }).id;
    const { clientId, efiId, title, dailyMacros, meals } = request.body as any;

    const createDietPrescription = new CreateDietPrescriptionService();
    const result = await createDietPrescription.execute({
      clientId,
      nutriId,
      efiId,
      title,
      dailyMacros,
      meals,
    });

    return reply.status(201).send({
      message: 'Diet prescribed successfully and client account activated!',
      ...result,
    });
  }
}