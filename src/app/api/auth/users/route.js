import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { resolveUserIdFromRequest } from '@/services/authService';

export async function GET(request) {
  try {
    const resolvedUserId = await resolveUserIdFromRequest(request);
    if (!resolvedUserId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("[LIST_USERS_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro ao listar usuários.' },
      { status: 500 }
    );
  }
}
