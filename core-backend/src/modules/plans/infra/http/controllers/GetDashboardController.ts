import { FastifyRequest, FastifyReply } from 'fastify';
import { GetProfessionalDashboardUseCase } from '../../../services/GetProfessionalDashboardUseCase.js';

export class GetProfessionalDashboardController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const professionalId = (request.user as any).sub;
    
    // 👇 ADICIONE ESTE LOG AQUI
    console.log(`\n📡 [DASHBOARD] Requisição recebida do profissional ID: ${professionalId}`);

    const getDashboardUseCase = new GetProfessionalDashboardUseCase();
    const dashboardData = await getDashboardUseCase.execute(professionalId);

    // 👇 E ESTE LOG AQUI
    console.log(`✅ [DASHBOARD] Dados devolvidos: ${dashboardData.patients.length} pacientes encontrados.`);

    return reply.status(200).send(dashboardData);
  }
}