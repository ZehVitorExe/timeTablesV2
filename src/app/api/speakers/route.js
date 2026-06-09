import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Atualizar uma sessão existente
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, startTime, endTime, stageId, trackId } = body;

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        stageId,
        trackId,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar sessão.' }, { status: 500 });
  }
}

// DELETE: Remover uma sessão
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Sessão removida com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover sessão.' }, { status: 500 });
  }
}
