import { prisma } from '../../../../shared/prisma/client.js';
export class PrismaUsersRepository {
    async create(data) {
        return prisma.user.create({ data });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async findByPhone(phone) {
        return prisma.user.findUnique({ where: { phone } });
    }
    async findUserSessionContext(id) {
        const user = await prisma.user.findUnique({
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
                    },
                },
            },
        });
        return user;
    }
}
