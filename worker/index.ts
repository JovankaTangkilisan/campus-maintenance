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

// 5. Rute untuk menguji AppError (Validation/Business Error) - hanya development
router.get('/api/error-app', async (_request, ctx) => {
  if (ctx.env.ENV !== 'development') {
    throw new AppError(404, 'NOT_FOUND', 'Endpoint not found.');
  }
  throw new AppError(400, 'VALIDATION_ERROR', 'Input validation failed. Title is required.');
});

// 6. Rute untuk menguji Runtime Exception (Internal Server Error) - hanya development
router.get('/api/error-runtime', async (_request, ctx) => {
  if (ctx.env.ENV !== 'development') {
    throw new AppError(404, 'NOT_FOUND', 'Endpoint not found.');
  }
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

// 10. Rute Triase Laporan (PATCH /api/reports/:reportId/triage) - Khusus Administrator
router.patch('/api/reports/:reportId/triage', mockAuth(['Administrator']), async (request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // 1. Ambil laporan dan validasi status
  const report = await ctx.env.DB.prepare(
    'SELECT id, status FROM service_requests WHERE id = ?'
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  if (report.status !== 'baru') {
    throw new AppError(409, 'CONFLICT', `Cannot triage a report with status '${report.status}'. Only 'baru' reports can be triaged.`);
  }

  // 2. Parse body
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const { action, category, priority, rejection_reason } = body;

  if (action === 'approve') {
    if (!category || !category.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Category is required when approving a report.');
    }
    if (!priority || !REPORT_PRIORITIES.includes(priority)) {
      throw new AppError(400, 'VALIDATION_ERROR', `Priority must be one of: ${REPORT_PRIORITIES.join(', ')}.`);
    }

    // Update: category, priority, status = 'diperiksa'
    await ctx.env.DB.prepare(
      `UPDATE service_requests SET category = ?, priority = ?, status = 'diperiksa', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(category.trim(), priority, reportId).run();

    // Catat riwayat
    await ctx.env.DB.prepare(
      `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'baru', 'diperiksa', ?, ?, ?)`
    ).bind(reportId, actor.id, actor.role, `Laporan diperiksa. Kategori: ${category.trim()}, Prioritas: ${priority}.`).run();

  } else if (action === 'reject') {
    if (!rejection_reason || !rejection_reason.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Rejection reason is required when rejecting a report.');
    }

    // Update: status = 'ditolak', rejection_reason
    await ctx.env.DB.prepare(
      `UPDATE service_requests SET status = 'ditolak', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(rejection_reason.trim(), reportId).run();

    // Catat riwayat
    await ctx.env.DB.prepare(
      `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'baru', 'ditolak', ?, ?, ?)`
    ).bind(reportId, actor.id, actor.role, `Laporan ditolak. Alasan: ${rejection_reason.trim()}`).run();

  } else {
    throw new AppError(400, 'VALIDATION_ERROR', 'Action must be either "approve" or "reject".');
  }

  // 3. Ambil data terkini setelah update
  const updatedReport = await ctx.env.DB.prepare(
    `SELECT id, title, description, location, category, priority, status, created_by, created_at, updated_at, rejection_reason FROM service_requests WHERE id = ?`
  ).bind(reportId).first<any>();

  return Response.json({
    success: true,
    report: {
      id: updatedReport.id,
      report_code: `CM-${updatedReport.id}`,
      title: updatedReport.title,
      description: updatedReport.description,
      location: updatedReport.location,
      category: updatedReport.category,
      priority: updatedReport.priority,
      status: updatedReport.status,
      created_by: updatedReport.created_by,
      created_at: updatedReport.created_at,
      updated_at: updatedReport.updated_at,
      rejection_reason: updatedReport.rejection_reason ?? null
    }
  });
});

// 11. Rute Perubahan Prioritas (PATCH /api/reports/:reportId/priority) - Khusus Administrator
router.patch('/api/reports/:reportId/priority', mockAuth(['Administrator']), async (request, ctx) => {
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // 1. Ambil laporan
  const report = await ctx.env.DB.prepare(
    'SELECT id, priority FROM service_requests WHERE id = ?'
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  // 2. Parse body
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const { priority } = body;
  if (!priority || !REPORT_PRIORITIES.includes(priority)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Priority must be one of: ${REPORT_PRIORITIES.join(', ')}.`);
  }

  // 3. Update prioritas
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(priority, reportId).run();

  // 4. Ambil data terkini
  const updatedReport = await ctx.env.DB.prepare(
    `SELECT id, title, description, location, category, priority, status, created_by, created_at, updated_at FROM service_requests WHERE id = ?`
  ).bind(reportId).first<any>();

  return Response.json({
    success: true,
    report: {
      id: updatedReport.id,
      report_code: `CM-${updatedReport.id}`,
      title: updatedReport.title,
      description: updatedReport.description,
      location: updatedReport.location,
      category: updatedReport.category,
      priority: updatedReport.priority,
      status: updatedReport.status,
      created_by: updatedReport.created_by,
      created_at: updatedReport.created_at,
      updated_at: updatedReport.updated_at
    }
  });
});

// 12. Rute Penugasan Teknisi (POST /api/reports/:reportId/assign) - Khusus Administrator
router.post('/api/reports/:reportId/assign', mockAuth(['Administrator']), async (request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // 1. Validasi laporan dan status
  const report = await ctx.env.DB.prepare(
    'SELECT id, status FROM service_requests WHERE id = ?'
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  if (report.status !== 'diperiksa' && report.status !== 'dibuka_kembali') {
    throw new AppError(409, 'CONFLICT', `Cannot assign a report with status '${report.status}'. Only 'diperiksa' or 'dibuka_kembali' reports can be assigned.`);
  }

  // 2. Parse body
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const { technician_id } = body;
  if (!technician_id || !technician_id.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Technician ID is required.');
  }

  // 3. Nonaktifkan assignment lama (jika ada)
  await ctx.env.DB.prepare(
    `UPDATE service_request_assignments SET is_active = 0 WHERE service_request_id = ? AND is_active = 1`
  ).bind(reportId).run();

  // 4. Insert assignment baru
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_assignments (service_request_id, technician_id, assigned_by, status, is_active) VALUES (?, ?, ?, 'assigned', 1)`
  ).bind(reportId, technician_id.trim(), actor.id).run();

  // 5. Update status laporan + assigned_technician_id
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'ditugaskan', assigned_technician_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(technician_id.trim(), reportId).run();

  // 6. Catat riwayat status
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, ?, 'ditugaskan', ?, ?, ?)`
  ).bind(reportId, report.status, actor.id, actor.role, `Teknisi ${technician_id.trim()} ditugaskan.`).run();

  // 7. Ambil data terkini
  const updatedReport = await ctx.env.DB.prepare(
    `SELECT id, title, description, location, category, priority, status, created_by, assigned_technician_id, created_at, updated_at FROM service_requests WHERE id = ?`
  ).bind(reportId).first<any>();

  return Response.json({
    success: true,
    report: {
      id: updatedReport.id,
      report_code: `CM-${updatedReport.id}`,
      title: updatedReport.title,
      description: updatedReport.description,
      location: updatedReport.location,
      category: updatedReport.category,
      priority: updatedReport.priority,
      status: updatedReport.status,
      created_by: updatedReport.created_by,
      assigned_technician_id: updatedReport.assigned_technician_id ?? null,
      created_at: updatedReport.created_at,
      updated_at: updatedReport.updated_at
    }
  });
});

// 14. Rute Terima Tugas Teknisi (POST /api/reports/:reportId/assignment/accept)
router.post('/api/reports/:reportId/assignment/accept', mockAuth(['Teknisi']), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // Validasi: hanya teknisi yang ditugaskan
  const activeAssignment = await ctx.env.DB.prepare(
    `SELECT a.id, a.technician_id, sr.status
     FROM service_request_assignments a
     JOIN service_requests sr ON sr.id = a.service_request_id
     WHERE a.service_request_id = ? AND a.technician_id = ? AND a.is_active = 1 AND a.status = 'assigned'
     LIMIT 1`
  ).bind(reportId, actor.id).first<any>();

  if (!activeAssignment) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report or the assignment is not active.');
  }

  if (activeAssignment.status !== 'ditugaskan') {
    throw new AppError(409, 'CONFLICT', 'Report status must be "ditugaskan" to accept.');
  }

  // Update assignment: status = 'accepted', acknowledged_at = now
  await ctx.env.DB.prepare(
    `UPDATE service_request_assignments SET status = 'accepted', acknowledged_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1`
  ).bind(activeAssignment.id).run();

  // Update report: status = 'diterima'
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'diterima', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  // Catat riwayat
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'ditugaskan', 'diterima', ?, ?, 'Tugas diterima oleh teknisi.')`
  ).bind(reportId, actor.id, actor.role).run();

  return Response.json({ success: true, message: 'Tugas berhasil diterima.' });
});

// 15. Rute Tolak Tugas Teknisi (POST /api/reports/:reportId/assignment/reject)
router.post('/api/reports/:reportId/assignment/reject', mockAuth(['Teknisi']), async (request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // Parse body
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const rejection_reason = (body.rejection_reason || '').trim();
  if (!rejection_reason) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Rejection reason is required.');
  }

  // Validasi: hanya teknisi yang ditugaskan
  const activeAssignment = await ctx.env.DB.prepare(
    `SELECT a.id, a.technician_id, sr.status
     FROM service_request_assignments a
     JOIN service_requests sr ON sr.id = a.service_request_id
     WHERE a.service_request_id = ? AND a.technician_id = ? AND a.is_active = 1 AND a.status = 'assigned'
     LIMIT 1`
  ).bind(reportId, actor.id).first<any>();

  if (!activeAssignment) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report or the assignment is not active.');
  }

  if (activeAssignment.status !== 'ditugaskan') {
    throw new AppError(409, 'CONFLICT', 'Report status must be "ditugaskan" to reject.');
  }

  // Deaktivasi assignment, catat alasan & waktu tolak
  await ctx.env.DB.prepare(
    `UPDATE service_request_assignments SET is_active = 0, status = 'rejected', rejected_at = CURRENT_TIMESTAMP, rejection_reason = ? WHERE id = ? AND is_active = 1`
  ).bind(rejection_reason, activeAssignment.id).run();

  // Kembalikan status laporan ke 'diperiksa', hapus assigned_technician_id
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'diperiksa', assigned_technician_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  // Catat riwayat
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'ditugaskan', 'diperiksa', ?, ?, ?)`
  ).bind(reportId, actor.id, actor.role, `Tugas ditolak oleh teknisi. Alasan: ${rejection_reason}`).run();

  return Response.json({ success: true, message: 'Tugas ditolak.' });
});

// 17. Rute Mulai Pengerjaan (POST /api/reports/:reportId/progress/start)
router.post('/api/reports/:reportId/progress/start', mockAuth(['Teknisi']), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // Validasi: teknisi assigned, status = 'diterima'
  const assignment = await ctx.env.DB.prepare(
    `SELECT a.id FROM service_request_assignments a
     JOIN service_requests sr ON sr.id = a.service_request_id
     WHERE a.service_request_id = ? AND a.technician_id = ? AND a.is_active = 1 AND a.status = 'accepted'
       AND sr.status = 'diterima'
     LIMIT 1`
  ).bind(reportId, actor.id).first<any>();

  if (!assignment) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report or the report is not in "diterima" status.');
  }

  // Update report: status = 'sedang_dikerjakan', started_at = now
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'sedang_dikerjakan', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  // Catat riwayat
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'diterima', 'sedang_dikerjakan', ?, ?, 'Pekerjaan mulai dikerjakan di lokasi.')`
  ).bind(reportId, actor.id, actor.role).run();

  return Response.json({ success: true, message: 'Pekerjaan mulai dikerjakan.' });
});

