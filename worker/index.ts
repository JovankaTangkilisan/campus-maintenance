import { Router } from './router';
import { Env } from './types';
import { errorHandler, AppError } from './middleware/error';
import { mockAuth } from './middleware/auth';

const router = new Router();

// 1. Daftarkan middleware error global pertama kali
router.use(errorHandler);

// 2. Rute Publik (tanpa autentikasi)
router.get('/api/ping', async () => {
  return Response.json({ message: 'pong' });
});

// 3. Rute yang membutuhkan Autentikasi Umum (semua peran)
router.get('/api/auth-only', mockAuth(), async (request, ctx) => {
  return Response.json({
    message: 'Authorized successfully',
    actor: ctx.actor
  });
});

// 4. Rute khusus Administrator
router.get('/api/admin-only', mockAuth(['Administrator']), async (request, ctx) => {
  return Response.json({
    message: 'Welcome Admin!',
    actor: ctx.actor
  });
});

// 5. Rute untuk menguji AppError (Validation/Business Error)
router.get('/api/error-app', async () => {
  throw new AppError(400, 'VALIDATION_ERROR', 'Input validation failed. Title is required.');
});

// 6. Rute untuk menguji Runtime Exception (Internal Server Error)
router.get('/api/error-runtime', async () => {
  throw new Error('Database connection failed unexpectedly.');
});

// Export default worker handler
export default {
  async fetch(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, executionCtx);
  }
} satisfies ExportedHandler<Env>;
export { router };
