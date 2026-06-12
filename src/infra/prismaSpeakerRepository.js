import { prisma } from '@/lib/prisma';

class PrismaSpeakerRepository {
  async listAll() {
    return prisma.speaker.findMany();
  }

  async create(data) {
    return prisma.speaker.create({
      data: {
        name: data.name,
        bio: data.bio || null,
        avatar: data.avatar || null,
      },
    });
  }
}

export const prismaSpeakerRepository = new PrismaSpeakerRepository();
