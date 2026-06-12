import { prisma } from '@/lib/prisma';

class PrismaEventRepository {
  async listAll() {
    return prisma.event.findMany();
  }

  async findOverlapping(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return prisma.event.findFirst({
      where: {
        AND: [
          { startDate: { lte: end } },
          { endDate: { gte: start } },
        ],
      },
    });
  }

  async create(data) {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        userId: data.userId || null,
      },
    });
  }
}

export const prismaEventRepository = new PrismaEventRepository();
