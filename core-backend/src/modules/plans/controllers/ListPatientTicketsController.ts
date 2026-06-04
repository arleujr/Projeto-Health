import { FastifyRequest, FastifyReply } from 'fastify';
import { ListPatientTicketsUseCase } from '../services/ListPatientTicketsUseCase.js'; // Ajuste o caminho se necessário

export class ListPatientTicketsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // 1. Pega o ID do profissional que está logado (O JWT que arrumamos antes!)
    const professionalId = (request.user as any).sub;
    
    // 2. Pega o ID do paciente que veio na URL (ex: /patients/123/tickets)
    const { id: patientId } = request.params as { id: string };

    const listTicketsUseCase = new ListPatientTicketsUseCase();
    
    // 3. Roda o motor de SLA
    const tickets = await listTicketsUseCase.execute({ 
      professionalId, 
      patientId 
    });

    // 4. Devolve para o Front-end brilhar
    return reply.status(200).send({ tickets });
  }
}