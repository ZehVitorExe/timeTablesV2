import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 


export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { _count: { select: { sessions: true } } }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds } = body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json({ error: 'O horário de término deve ser após o início.' }, { status: 400 });
    }

    const stageConflict = await prisma.session.findFirst({
      where: {
        stageId,
        startTime: { lt: end },  
        endTime: { gt: start },
      },
    });

    if (stageConflict) {
      return NextResponse.json({ error: 'Este palco já possui uma sessão agendada neste horário.' }, { status: 409 });
    }

    if (speakerIds && speakerIds.length > 0) {
      const speakerConflict = await prisma.speakerSession.findFirst({
        where: {
          speakerId: { in: speakerIds },
          session: {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        },
      });

      if (speakerConflict) {
        return NextResponse.json({ error: 'Um ou mais palestrantes já estão alocados neste horário.' }, { status: 409 });
      }
    }

    // Criação de sessão
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
  } catch (error) {
    console.error("[ERROR]: ", error);
    return NextResponse.json({ error: 'Erro ao criar sessão.' }, { status: 500 });
  }
}
