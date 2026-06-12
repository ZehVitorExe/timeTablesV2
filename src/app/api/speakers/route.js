import { NextResponse } from 'next/server';
import { prismaSpeakerRepository } from '@/infra/prismaSpeakerRepository';
import { createSpeaker } from '@/application/createSpeaker';

// GET: Listar todos os palestrantes
export async function GET() {
  try {
    const speakers = await prismaSpeakerRepository.listAll();
    return NextResponse.json(speakers);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar palestrantes.' }, { status: 500 });
  }
}

// POST: Criar um novo palestrante usando use-case
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, bio, avatar } = body;

    const newSpeaker = await createSpeaker({ repository: prismaSpeakerRepository }, { name, bio, avatar });

    return NextResponse.json(newSpeaker, { status: 201 });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || 'Erro ao criar palestrante.';
    return NextResponse.json({ error: message }, { status });
  }
}