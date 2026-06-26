import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { resolveUserIdFromRequest } from '@/services/authService';
import bcrypt from 'bcryptjs';

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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[GET_USER_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário.' },
      { status: 500 }
    );
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
    const { name, email, password } = body;

    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email }
      });
      if (emailInUse && emailInUse.id !== id) {
        return NextResponse.json(
          { error: 'Este e-mail já está em uso por outro usuário.' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar foi fornecido.' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_USER_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário.' },
      { status: 500 }
    );
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

    // Validar que o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso.' },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_USER_ERROR]: ", error);
    return NextResponse.json(
      { error: 'Erro ao deletar usuário.' },
      { status: 500 }
    );
  }
}
