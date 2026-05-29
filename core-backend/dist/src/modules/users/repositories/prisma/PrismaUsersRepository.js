"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUsersRepository = void 0;
const prisma_1 = require("@shared/infra/database/prisma");
class PrismaUsersRepository {
    // 1. Criação de usuário padrão
    async create(data) {
        return prisma_1.prisma.user.create({ data });
    }
    // 2. Busca rápida por e-mail (Usando o índice que criamos no schema)
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    // 3. Busca rápida por telefone para o Bot do WhatsApp (Usando o índice do schema)
    async findByPhone(phone) {
        return prisma_1.prisma.user.findUnique({ where: { phone } });
    }
    // 4. Sua estratégia de Elite de SELECT estrito eliminando o include antigo
    async findUserSessionContext(id) {
        // Zero tables inclusion overflow. Strict project SELECT schema strategy.
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                subscription: {
                    select: {
                        tier: true,
                        status: true,
                    }
                }
            }
        });
    }
}
exports.PrismaUsersRepository = PrismaUsersRepository;
//# sourceMappingURL=PrismaUsersRepository.js.map