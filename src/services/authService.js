import { prisma } from '@/lib/prisma';

export function getBearerToken(request) {
  const authHeader = request.headers.get('authorization') || '';
  return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

export async function resolveUserIdFromRequest(request) {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      token,
      tokenExpires: { gt: new Date() },
    },
  });

  return user?.id || null;
}
