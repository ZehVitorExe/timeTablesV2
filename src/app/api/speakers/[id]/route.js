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

    const speaker = await prisma.speaker.findUnique({ where: { id } });
    if (!speaker) {
      return NextResponse.json({ error: 'Palestrante não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(speaker, { status: 200 });
  } catch (error) {
    console.error('[GET_SPEAKER_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao buscar palestrante.' }, { status: 500 });
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
    const { name, bio, avatar } = body;

    const existingSpeaker = await prisma.speaker.findUnique({ where: { id } });
    if (!existingSpeaker) {
      return NextResponse.json({ error: 'Palestrante não encontrado.' }, { status: 404 });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio || null;
    if (avatar !== undefined) updateData.avatar = avatar || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar foi fornecido.' }, { status: 400 });
    }

    const updatedSpeaker = await prisma.speaker.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSpeaker, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_SPEAKER_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar palestrante.' }, { status: 500 });
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

    const speaker = await prisma.speaker.findUnique({ where: { id } });
    if (!speaker) {
      return NextResponse.json({ error: 'Palestrante não encontrado.' }, { status: 404 });
    }

    await prisma.speaker.delete({ where: { id } });
    return NextResponse.json({ message: 'Palestrante deletado com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_SPEAKER_ERROR]:', error);
    return NextResponse.json({ error: 'Erro ao deletar palestrante.' }, { status: 500 });
  }
}
