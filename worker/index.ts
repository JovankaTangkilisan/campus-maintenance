import { Router } from './router';
import type { Actor, Env } from './types';
import { errorHandler, AppError } from './middleware/error';
import { mockAuth } from './middleware/auth';

const router = new Router();

const REPORT_STATUSES = [
  'baru',
  'diperiksa',
  'ditolak',
  'ditugaskan',
  'diterima',
  'sedang_dikerjakan',
  'selesai_dikerjakan',
  'ditutup',
  'dibuka_kembali'
] as const;

const REPORT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
const REPORT_SORTS = ['created_at_desc', 'created_at_asc'] as const;

function escapeLikeValue(value: string) {
  return value.toLowerCase().replace(/[\\%_]/g, '\\$&');
}

function getReportRoleScope(actor: Actor) {
  if (actor.role === 'Pelapor') {
    return {
      clause: 'sr.created_by = ?',
      params: [actor.id]
    };
  }

  if (actor.role === 'Teknisi') {
    return {
      clause: "EXISTS (SELECT 1 FROM service_request_assignments a WHERE a.service_request_id = sr.id AND a.technician_id = ? AND a.status IN ('assigned', 'accepted', 'completed'))",
      params: [actor.id]
    };
  }

  return {
    clause: '1 = 1',
    params: [] as Array<string>
  };
}

function toIntParam(value: string | null, fallback: number) {
  if (value === null || value.trim() === '') {
    return fallback;
  }

  if (!/^\d+$/.test(value.trim())) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Pagination parameters must be positive integers.');
  }

  return Number.parseInt(value.trim(), 10);
}

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