// 18. Rute Selesaikan Pengerjaan (POST /api/reports/:reportId/progress/complete)
router.post('/api/reports/:reportId/progress/complete', mockAuth(['Teknisi']), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // Validasi: teknisi assigned, status = 'sedang_dikerjakan'
  const assignment = await ctx.env.DB.prepare(
    `SELECT a.id FROM service_request_assignments a
     JOIN service_requests sr ON sr.id = a.service_request_id
     WHERE a.service_request_id = ? AND a.technician_id = ? AND a.is_active = 1 AND a.status = 'accepted'
       AND sr.status = 'sedang_dikerjakan'
     LIMIT 1`
  ).bind(reportId, actor.id).first<any>();

  if (!assignment) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report or the report is not in "sedang_dikerjakan" status.');
  }

  // Update report: status = 'selesai_dikerjakan', completed_at = now
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'selesai_dikerjakan', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  // Catat riwayat
  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'sedang_dikerjakan', 'selesai_dikerjakan', ?, ?, 'Pekerjaan selesai. Mengirim konfirmasi ke pelapor.')`
  ).bind(reportId, actor.id, actor.role).run();

  return Response.json({ success: true, message: 'Pekerjaan selesai.' });
});

// 20. Rute Tutup Laporan (POST /api/reports/:reportId/close) - Administrator atau Pelapor pemilik
router.post('/api/reports/:reportId/close', mockAuth(), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // Validasi: hanya Admin atau Pelapor pemilik
  if (actor.role !== 'Administrator') {
    const report = await ctx.env.DB.prepare('SELECT created_by, status FROM service_requests WHERE id = ?')
      .bind(reportId).first<any>();
    if (!report) throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
    if (report.created_by !== actor.id) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied. You can only close your own reports.');
    }
    if (report.status !== 'selesai_dikerjakan') {
      throw new AppError(409, 'CONFLICT', 'Only reports with status "selesai_dikerjakan" can be closed.');
    }
  } else {
    // Admin: langsung cek status
    const report = await ctx.env.DB.prepare('SELECT status FROM service_requests WHERE id = ?')
      .bind(reportId).first<any>();
    if (!report) throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
    if (report.status !== 'selesai_dikerjakan') {
      throw new AppError(409, 'CONFLICT', 'Only reports with status "selesai_dikerjakan" can be closed.');
    }
  }

  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'ditutup', closed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'selesai_dikerjakan', 'ditutup', ?, ?, 'Laporan ditutup.')`
  ).bind(reportId, actor.id, actor.role).run();

  return Response.json({ success: true, message: 'Laporan ditutup.' });
});

