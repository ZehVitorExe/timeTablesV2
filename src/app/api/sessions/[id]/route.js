import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { resolveUserIdFromRequest } from '@/services/authService';

export async function GET(request, { params }) {
  try {
    const resolvedUserId = await resolveUserIdFromRequest(request);
    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: { speakers: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error('[GET_SESSION_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao buscar sessão.' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedUserId = await resolveUserIdFromRequest(request);
    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds } = body;

    const existingSession = await prisma.session.findUnique({ where: { id } });
    if (!existingSession) {
      return NextResponse.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (eventId) updateData.eventId = eventId;
    if (stageId) updateData.stageId = stageId;
    if (trackId !== undefined) updateData.trackId = trackId || null;
    if (speakerIds) {
      updateData.speakers = {
        deleteMany: {},
        create: speakerIds.map((speakerId) => ({ speakerId })),
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar foi fornecido.' }, { status: 400 });
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData,
      include: { speakers: true },
    });

    return NextResponse.json(updatedSession, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_SESSION_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar sessão.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedUserId = await resolveUserIdFromRequest(request);
    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const { id } = await params;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada.' }, { status: 404 });
    }

    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ message: 'Sessão deletada com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_SESSION_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao deletar sessão.' }, { status: 500 });
  }
}