// 6.5. Rute Mendapatkan Daftar Laporan (GET /api/reports)
router.get('/api/reports', mockAuth(), async (request, ctx) => {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('page_size') || '10', 10);
  const sort = url.searchParams.get('sort') || 'created_at_desc';

  const actor = ctx.actor!;

  // 1. Tentukan query dasar berdasarkan Peran Aktor dengan alias 'sr'
  let baseQuery = '';
  let countQuery = '';
  let params: any[] = [];

  if (actor.role === 'Pelapor') {
    baseQuery = 'SELECT sr.* FROM service_requests sr WHERE sr.created_by = ?';
    countQuery = 'SELECT COUNT(*) as total_items FROM service_requests sr WHERE sr.created_by = ?';
    params.push(actor.id);
  } else if (actor.role === 'Teknisi') {
    baseQuery = 'SELECT sr.* FROM service_requests sr WHERE EXISTS (SELECT 1 FROM service_request_assignments a WHERE a.service_request_id = sr.id AND a.technician_id = ?)';
    countQuery = 'SELECT COUNT(*) as total_items FROM service_requests sr WHERE EXISTS (SELECT 1 FROM service_request_assignments a WHERE a.service_request_id = sr.id AND a.technician_id = ?)';
    params.push(actor.id);
  } else {
    // Administrator atau Manajer Fasilitas
    baseQuery = 'SELECT sr.* FROM service_requests sr WHERE 1=1';
    countQuery = 'SELECT COUNT(*) as total_items FROM service_requests sr WHERE 1=1';
  }

  // 2. Tambahkan filter tambahan (status, priority, category, search) dengan alias 'sr'
  let filterClauses = '';
  if (status) {
    filterClauses += ' AND sr.status = ?';
    params.push(status.toLowerCase());
  }
  if (priority) {
    filterClauses += ' AND sr.priority = ?';
    params.push(priority.toLowerCase());
  }
  if (category) {
    filterClauses += ' AND sr.category = ?';
    params.push(category);
  }
  if (search) {
    filterClauses += ' AND (sr.title LIKE ? OR sr.description LIKE ? OR sr.location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // 3. Hitung total data untuk pagination
  const finalCountQuery = countQuery + filterClauses;
  const countResult = await ctx.env.DB.prepare(finalCountQuery).bind(...params).first<{ total_items: number }>();
  const totalItems = countResult ? countResult.total_items : 0;

  // 4. Tambahkan klausa pengurutan (Sorting)
  let orderBy = ' ORDER BY sr.created_at DESC, sr.id DESC';
  if (sort === 'created_at_asc') {
    orderBy = ' ORDER BY sr.created_at ASC, sr.id ASC';
  } else if (sort === 'priority_desc') {
    orderBy = " ORDER BY CASE sr.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END ASC, sr.created_at DESC, sr.id DESC";
  }

  // 5. Tambahkan pagination (Limit & Offset)
  const offset = (page - 1) * pageSize;
  let finalQuery = baseQuery + filterClauses + orderBy + ' LIMIT ? OFFSET ?';
  const queryParams = [...params, pageSize, offset];

  const reportsResult = await ctx.env.DB.prepare(finalQuery).bind(...queryParams).all();
  const reports = reportsResult.results;

  // 6. Populasikan relasi lampiran, riwayat status, dan nama teknisi ditugaskan untuk tiap laporan
  const populatedReports = [];
  for (const report of reports) {
    const history = await ctx.env.DB.prepare(
      'SELECT * FROM service_request_status_history WHERE service_request_id = ? ORDER BY changed_at ASC'
    ).bind(report.id).all();

    const attachments = await ctx.env.DB.prepare(
      'SELECT * FROM service_request_attachments WHERE service_request_id = ?'
    ).bind(report.id).all();

    const assignment = await ctx.env.DB.prepare(
      'SELECT technician_id FROM service_request_assignments WHERE service_request_id = ? ORDER BY assigned_at DESC LIMIT 1'
    ).bind(report.id).first<{ technician_id: string }>();

    populatedReports.push({
      ...report,
      report_code: `CM-${report.id}`,
      history: history.results,
      attachments: attachments.results,
      assigned_technician_id: assignment ? assignment.technician_id : (report.assigned_technician_id || null)
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      items: populatedReports,
      total_items: totalItems,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(totalItems / pageSize)
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
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

// 9. Rute Daftar Laporan (GET /api/reports) - Semua peran dengan scope berbeda
router.get('/api/reports', mockAuth(), async (request, ctx) => {
  const actor = ctx.actor!;
  const url = new URL(request.url);

  const status = url.searchParams.get('status')?.trim() || '';
  const priority = url.searchParams.get('priority')?.trim() || '';
  const category = url.searchParams.get('category')?.trim() || '';
  const search = url.searchParams.get('q')?.trim() || url.searchParams.get('search')?.trim() || '';
  const sort = (url.searchParams.get('sort')?.trim() || 'created_at_desc') as typeof REPORT_SORTS[number];
  const page = toIntParam(url.searchParams.get('page'), 1);
  const pageSize = toIntParam(url.searchParams.get('page_size'), 20);

  if (status && !REPORT_STATUSES.includes(status as typeof REPORT_STATUSES[number])) {
    throw new AppError(400, 'VALIDATION_ERROR', `Invalid status filter. Allowed values are: ${REPORT_STATUSES.join(', ')}.`);
  }

  if (priority && !REPORT_PRIORITIES.includes(priority as typeof REPORT_PRIORITIES[number])) {
    throw new AppError(400, 'VALIDATION_ERROR', `Invalid priority filter. Allowed values are: ${REPORT_PRIORITIES.join(', ')}.`);
  }

  if (sort && !REPORT_SORTS.includes(sort)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Invalid sort parameter. Allowed values are: ${REPORT_SORTS.join(', ')}.`);
  }

  if (page < 1) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Page must be greater than or equal to 1.');
  }

  if (pageSize < 1 || pageSize > 100) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Page size must be between 1 and 100.');
  }

  const whereClauses: string[] = [];
  const bindings: Array<string | number> = [];

  const roleScope = getReportRoleScope(actor);
  whereClauses.push(roleScope.clause);
  bindings.push(...roleScope.params);

  if (status) {
    whereClauses.push('sr.status = ?');
    bindings.push(status);
  }

  if (priority) {
    whereClauses.push('sr.priority = ?');
    bindings.push(priority);
  }

  if (category) {
    whereClauses.push('sr.category = ?');
    bindings.push(category);
  }

  if (search) {
    const escapedSearch = `%${escapeLikeValue(search)}%`;
    whereClauses.push(
      "(LOWER(sr.title) LIKE ? ESCAPE '\\' OR LOWER(sr.description) LIKE ? ESCAPE '\\' OR LOWER(sr.location) LIKE ? ESCAPE '\\' OR LOWER(sr.category) LIKE ? ESCAPE '\\')"
    );
    bindings.push(escapedSearch, escapedSearch, escapedSearch, escapedSearch);
  }

  const whereSql = whereClauses.length > 0 ? whereClauses.map(clause => `(${clause})`).join(' AND ') : '1 = 1';
  const orderSql = sort === 'created_at_asc' ? 'sr.created_at ASC, sr.id ASC' : 'sr.created_at DESC, sr.id DESC';
  const offset = (page - 1) * pageSize;

  const totalRow = await ctx.env.DB.prepare(
    `SELECT COUNT(*) as total_items FROM service_requests sr WHERE ${whereSql}`
  ).bind(...bindings).first<any>();

  const totalItems = Number(totalRow?.total_items ?? 0);

  const rows = await ctx.env.DB.prepare(
    `
      SELECT
        sr.id,
        sr.title,
        sr.description,
        sr.location,
        sr.category,
        sr.priority,
        sr.status,
        sr.created_by,
        sr.created_at,
        sr.updated_at,
        (
          SELECT a.technician_id
          FROM service_request_assignments a
          WHERE a.service_request_id = sr.id
            AND a.status IN ('assigned', 'accepted', 'completed')
          ORDER BY a.assigned_at DESC
          LIMIT 1
        ) AS assigned_technician_id
      FROM service_requests sr
      WHERE ${whereSql}
      ORDER BY ${orderSql}
      LIMIT ? OFFSET ?
    `
  ).bind(...bindings, pageSize, offset).all<any>();

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

  return Response.json({
    success: true,
    page,
    page_size: pageSize,
    total_items: totalItems,
    total_pages: totalPages,
    sort,
    items: rows.results.map((row: any) => ({
      id: row.id,
      report_code: `CM-${row.id}`,
      title: row.title,
      issue_type: row.title,
      description: row.description,
      location: row.location,
      category: row.category,
      priority: row.priority,
      status: row.status,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      assigned_technician_id: row.assigned_technician_id ?? null
    }))
  });
});

// Export default worker handler
export default {
  async fetch(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, executionCtx);
  }
} satisfies ExportedHandler<Env>;
export { router };
