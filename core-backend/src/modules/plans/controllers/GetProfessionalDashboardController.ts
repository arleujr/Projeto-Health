import { FastifyRequest, FastifyReply } from 'fastify';
import { GetProfessionalDashboardService } from '../services/GetProfessionalDashboardService.js';

export class GetProfessionalDashboardController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    // 🔑 Trava de segurança: Garante que quem está chamando é NUTRI, EFI ou ADMIN
    const userRole = (request.user as any)?.role;

    if (userRole === 'CLIENT') {
      return reply.status(403).send({
        status: 'error',
        message: 'Acesso negado. Apenas profissionais podem acessar o painel de gestão.'
      });
    }

    const getProfessionalDashboardService = new GetProfessionalDashboardService();
    const dashboardData = await getProfessionalDashboardService.execute();

    return reply.status(200).send(dashboardData);
  }
}