// 21. Rute Buka Kembali Laporan (POST /api/reports/:reportId/reopen) - Khusus Administrator
router.post('/api/reports/:reportId/reopen', mockAuth(['Administrator']), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  const report = await ctx.env.DB.prepare('SELECT status FROM service_requests WHERE id = ?')
    .bind(reportId).first<any>();
  if (!report) throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  if (report.status !== 'selesai_dikerjakan') {
    throw new AppError(409, 'CONFLICT', 'Only reports with status "selesai_dikerjakan" can be reopened.');
  }

  // Kembalikan ke alur penugasan: status = dibuka_kembali, hapus assigned_technician_id
  await ctx.env.DB.prepare(
    `UPDATE service_requests SET status = 'dibuka_kembali', reopened_at = CURRENT_TIMESTAMP, assigned_technician_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(reportId).run();

  await ctx.env.DB.prepare(
    `INSERT INTO service_request_status_history (service_request_id, old_status, new_status, actor_id, actor_role, notes) VALUES (?, 'selesai_dikerjakan', 'dibuka_kembali', ?, ?, 'Laporan dibuka kembali untuk ditugaskan ulang.')`
  ).bind(reportId, actor.id, actor.role).run();

  return Response.json({ success: true, message: 'Laporan dibuka kembali.' });
});

// 22. Rute Tambah Komentar (POST /api/reports/:reportId/comments) - Semua peran dengan akses laporan
router.post('/api/reports/:reportId/comments', mockAuth(), async (request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    throw new AppError(400, 'BAD_REQUEST', 'Invalid JSON body.');
  }

  const { comment } = body;

  if (!comment || !comment.trim()) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Comment text is required and cannot be empty.');
  }

  // Validasi akses ke laporan
  const report = await ctx.env.DB.prepare(
    'SELECT id, created_by FROM service_requests WHERE id = ?'
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  if (actor.role === 'Pelapor' && report.created_by !== actor.id) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You can only comment on your own reports.');
  }

  if (actor.role === 'Teknisi') {
    const assignment = await ctx.env.DB.prepare(
      `SELECT 1 FROM service_request_assignments a
       WHERE a.service_request_id = ? AND a.technician_id = ?
         AND a.status IN ('assigned', 'accepted', 'completed')
       LIMIT 1`
    ).bind(reportId, actor.id).first<any>();

    if (!assignment) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report.');
    }
  }

  const commentText = comment.trim();

  const insertResult = await ctx.env.DB.prepare(
    'INSERT INTO service_request_comments (service_request_id, comment, sender_id, sender_name, sender_role) VALUES (?, ?, ?, ?, ?)'
  ).bind(reportId, commentText, actor.id, actor.name, actor.role).run();

  const commentId = insertResult.meta.last_row_id;

  const createdComment = await ctx.env.DB.prepare(
    'SELECT * FROM service_request_comments WHERE id = ?'
  ).bind(commentId).first<any>();

  return Response.json({
    success: true,
    comment: createdComment
  }, {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
});

// 23. Rute Detail Laporan (GET /api/reports/:reportId) - Semua peran dengan scope berbeda
router.get('/api/reports/:reportId', mockAuth(), async (_request, ctx) => {
  const actor = ctx.actor!;
  const reportId = ctx.params.reportId;

  if (!/^\d+$/.test(reportId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Report ID must be a positive integer.');
  }

  // 1. Ambil data laporan utama beserta assigned_technician_id
  const report = await ctx.env.DB.prepare(
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
      WHERE sr.id = ?
    `
  ).bind(reportId).first<any>();

  if (!report) {
    throw new AppError(404, 'NOT_FOUND', 'Service request not found.');
  }

  // 2. Otorisasi peran
  if (actor.role === 'Pelapor' && report.created_by !== actor.id) {
    throw new AppError(403, 'FORBIDDEN', 'Access denied. You can only view your own reports.');
  }

  if (actor.role === 'Teknisi') {
    const assignment = await ctx.env.DB.prepare(
      `SELECT 1 FROM service_request_assignments a
       WHERE a.service_request_id = ? AND a.technician_id = ?
         AND a.status IN ('assigned', 'accepted', 'completed')
       LIMIT 1`
    ).bind(reportId, actor.id).first<any>();

    if (!assignment) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied. You are not assigned to this report.');
    }
  }

  // 3. Ambil data relasional (status_history, comments, attachments)
  const statusHistory = await ctx.env.DB.prepare(
    `SELECT * FROM service_request_status_history
     WHERE service_request_id = ?
     ORDER BY changed_at ASC, id ASC`
  ).bind(reportId).all<any>();

  const comments = await ctx.env.DB.prepare(
    `SELECT * FROM service_request_comments
     WHERE service_request_id = ?
     ORDER BY created_at ASC, id ASC`
  ).bind(reportId).all<any>();

  const attachments = await ctx.env.DB.prepare(
    `SELECT * FROM service_request_attachments
     WHERE service_request_id = ?`
  ).bind(reportId).all<any>();

  return Response.json({
    success: true,
    report: {
      id: report.id,
      report_code: `CM-${report.id}`,
      title: report.title,
      description: report.description,
      location: report.location,
      category: report.category,
      priority: report.priority,
      status: report.status,
      created_by: report.created_by,
      created_at: report.created_at,
      updated_at: report.updated_at,
      assigned_technician_id: report.assigned_technician_id ?? null,
      status_history: statusHistory.results.map((h: any) => ({
        id: h.id,
        service_request_id: h.service_request_id,
        old_status: h.old_status,
        new_status: h.new_status,
        actor_id: h.actor_id,
        actor_role: h.actor_role,
        changed_at: h.changed_at,
        notes: h.notes
      })),
      comments: comments.results.map((c: any) => ({
        id: c.id,
        service_request_id: c.service_request_id,
        comment: c.comment,
        sender_id: c.sender_id,
        sender_name: c.sender_name,
        sender_role: c.sender_role,
        created_at: c.created_at
      })),
      attachments: attachments.results.map((a: any) => ({
        id: a.id,
        service_request_id: a.service_request_id,
        file_path: a.file_path,
        file_name: a.file_name,
        file_type: a.file_type,
        file_size: a.file_size,
        uploaded_at: a.uploaded_at
      }))
    }
  });
});

