import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; 


export async function GET() {
  try {
    const events = await prisma.speaker.findMany();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, bio, avatar } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'O nome do palestrante é obrigatório.' }, 
        { status: 400 }
      );
    }

    //  Criação do palestrante
    const newSpeaker = await prisma.speaker.create({
      data: {
        name,
        bio: bio || null,
        avatar: avatar || null
      }
    });

    return NextResponse.json(newSpeaker, { status: 201 });

  } catch (error) {
    console.error("[POST_SPEAKER_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro interno ao criar o palestrante.' }, 
      { status: 500 }
    );
  }
}