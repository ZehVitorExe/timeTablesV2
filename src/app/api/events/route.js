import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar todos os eventos
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

// POST: Criar um novo evento
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento.' }, { status: 500 });
  }
}
