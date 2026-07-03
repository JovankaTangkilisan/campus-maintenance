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

// 8. Rute Unggah Lampiran Foto (POST /api/reports/:reportId/attachments) - Khusus Pemilik Lapor
router.post('/api/reports/:reportId/attachments', mockAuth(['Pelapor']), async (request, ctx) => {
  const reportId = ctx.params.reportId;
  const actor = ctx.actor!;

  // 1. Verifikasi kepemilikan laporan
  const report = await ctx.env.DB.prepare(
    'SELECT created_by FROM service_requests WHERE id = ?'
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  if (report.created_by !== actor.id) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You do not own this service request.');
  }

  // 2. Baca data form multipart/form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid multipart/form-data payload.');
  }

  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    throw new AppError(400, 'VALIDATION_ERROR', 'File attachment is missing.');
  }

  // 3. Validasi berkas (maksimal 5MB dan tipe JPEG/PNG)
  if (file.size > 5 * 1024 * 1024) {
    throw new AppError(400, 'VALIDATION_ERROR', 'File size exceeds maximum limit of 5MB.');
  }

  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Only JPEG and PNG images are allowed.');
  }

  // 4. Unggah ke Cloudflare R2
  const timestamp = Date.now();
  const fileKey = `reports/${reportId}/${timestamp}_${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  await ctx.env.ATTACHMENTS.put(fileKey, arrayBuffer, {
    httpMetadata: { contentType: file.type }
  });

  // 5. Simpan metadata ke D1 service_request_attachments
  const insertAttachmentResult = await ctx.env.DB.prepare(
    'INSERT INTO service_request_attachments (service_request_id, file_path, file_name, file_type, file_size) VALUES (?, ?, ?, ?, ?)'
  ).bind(reportId, fileKey, file.name, file.type, file.size).run();

  const attachmentId = insertAttachmentResult.meta.last_row_id;

  const createdAttachment = await ctx.env.DB.prepare(
    'SELECT * FROM service_request_attachments WHERE id = ?'
  ).bind(attachmentId).first();

  return new Response(
    JSON.stringify({
      success: true,
      attachment: createdAttachment
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
