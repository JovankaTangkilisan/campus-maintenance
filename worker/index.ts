import { Router } from './router';
import type { Env } from './types';
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
router.get('/api/auth-only', mockAuth(), async (_request, ctx) => {
  return Response.json({
    message: 'Authorized successfully',
    actor: ctx.actor
  });
});

// 4. Rute khusus Administrator
router.get('/api/admin-only', mockAuth(['Administrator']), async (_request, ctx) => {
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

// 7. Rute Pembuatan Laporan Baru (POST /api/reports) - Khusus Pelapor
router.post('/api/reports', mockAuth(['Pelapor']), async (request, ctx) => {
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const { title, description, location, category } = body;

  // FR-002: Sistem menolak pembuatan laporan jika lokasi, jenis masalah (category), atau deskripsi kosong
  // BR-001: Data minimum laporan adalah lokasi, jenis masalah (category), deskripsi
  if (!location || !location.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Location is required and cannot be empty.');
  }
  if (!category || !category.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Category (Jenis Masalah) is required and cannot be empty.');
  }
  if (!description || !description.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Description is required and cannot be empty.');
  }
  if (!title || !title.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title is required and cannot be empty.');
  }

  const actor = ctx.actor!;

  // Simpan data laporan baru ke tabel service_requests
  const insertReportResult = await ctx.env.DB.prepare(
    'INSERT INTO service_requests (title, description, location, category, priority, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(title.trim(), description.trim(), location.trim(), category.trim(), 'low', 'baru', actor.id).run();

  const reportId = insertReportResult.meta.last_row_id;

  // FR-011 / BR-006: Simpan riwayat status laporan ke tabel service_request_status_history
  await ctx.env.DB.prepare(
    'INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(reportId, null, 'baru', actor.id, actor.role, 'Laporan baru dibuat.').run();

  // Ambil data laporan yang baru disimpan untuk dikembalikan ke klien
  const createdReport = await ctx.env.DB.prepare(
    'SELECT * FROM service_requests WHERE id = ?'
  ).bind(reportId).first();

  // Ambil riwayat statusnya
  const history = await ctx.env.DB.prepare(
    'SELECT * FROM service_request_status_history WHERE service_request_id = ?'
  ).bind(reportId).all();

  return new Response(
    JSON.stringify({
      success: true,
      report: {
        ...createdReport,
        history: history.results
      }
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    }
  );
});

// Export default worker handler
export default {
  async fetch(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, executionCtx);
  }
} satisfies ExportedHandler<Env>;
export { router };
