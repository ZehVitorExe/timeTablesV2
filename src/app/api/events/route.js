import { NextResponse } from 'next/server';
import { prismaEventRepository } from '@/infra/prismaEventRepository';
import { createEvent } from '@/application/createEvent';
import { prisma } from '@/lib/prisma';

// GET: Listar todos os eventos
export async function GET() {
  try {
    const events = await prismaEventRepository.listAll();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos.' }, { status: 500 });
  }
}

// POST: Criar um novo evento (usa use-case)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, userId } = body;

    // Try to determine userId from Authorization header if not provided
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (token) {
        const user = await prisma.user.findFirst({ where: { token, tokenExpires: { gt: new Date() } } });
        if (user) resolvedUserId = user.id;
      }
    }

    const newEvent = await createEvent({ repository: prismaEventRepository }, { title, description, startDate, endDate, userId: resolvedUserId });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || 'Erro ao criar evento.';
    return NextResponse.json({ error: message }, { status });
  }
}
