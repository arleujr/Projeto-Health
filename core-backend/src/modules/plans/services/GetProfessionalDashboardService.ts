import { prisma } from '../../../shared/prisma/client.js';

export class GetProfessionalDashboardService {
  public async execute() {
    // 1. Busca todos os usuários que são alunos (CLIENT)
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOnboardingDone: true,
        createdAt: true,
        // Traz o último plano gerado, incluindo se ele tem dieta ou treino atrelado
        clientPlans: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            status: true,
            diets: { select: { id: true } },    // Só para checar se existe dieta
            workouts: { select: { id: true } } // Só para checar se existe treino
          }
        }
      }
    });

    // 2. Separa os alunos de forma inteligente para o painel do profissional
    const pendingAction: any[] = [];
    const activeClients: any[] = [];

    clients.forEach(client => {
      const lastPlan = client.clientPlans[0];

      // Descobre o tipo do plano baseado no filho que foi preenchido
      let planType = 'NÃO IDENTIFICADO';
      if (lastPlan) {
        if (lastPlan.diets && lastPlan.diets.length > 0) planType = 'NUTRITION';
        if (lastPlan.workouts && lastPlan.workouts.length > 0) planType = 'WORKOUT';
      }

      // Se o aluno fez a anamnese mas não tem plano OU o plano está em rascunho (DRAFT)
      if (client.isOnboardingDone && (!lastPlan || lastPlan.status === 'DRAFT')) {
        pendingAction.push({
          id: client.id,
          name: client.name,
          email: client.email,
          status: !lastPlan ? 'SEM_PLANO' : 'REVISAR_RASCUNHO',
          planId: lastPlan?.id || null,
          type: planType
        });
      } else {
        // Alunos com planos ativos (ACTIVE) ou que ainda não terminaram o onboarding
        activeClients.push({
          id: client.id,
          name: client.name,
          email: client.email,
          onboardingDone: client.isOnboardingDone,
          currentPlan: lastPlan ? {
            id: lastPlan.id,
            status: lastPlan.status,
            type: planType
          } : null
        });
      }
    });

    return {
      summary: {
        totalPending: pendingAction.length,
        totalActive: activeClients.length
      },
      pendingAction,
      activeClients
    };
  }
}