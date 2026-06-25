import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' }, 
        { status: 400 }
      );
    }

const user = await prisma.user.findUnique({
  where: { email: email }
});

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos.' }, 
        { status: 401 } // 401 Unauthorized
      );
    }

    console.log("Senha digitada:", password);
console.log("Usuário encontrado no banco:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos.' }, 
        { status: 401 }
      );
    }

    const token = crypto.randomUUID();
    
    const tokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        token,
        tokenExpires
      }
    });

    return NextResponse.json({
      message: 'Login realizado com sucesso!',
      token,
      expiresAt: tokenExpires.toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });

  } catch (error) {
    console.error("[LOGIN_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro interno ao realizar o login.' }, 
      { status: 500 }
    );
  }
}