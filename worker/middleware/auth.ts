import type { RouteContext, Actor } from '../types';
import { AppError } from './error';

const VALID_ROLES = ['Pelapor', 'Administrator', 'Teknisi', 'Manajer Fasilitas'] as const;

export function mockAuth(allowedRoles?: Array<Actor['role']>) {
  return async (request: Request, ctx: RouteContext) => {
    const actorId = request.headers.get('x-actor-id');
    const actorName = request.headers.get('x-actor-name');
    const actorRole = request.headers.get('x-actor-role');

    // NFR-001 (Security): Pembatasan akses fitur berdasarkan peran pengguna
    // Request tanpa header identitas mock yang valid menghasilkan response 401 Unauthorized
    if (!actorId || !actorName || !actorRole) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'Authentication credentials (headers x-actor-id, x-actor-name, x-actor-role) are missing or incomplete.'
      );
    }

    if (!VALID_ROLES.includes(actorRole as any)) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        `Invalid user role. Allowed roles are: ${VALID_ROLES.join(', ')}.`
      );
    }

    // Request yang melanggar batasan peran menghasilkan response 403 Forbidden
    if (allowedRoles && !allowedRoles.includes(actorRole as Actor['role'])) {
      throw new AppError(
        403,
        'FORBIDDEN',
        `Access denied. Required roles: ${allowedRoles.join(', ')}. Found: ${actorRole}.`
      );
    }

    // Set informasi aktor pada context
    ctx.actor = {
      id: actorId,
      name: actorName,
      role: actorRole as Actor['role']
    };

    return ctx.next();
  };
}
