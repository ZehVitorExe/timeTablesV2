import { NextResponse } from 'next/server';
import { prismaSessionRepository } from '@/infra/prismaSessionRepository';
import { createSession } from '@/application/createSession';
import { resolveUserIdFromRequest } from '@/services/authService';

// Listar todas as sessões
export async function GET() {
  try {
    const sessions = await prismaSessionRepository.listAll();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar sessões.' }, { status: 500 });
  }
}

// criar uma nova sessão
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds } = body;

    let resolvedUserId = request.headers.get('x-user-id');
    if (!resolvedUserId) {
      resolvedUserId = await resolveUserIdFromRequest(request);
    }

    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }

    const newSession = await createSession({ repository: prismaSessionRepository }, { title, description, startTime, endTime, eventId, stageId, trackId, speakerIds });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || 'Erro ao criar sessão.';
    return NextResponse.json({ error: message }, { status });
  }
}
