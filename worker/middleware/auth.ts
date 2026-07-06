import type { RouteContext, Actor } from '../types';
import { AppError } from './error';

const VALID_ROLES = ['Pelapor', 'Administrator', 'Teknisi', 'Manajer Fasilitas'] as const;

export function mockAuth(allowedRoles?: Array<Actor['role']>) {
  return async (request: Request, ctx: RouteContext) => {
    // Coba autentikasi via Bearer token terlebih dahulu
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);

      // Cari session di database
      const session = await ctx.env.DB.prepare(
        `SELECT s.user_id, u.id, u.name, u.role
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > datetime('now')`
      ).bind(token).first<{ user_id: string; id: string; name: string; role: string }>();

      if (session) {
        ctx.actor = {
          id: session.id,
          name: session.name,
          role: session.role as Actor['role']
        };

        // Validasi role jika ada batasan
        if (allowedRoles && !allowedRoles.includes(ctx.actor.role)) {
          throw new AppError(
            403,
            'FORBIDDEN',
            `Access denied. Required roles: ${allowedRoles.join(', ')}. Found: ${ctx.actor.role}.`
          );
        }

        return ctx.next();
      }
    }

    // Fallback: autentikasi via mock headers (untuk development)
    const actorId = request.headers.get('x-actor-id');
    const actorName = request.headers.get('x-actor-name');
    const actorRole = request.headers.get('x-actor-role');

    if (!actorId || !actorName || !actorRole) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'Authentication credentials are missing. Please login or provide valid headers.'
      );
    }

    if (!VALID_ROLES.includes(actorRole as any)) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        `Invalid user role. Allowed roles are: ${VALID_ROLES.join(', ')}.`
      );
    }

    if (allowedRoles && !allowedRoles.includes(actorRole as Actor['role'])) {
      throw new AppError(
        403,
        'FORBIDDEN',
        `Access denied. Required roles: ${allowedRoles.join(', ')}. Found: ${actorRole}.`
      );
    }

    ctx.actor = {
      id: actorId,
      name: actorName,
      role: actorRole as Actor['role']
    };

    return ctx.next();
  };
}
