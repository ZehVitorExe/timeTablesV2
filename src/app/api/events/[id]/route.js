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

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('[GET_EVENT_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao buscar evento.' }, { status: 500 });
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
    const { title, description, startDate, endDate } = body;

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar foi fornecido.' }, { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_EVENT_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar evento.' }, { status: 500 });
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

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Evento deletado com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_EVENT_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao deletar evento.' }, { status: 500 });
  }
}
