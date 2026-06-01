import { prisma } from '../../../shared/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { CreatePlanDTO } from '../dtos/CreatePlanDTO.js';

export class CreatePlanService {
  public async execute({ title, description, category, content, clientId, creatorId }: CreatePlanDTO) {
    // 1. Valida se o criador do plano existe no banco de dados
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
      throw new AppError('Profissional criador não encontrado no sistema.', 404);
    }

    // 2. Garante as travas de segurança por Role baseadas nas regras do seu negócio
    if (creator.role === 'NUTRI' && category !== 'NUTRITION') {
      throw new AppError('Nutricionistas só podem prescrever planos de Nutrição.', 400);
    }
    if (creator.role === 'EFI' && category !== 'EXERCISE') {
      throw new AppError('Profissionais de Educação Física só podem prescrever planos de Exercícios.', 400);
    }

    // ID temporário seguro para satisfazer a obrigatoriedade do banco durante os testes locais
    const fallbackId = creatorId;

    // 3. Criação do cabeçalho do Plan respeitando o mapeamento estrito do seu Schema
    const plan = await prisma.plan.create({
      data: {
        status: 'DRAFT',
        // Conexão com o Aluno destino
        client: {
          connect: { id: clientId }
        },
        // Conexão com a Nutri (Se for NUTRI, conecta ela; se não, usa o fallback de teste)
        nutri: {
          connect: { id: creator.role === 'NUTRI' ? creatorId : fallbackId }
        },
        // Conexão com o EFI (Se for EFI, conecta ele; se não, usa o fallback de teste)
        efi: {
          connect: { id: creator.role === 'EFI' ? creatorId : fallbackId }
        },
        // Quem está criando/assinando a operação
        createdBy: {
          connect: { id: creatorId }
        },
        updatedBy: {
          connect: { id: creatorId }
        }
      }
    });

    // 4. Cria a sub-tabela correspondente à categoria escolhida
    if (category === 'NUTRITION') {
      await prisma.diet.create({
        data: {
          planId: plan.id,
          title: title,
          dailyMacros: {}, // Inicializa vazio ou mapeia do content dpois
          meals: content
        }
      });
    } else if (category === 'EXERCISE') {
      await prisma.workoutRoutine.create({
        data: {
          planId: plan.id,
          title: title,
          splitType: 'Geral',
          exercises: content
        }
      });
    }

    // Retorna o plano mestre completo com as tabelas conectadas
    return await prisma.plan.findUnique({
      where: { id: plan.id },
      include: {
        diets: true,
        workouts: true
      }
    });
  }
}