// 24. Rute Dashboard Statistik (GET /api/dashboard) - Khusus Administrator & Manajer Fasilitas
router.get('/api/dashboard', mockAuth(['Administrator', 'Manajer Fasilitas']), async (_request, ctx) => {
  // 1. Total laporan
  const totalRow = await ctx.env.DB.prepare('SELECT COUNT(*) as value FROM service_requests').first<any>();

  // 2. Laporan aktif (semua status kecuali ditutup & ditolak)
  const activeRow = await ctx.env.DB.prepare(
    `SELECT COUNT(*) as value FROM service_requests WHERE status NOT IN ('ditutup', 'ditolak')`
  ).first<any>();

  // 3. Laporan ditutup
  const closedRow = await ctx.env.DB.prepare(
    `SELECT COUNT(*) as value FROM service_requests WHERE status = 'ditutup'`
  ).first<any>();

  // 4. Laporan menunggu penugasan (baru / diperiksa)
  const pendingAssignRow = await ctx.env.DB.prepare(
    `SELECT COUNT(*) as value FROM service_requests WHERE status IN ('baru', 'diperiksa')`
  ).first<any>();

  // 5. Per status
  const statusRows = await ctx.env.DB.prepare(
    `SELECT status, COUNT(*) as count FROM service_requests GROUP BY status ORDER BY status`
  ).all<any>();

  // 6. Per prioritas
  const priorityRows = await ctx.env.DB.prepare(
    `SELECT COALESCE(priority, 'Belum Ditentukan') as priority, COUNT(*) as count FROM service_requests GROUP BY priority ORDER BY priority`
  ).all<any>();

  // 7. Per kategori
  const categoryRows = await ctx.env.DB.prepare(
    `SELECT COALESCE(category, 'Belum Ditentukan') as category, COUNT(*) as count FROM service_requests GROUP BY category ORDER BY category`
  ).all<any>();

  // 8. Rata-rata waktu penyelesaian (dalam jam) dari dibuat hingga ditutup
  const avgRow = await ctx.env.DB.prepare(
    `SELECT AVG((julianday(closed_at) - julianday(created_at)) * 24) as avg_hours
     FROM service_requests
     WHERE closed_at IS NOT NULL AND created_at IS NOT NULL`
  ).first<any>();

  const statusMap: Record<string, number> = {};
  for (const row of statusRows.results) {
    statusMap[row.status] = row.count;
  }

  const priorityMap: Record<string, number> = {};
  for (const row of priorityRows.results) {
    priorityMap[row.priority] = row.count;
  }

  const categoryMap: Record<string, number> = {};
  for (const row of categoryRows.results) {
    categoryMap[row.category] = row.count;
  }

  return Response.json({
    success: true,
    dashboard: {
      total: Number(totalRow?.value ?? 0),
      active: Number(activeRow?.value ?? 0),
      closed: Number(closedRow?.value ?? 0),
      pending_assign: Number(pendingAssignRow?.value ?? 0),
      avg_resolution_hours: avgRow?.avg_hours != null ? Math.round(Number(avgRow.avg_hours) * 100) / 100 : null,
      per_status: statusMap,
      per_priority: priorityMap,
      per_category: categoryMap
    }
  });
});

// Export default worker handler
export default {
  async fetch(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, executionCtx);
  }
} satisfies ExportedHandler<Env>;
export { router };
