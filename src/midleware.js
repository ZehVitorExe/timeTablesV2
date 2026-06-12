
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const publicRoutes = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }

  const user = await prisma.user.findFirst({
    where: {
      token,
      tokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};