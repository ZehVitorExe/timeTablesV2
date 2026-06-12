import { prisma } from '@/lib/prisma';

class PrismaSessionRepository {
  async listAll() {
    return prisma.session.findMany({ include: { speakers: true } });
  }

  async findStageOverlap(stageId, startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return prisma.session.findFirst({
      where: {
        stageId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });
  }

  async findSpeakerOverlap(speakerIds, startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return prisma.speakerSession.findFirst({
      where: {
        speakerId: { in: speakerIds },
        session: {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      },
    });
  }

  async create(data) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return prisma.session.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: start,
        endTime: end,
        eventId: data.eventId,
        stageId: data.stageId,
        trackId: data.trackId || null,
        speakers: {
          create: data.speakerIds?.map((id) => ({ speakerId: id })) || [],
        },
      },
      include: { speakers: true },
    });
  }
}

export const prismaSessionRepository = new PrismaSessionRepository();
