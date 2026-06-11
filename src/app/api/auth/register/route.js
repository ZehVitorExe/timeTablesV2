import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos (nome, e-mail e senha) são obrigatórios.' }, 
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso por outro usuário.' }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("[REGISTER_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro interno ao cadastrar o usuário.' }, 
      { status: 500 }
    );
  }
}