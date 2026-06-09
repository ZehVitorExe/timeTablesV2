import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds } = body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Validação básica de horário
    if (start >= end) {
      return NextResponse.json({ error: 'O horário de término deve ser após o início.' }, { status: 400 });
    }

    // 2. Validação: Evitar choque de horário no mesmo Palco/Sala
    const stageConflict = await prisma.session.findFirst({
      where: {
        stageId,
        NOT: { startTime: { gte: end }, endTime: { lte: start } },
      },
    });

    if (stageConflict) {
      return NextResponse.json({ error: 'Este palco já possui uma sessão agendada neste horário.' }, { status: 409 });
    }

    // 3. Validação: Evitar choque de horário para o palestrante
    if (speakerIds && speakerIds.length > 0) {
      const speakerConflict = await prisma.speakerSession.findFirst({
        where: {
          speakerId: { in: speakerIds },
          session: {
            NOT: { startTime: { gte: end }, endTime: { lte: start } },
          },
        },
      });

      if (speakerConflict) {
        return NextResponse.json({ error: 'Um ou mais palestrantes já estão alocados neste horário.' }, { status: 409 });
      }
    }

    // 4. Criação da sessão
    const newSession = await prisma.session.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        eventId,
        stageId,
        trackId,
        speakers: {
          create: speakerIds?.map((id) => ({
            speakerId: id,
          })),
        },
      },
      include: { speakers: true },
    });

    return NextResponse.json(newSession, { status: 201 });
  }  catch (error) {
  console.error("❌ ERRO REAL DA API:", error); // Adicione esta linha temporariamente para ver o log no Next.js
  return NextResponse.json({ error: 'Erro ao criar sessão.' }, { status: 500 });
}

}
