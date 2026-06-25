import { NextResponse } from 'next/server';
import { prismaEventRepository } from '@/infra/prismaEventRepository';
import { createEvent } from '@/application/createEvent';
import { resolveUserIdFromRequest } from '@/services/authService';

// Listar todos os eventos
export async function GET() {
  try {
    const events = await prismaEventRepository.listAll();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos.' }, { status: 500 });
  }
}

// Criar um novo evento
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, userId } = body;

    let resolvedUserId = userId || request.headers.get('x-user-id');
    if (!resolvedUserId) {
      resolvedUserId = await resolveUserIdFromRequest(request);
    }

    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
    }

    const newEvent = await createEvent({ repository: prismaEventRepository }, { title, description, startDate, endDate, userId: resolvedUserId });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || 'Erro ao criar evento.';
    return NextResponse.json({ error: message }, { status });
  }
}
