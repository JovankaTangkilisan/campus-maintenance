import { describe, it, expect } from 'vitest';
import { router } from '../index';
import type { Env } from '../types';

// Mocking D1 Database
const mockDB = {
  prepare: (sql: string) => {
    let boundArgs: any[] = [];
    const stmt = {
      bind: (...args: any[]) => {
        boundArgs = args;
        return stmt;
      },
      run: async () => {
        return {
          success: true,
          meta: { last_row_id: 999 }
        };
      },
      first: async () => {
        if (sql.includes('service_request_attachments')) {
          return {
            id: 888,
            service_request_id: 999,
            file_path: 'reports/999/12345_photo.jpg',
            file_name: 'photo.jpg',
            file_type: 'image/jpeg',
            file_size: 1024
          };
        }
        return {
          id: 999,
          title: boundArgs[0] || 'Test Laporan',
          description: boundArgs[1] || 'Test Deskripsi',
          location: boundArgs[2] || 'Test Lokasi',
          category: boundArgs[3] || 'AC & Pendingin Ruangan',
          priority: 'low',
          status: 'baru',
          created_by: 'pelapor-1',
          created_at: '2026-07-03 21:00:00',
          updated_at: '2026-07-03 21:00:00'
        };
      },
      all: async () => {
        return {
          success: true,
          results: [
            {
              id: 1,
              service_request_id: 999,
              old_status: null,
              new_status: 'baru',
              actor_id: 'pelapor-1',
              actor_role: 'Pelapor',
              changed_at: '2026-07-03 21:00:00',
              notes: 'Laporan baru dibuat.'
            }
          ]
        };
      }
    };
    return stmt;
  }
} as unknown as D1Database;

// Mocking R2 Bucket
const mockR2 = {
  put: async (key: string, value: any, _options?: any) => {
    return {
      key,
      size: value.byteLength || 1024
    };
  }
} as unknown as R2Bucket;

const mockEnv = {
  DB: mockDB,
  ATTACHMENTS: mockR2
} as Env;

const mockCtx = {} as ExecutionContext;

type QueryLog = {
  sql: string;
  args: any[];
};

function createListMockDb(options?: {
  totalItems?: number;
  rows?: any[];
}) {
  const queries: QueryLog[] = [];

  const db = {
    prepare: (sql: string) => {
      let boundArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          boundArgs = args;
          return stmt;
        },
        run: async () => {
          queries.push({ sql, args: boundArgs });
          return {
            success: true,
            meta: { last_row_id: 999 }
          };
        },
        first: async () => {
          queries.push({ sql, args: boundArgs });
          if (sql.includes('COUNT(*) as total_items')) {
            return {
              total_items: options?.totalItems ?? 1
            };
          }

          return null;
        },
        all: async () => {
          queries.push({ sql, args: boundArgs });
          return {
            success: true,
            results: options?.rows ?? [
              {
                id: 101,
                title: 'AC Mati di Lab Komputer',
                description: 'AC tidak menyala sejak pagi.',
                location: 'Gedung D, Lantai 2',
                category: 'AC & Pendingin Ruangan',
                priority: 'high',
                status: 'baru',
                created_by: 'pelapor-1',
                created_at: '2026-07-03 09:00:00',
                updated_at: '2026-07-03 09:00:00',
                assigned_technician_id: 'teknisi-1'
              }
            ]
          };
        }
      };
      return stmt;
    }
  } as unknown as D1Database;

  return { db, queries };
}

describe('Router & Middleware Tests', () => {

  it('GET /api/ping - rute publik harus mengembalikan status 200', async () => {
    const request = new Request('http://localhost/api/ping', { method: 'GET' });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ message: 'pong' });
  });

  it('GET /api/auth-only - tanpa header auth harus menghasilkan 401 Unauthorized', async () => {
    const request = new Request('http://localhost/api/auth-only', { method: 'GET' });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(401);
    const body: any = await response.json();
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('headers x-actor-id, x-actor-name, x-actor-role');
  });

  it('GET /api/auth-only - dengan header valid harus mengembalikan 200', async () => {
    const request = new Request('http://localhost/api/auth-only', {
      method: 'GET',
      headers: {
        'x-actor-id': 'user-123',
        'x-actor-name': 'John Doe',
        'x-actor-role': 'Pelapor'
      }
    });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body.message).toBe('Authorized successfully');
    expect(body.actor).toEqual({
      id: 'user-123',
      name: 'John Doe',
      role: 'Pelapor'
    });
  });

  it('GET /api/admin-only - peran non-admin harus menghasilkan 403 Forbidden', async () => {
    const request = new Request('http://localhost/api/admin-only', {
      method: 'GET',
      headers: {
        'x-actor-id': 'user-123',
        'x-actor-name': 'John Doe',
        'x-actor-role': 'Pelapor'
      }
    });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(403);
    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
    expect(body.message).toContain('Access denied');
  });

  it('GET /api/admin-only - peran admin harus mengembalikan 200', async () => {
    const request = new Request('http://localhost/api/admin-only', {
      method: 'GET',
      headers: {
        'x-actor-id': 'admin-123',
        'x-actor-name': 'Alice Smith',
        'x-actor-role': 'Administrator'
      }
    });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body.message).toBe('Welcome Admin!');
  });

  it('GET /api/error-app - AppError harus ditangani dengan status yang sesuai dan format JSON standar', async () => {
    const request = new Request('http://localhost/api/error-app', { method: 'GET' });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(400);
    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toBe('Input validation failed. Title is required.');
  });

  it('GET /api/error-runtime - Runtime error tidak membocorkan stack trace dan mengembalikan 500', async () => {
    const request = new Request('http://localhost/api/error-runtime', { method: 'GET' });
    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(500);
    const body: any = await response.json();
    expect(body.error).toBe('INTERNAL_SERVER_ERROR');
    expect(body.message).toBe('An unexpected error occurred on the server');
    expect(body.stack).toBeUndefined();
  });
});

describe('POST /api/reports - Create Service Request Features', () => {
  it('POST /api/reports - Pelapor mengirim payload valid harus mengembalikan 201 dan menyimpan laporan', async () => {
    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: JSON.stringify({
        title: 'AC Bocor di R.301',
        description: 'AC meneteskan air sangat deras di bagian belakang.',
        location: 'Gedung D, Lantai 3',
        category: 'AC & Pendingin Ruangan'
      })
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(201);
    
    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.id).toBe(999);
    expect(body.report.status).toBe('baru');
    expect(body.report.priority).toBe('low');
    expect(body.report.history).toBeInstanceOf(Array);
    expect(body.report.history[0].new_status).toBe('baru');
    expect(body.report.history[0].old_status).toBeNull();
  });

  it('POST /api/reports - Jika field wajib kosong harus mengembalikan 400 VALIDATION_ERROR', async () => {
    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: JSON.stringify({
        title: 'AC Bocor di R.301',
        description: '', // Kosong!
        location: 'Gedung D, Lantai 3',
        category: 'AC & Pendingin Ruangan'
      })
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(400);
    
    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Description is required');
  });

  it('POST /api/reports - Jika diakses Administrator atau Teknisi harus mengembalikan 403 Forbidden', async () => {
    const request = new Request('http://localhost/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Admin User',
        'x-actor-role': 'Administrator' // Admin tidak boleh mengajukan laporan!
      },
      body: JSON.stringify({
        title: 'AC Bocor di R.301',
        description: 'AC meneteskan air.',
        location: 'Gedung D, Lantai 3',
        category: 'AC & Pendingin Ruangan'
      })
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(403);
    
    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
    expect(body.message).toContain('Access denied');
  });

  it('POST /api/reports/:reportId/attachments - Pelapor (pemilik) mengunggah file gambar valid harus menghasilkan 201 Created', async () => {
    const formData = new FormData();
    const mockFile = new Blob(['image data'], { type: 'image/jpeg' });
    formData.append('file', mockFile, 'photo.jpg');

    const request = new Request('http://localhost/api/reports/999/attachments', {
      method: 'POST',
      headers: {
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: formData
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(201);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.attachment.id).toBe(888);
    expect(body.attachment.file_name).toBe('photo.jpg');
    expect(body.attachment.file_type).toBe('image/jpeg');
  });

  it('POST /api/reports/:reportId/attachments - Mengunggah file bukan gambar harus mengembalikan 400 VALIDATION_ERROR', async () => {
    const formData = new FormData();
    const mockFile = new Blob(['text data'], { type: 'text/plain' });
    formData.append('file', mockFile, 'test_doc.txt');

    const request = new Request('http://localhost/api/reports/999/attachments', {
      method: 'POST',
      headers: {
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: formData
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Only JPEG and PNG images are allowed');
  });

  it('POST /api/reports/:reportId/attachments - Mencoba mengunggah ke laporan milik orang lain harus mengembalikan 403 Forbidden', async () => {
    const formData = new FormData();
    const mockFile = new Blob(['image data'], { type: 'image/png' });
    formData.append('file', mockFile, 'photo.png');

    const request = new Request('http://localhost/api/reports/999/attachments', {
      method: 'POST',
      headers: {
        'x-actor-id': 'pelapor-2',
        'x-actor-name': 'John Doe',
        'x-actor-role': 'Pelapor'
      },
      body: formData
    });

    const response = await router.handle(request, mockEnv, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
    expect(body.message).toContain('Access denied. You do not own this service request');
  });
});

function createDetailMockDb(options?: {
  report?: any;
  history?: any[];
  comments?: any[];
  attachments?: any[];
  assignmentFound?: boolean;
}) {
  const queries: QueryLog[] = [];

  const db = {
    prepare: (sql: string) => {
      let boundArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          boundArgs = args;
          return stmt;
        },
        run: async () => {
          queries.push({ sql, args: boundArgs });
          return { success: true, meta: { last_row_id: 999 } };
        },
        first: async () => {
          queries.push({ sql, args: boundArgs });
          // Main report query
          if (sql.includes('FROM service_requests sr') && sql.includes('sr.id = ?')) {
            if (options && 'report' in options && options.report === null) return null;
            return options?.report ?? {
              id: 101,
              title: 'AC Mati di Lab Komputer',
              description: 'AC tidak menyala sejak pagi.',
              location: 'Gedung D, Lantai 2',
              category: 'AC & Pendingin Ruangan',
              priority: 'high',
              status: 'baru',
              created_by: 'pelapor-1',
              created_at: '2026-07-03 09:00:00',
              updated_at: '2026-07-03 09:00:00',
              assigned_technician_id: 'teknisi-1'
            };
          }
          // Assignment check for Teknisi
          if (sql.includes('FROM service_request_assignments a') && sql.includes('a.service_request_id = ?')) {
            return options?.assignmentFound !== false ? { 1: 1 } : null;
          }
          return null;
        },
        all: async () => {
          queries.push({ sql, args: boundArgs });
          if (sql.includes('service_request_status_history')) {
            return {
              success: true,
              results: options?.history ?? [
                {
                  id: 1, service_request_id: 101,
                  old_status: null, new_status: 'baru',
                  actor_id: 'pelapor-1', actor_role: 'Pelapor',
                  changed_at: '2026-07-03 09:00:00',
                  notes: 'Laporan baru dibuat.'
                }
              ]
            };
          }
          if (sql.includes('service_request_comments')) {
            return {
              success: true,
              results: options?.comments ?? [
                {
                  id: 1, service_request_id: 101,
                  comment: 'Mohon segera ditangani.',
                  sender_id: 'pelapor-1',
                  sender_name: 'Fajar Ramadhan',
                  sender_role: 'Pelapor',
                  created_at: '2026-07-03 09:05:00'
                }
              ]
            };
          }
          if (sql.includes('service_request_attachments')) {
            return {
              success: true,
              results: options?.attachments ?? [
                {
                  id: 1, service_request_id: 101,
                  file_path: 'reports/101/photo.jpg',
                  file_name: 'photo.jpg',
                  file_type: 'image/jpeg',
                  file_size: 204800,
                  uploaded_at: '2026-07-03 09:02:00'
                }
              ]
            };
          }
          return { success: true, results: [] };
        }
      };
      return stmt;
    }
  } as unknown as D1Database;

  return { db, queries };
}

describe('GET /api/reports - Role-aware list features', () => {
  it('GET /api/reports - Pelapor hanya melihat laporan miliknya melalui clause reporter_id/created_by', async () => {
    const { db, queries } = createListMockDb();
    const env = {
      DB: db,
      ATTACHMENTS: mockR2
    } as Env;

    const request = new Request('http://localhost/api/reports?page=1&page_size=10', {
      method: 'GET',
      headers: {
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.total_items).toBe(1);
    expect(body.items[0].report_code).toBe('CM-101');
    expect(body.items[0].created_by).toBe('pelapor-1');

    const selectQuery = queries.find(q => q.sql.includes('FROM service_requests sr') && q.sql.includes('ORDER BY'));
    expect(selectQuery?.sql).toContain('sr.created_by = ?');
    expect(selectQuery?.sql).not.toContain('EXISTS (SELECT 1 FROM service_request_assignments');
    expect(selectQuery?.args[0]).toBe('pelapor-1');
  });

  it('GET /api/reports - Administrator dapat melihat seluruh laporan dan status baru diurutkan dari tanggal terbaru', async () => {
    const { db, queries } = createListMockDb({
      totalItems: 2,
      rows: [
        {
          id: 202,
          title: 'Lampu Koridor Padam',
          description: 'Lampu mati total.',
          location: 'Gedung B, Lantai 1',
          category: 'Kelistrikan & Penerangan',
          priority: 'low',
          status: 'baru',
          created_by: 'pelapor-2',
          created_at: '2026-07-03 11:00:00',
          updated_at: '2026-07-03 11:00:00',
          assigned_technician_id: null
        },
        {
          id: 201,
          title: 'Proyektor Buram',
          description: 'Gambar tidak fokus.',
          location: 'Gedung A, Lantai 2',
          category: 'Alat Presentasi/Proyektor',
          priority: 'medium',
          status: 'baru',
          created_by: 'pelapor-3',
          created_at: '2026-07-03 10:00:00',
          updated_at: '2026-07-03 10:00:00',
          assigned_technician_id: null
        }
      ]
    });
    const env = {
      DB: db,
      ATTACHMENTS: mockR2
    } as Env;

    const request = new Request('http://localhost/api/reports?status=baru&sort=created_at_desc&page=1&page_size=20', {
      method: 'GET',
      headers: {
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.total_items).toBe(2);
    expect(body.items[0].report_code).toBe('CM-202');
    expect(body.items[0].status).toBe('baru');

    const countQuery = queries.find(q => q.sql.includes('COUNT(*) as total_items'));
    const selectQuery = queries.find(q => q.sql.includes('FROM service_requests sr') && q.sql.includes('ORDER BY'));

    expect(countQuery?.sql).not.toContain('created_by = ?');
    expect(countQuery?.sql).not.toContain('EXISTS (SELECT 1 FROM service_request_assignments');
    expect(selectQuery?.sql).toContain('sr.status = ?');
    expect(selectQuery?.sql).toContain('ORDER BY sr.created_at DESC, sr.id DESC');
    expect(selectQuery?.args).toContain('baru');
  });

  it('GET /api/reports - Teknisi hanya melihat laporan yang ditugaskan kepadanya melalui EXISTS assignment', async () => {
    const { db, queries } = createListMockDb();
    const env = {
      DB: db,
      ATTACHMENTS: mockR2
    } as Env;

    const request = new Request('http://localhost/api/reports?sort=created_at_asc', {
      method: 'GET',
      headers: {
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.items[0].assigned_technician_id).toBe('teknisi-1');

    const selectQuery = queries.find(q => q.sql.includes('FROM service_requests sr') && q.sql.includes('ORDER BY'));
    expect(selectQuery?.sql).toContain('EXISTS (SELECT 1 FROM service_request_assignments a WHERE a.service_request_id = sr.id AND a.technician_id = ?');
    expect(selectQuery?.sql).not.toContain('sr.created_by = ?');
    expect(selectQuery?.sql).toContain('ORDER BY sr.created_at ASC, sr.id ASC');
    expect(selectQuery?.args[0]).toBe('teknisi-1');
  });
});

describe('GET /api/reports/:reportId - Detail report features', () => {
  it('GET /api/reports/:reportId - Pelapor melihat detail laporan miliknya harus 200 dan berisi semua data relasional', async () => {
    const { db, queries } = createDetailMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101', {
      method: 'GET',
      headers: {
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.id).toBe(101);
    expect(body.report.report_code).toBe('CM-101');
    expect(body.report.created_by).toBe('pelapor-1');
    expect(body.report.assigned_technician_id).toBe('teknisi-1');

    // Verifikasi data relasional
    expect(body.report.status_history).toBeInstanceOf(Array);
    expect(body.report.status_history.length).toBeGreaterThan(0);
    expect(body.report.status_history[0].new_status).toBe('baru');

    expect(body.report.comments).toBeInstanceOf(Array);
    expect(body.report.comments[0].comment).toContain('Mohon segera ditangani');
    expect(body.report.comments[0].sender_name).toBe('Fajar Ramadhan');

    expect(body.report.attachments).toBeInstanceOf(Array);
    expect(body.report.attachments[0].file_name).toBe('photo.jpg');
    expect(body.report.attachments[0].file_type).toBe('image/jpeg');

    // Verifikasi query yang dijalankan
    const reportQuery = queries.find(q => q.sql.includes('FROM service_requests sr') && q.sql.includes('WHERE sr.id = ?'));
    expect(reportQuery).toBeDefined();
    expect(reportQuery?.args[0]).toBe('101');
  });

  it('GET /api/reports/:reportId - Pelapor mencoba melihat laporan orang lain harus 403', async () => {
    const { db } = createDetailMockDb({
      report: {
        id: 101, title: 'Test', description: 'Test', location: 'Gedung A',
        category: 'AC', priority: 'low', status: 'baru',
        created_by: 'pelapor-2', created_at: '2026-07-03 09:00:00', updated_at: '2026-07-03 09:00:00',
        assigned_technician_id: null
      }
    });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101', {
      method: 'GET',
      headers: {
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
    expect(body.message).toContain('Access denied');
  });

  it('GET /api/reports/:reportId - Admin dapat melihat laporan apa pun', async () => {
    const { db } = createDetailMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101', {
      method: 'GET',
      headers: {
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.status_history).toBeInstanceOf(Array);
    expect(body.report.comments).toBeInstanceOf(Array);
    expect(body.report.attachments).toBeInstanceOf(Array);
  });

  it('GET /api/reports/:reportId - Teknisi dapat melihat laporan yang ditugaskan', async () => {
    const { db } = createDetailMockDb({ assignmentFound: true });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101', {
      method: 'GET',
      headers: {
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.assigned_technician_id).toBe('teknisi-1');
  });

  it('GET /api/reports/:reportId - Teknisi mencoba melihat laporan yang tidak ditugaskan harus 403', async () => {
    const { db } = createDetailMockDb({ assignmentFound: false });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101', {
      method: 'GET',
      headers: {
        'x-actor-id': 'teknisi-2',
        'x-actor-name': 'Teknisi Lain',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
    expect(body.message).toContain('Access denied');
  });

  it('GET /api/reports/:reportId - ID laporan tidak ditemukan harus 404', async () => {
    const { db } = createDetailMockDb({ report: null });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/99999', {
      method: 'GET',
      headers: {
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(404);

    const body: any = await response.json();
    expect(body.error).toBe('NOT_FOUND');
    expect(body.message).toContain('Service request not found');
  });

function createTriageMockDb(options?: {
  report?: any;
  updatedReport?: any;
}) {
  const queries: QueryLog[] = [];
  let updateStep = 0;

  const db = {
    prepare: (sql: string) => {
      let boundArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          boundArgs = args;
          return stmt;
        },
        run: async () => {
          queries.push({ sql, args: boundArgs });
          updateStep++;
          return { success: true, meta: { last_row_id: 101 } };
        },
        first: async () => {
          queries.push({ sql, args: boundArgs });
        // First SELECT — check status
        if (sql.includes('SELECT id, status FROM')) {
          if (options && 'report' in options) return options.report;
          return { id: 101, status: 'baru' };
        }
          // Second SELECT — after update
          if (sql.includes('SELECT id, title, description, location, category, priority, status, created_by, created_at, updated_at, rejection_reason FROM')) {
            return options?.updatedReport ?? {
              id: 101,
              title: 'AC Mati di Lab Komputer',
              description: 'AC tidak menyala sejak pagi.',
              location: 'Gedung D, Lantai 2',
              category: 'AC & Pendingin Ruangan',
              priority: 'high',
              status: 'diperiksa',
              created_by: 'pelapor-1',
              created_at: '2026-07-03 09:00:00',
              updated_at: '2026-07-03 10:00:00',
              rejection_reason: null
            };
          }
          return null;
        },
        all: async () => {
          queries.push({ sql, args: boundArgs });
          return { success: true, results: [] };
        }
      };
      return stmt;
    }
  } as unknown as D1Database;

  return { db, queries };
}

describe('PATCH /api/reports/:reportId/triage - Triage (Admin approve/reject)', () => {
  it('PATCH /api/reports/:reportId/triage - Admin menyetujui laporan dengan kategori dan prioritas valid harus 200', async () => {
    const { db, queries } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({
        action: 'approve',
        category: 'AC & Pendingin Ruangan',
        priority: 'high'
      })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.status).toBe('diperiksa');
    expect(body.report.category).toBe('AC & Pendingin Ruangan');
    expect(body.report.priority).toBe('high');
    expect(body.report.rejection_reason).toBeNull();

    // Verifikasi query sequence: SELECT → UPDATE → INSERT → SELECT
    const updateQueries = queries.filter(q => q.sql.includes('UPDATE service_requests'));
    expect(updateQueries.length).toBe(1);
    expect(updateQueries[0].sql).toContain('status = \'diperiksa\'');
    expect(updateQueries[0].args).toContain('AC & Pendingin Ruangan');
    expect(updateQueries[0].args).toContain('high');

    const insertQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_status_history'));
    expect(insertQueries.length).toBe(1);
    expect(insertQueries[0].sql).toContain('diperiksa');
  });

  it('PATCH /api/reports/:reportId/triage - Admin menolak laporan dengan alasan valid harus 200', async () => {
    const { db, queries } = createTriageMockDb({
      updatedReport: {
        id: 101,
        title: 'AC Mati di Lab Komputer',
        description: 'AC tidak menyala sejak pagi.',
        location: 'Gedung D, Lantai 2',
        category: 'AC & Pendingin Ruangan',
        priority: 'low',
        status: 'ditolak',
        created_by: 'pelapor-1',
        created_at: '2026-07-03 09:00:00',
        updated_at: '2026-07-03 10:00:00',
        rejection_reason: 'Tiket duplikat dengan CM-99'
      }
    });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({
        action: 'reject',
        rejection_reason: 'Tiket duplikat dengan CM-99'
      })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.status).toBe('ditolak');
    expect(body.report.rejection_reason).toBe('Tiket duplikat dengan CM-99');

    const updateQueries = queries.filter(q => q.sql.includes('UPDATE service_requests'));
    expect(updateQueries.length).toBe(1);
    expect(updateQueries[0].sql).toContain('status = \'ditolak\'');
    expect(updateQueries[0].args[0]).toBe('Tiket duplikat dengan CM-99');

    const insertQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_status_history'));
    expect(insertQueries.length).toBe(1);
    expect(insertQueries[0].sql).toContain('ditolak');
  });

  it('PATCH /api/reports/:reportId/triage - Mengirim action invalid harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'unknown' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Action must be either "approve" or "reject"');
  });

  it('PATCH /api/reports/:reportId/triage - Approve tanpa category harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'approve', priority: 'high' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Category is required');
  });

  it('PATCH /api/reports/:reportId/triage - Approve dengan priority invalid harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'approve', category: 'AC', priority: 'super-urgent' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Priority must be one of');
  });

  it('PATCH /api/reports/:reportId/triage - Reject tanpa rejection_reason harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'reject', rejection_reason: '' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Rejection reason is required');
  });

  it('PATCH /api/reports/:reportId/triage - Laporan tidak ditemukan harus 404', async () => {
    const { db } = createTriageMockDb({ report: null });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/99999/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'approve', category: 'AC', priority: 'high' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(404);

    const body: any = await response.json();
    expect(body.error).toBe('NOT_FOUND');
    expect(body.message).toContain('Service request not found');
  });

  it('PATCH /api/reports/:reportId/triage - Laporan sudah berstatus diperiksa harus 409', async () => {
    const { db } = createTriageMockDb({
      report: { id: 101, status: 'diperiksa' }
    });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'approve', category: 'AC', priority: 'high' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(409);

    const body: any = await response.json();
    expect(body.error).toBe('CONFLICT');
    expect(body.message).toContain('Cannot triage a report with status');
  });

  it('PATCH /api/reports/:reportId/triage - Non-Admin role harus 403', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: JSON.stringify({ action: 'approve', category: 'AC', priority: 'high' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
  });

  it('PATCH /api/reports/:reportId/triage - Invalid JSON body harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: 'not-json'
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('BAD_REQUEST');
    expect(body.message).toContain('Invalid JSON body');
  });

  it('PATCH /api/reports/:reportId/triage - Report ID non-numeric harus 400', async () => {
    const { db } = createTriageMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/abc/triage', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ action: 'approve', category: 'AC', priority: 'high' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});

function createAcceptRejectMockDb(options?: {
  assignment?: any;
  reportStatus?: string;
}) {
  const queries: QueryLog[] = [];

  const db = {
    prepare: (sql: string) => {
      let boundArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          boundArgs = args;
          return stmt;
        },
        run: async () => {
          queries.push({ sql, args: boundArgs });
          return { success: true, meta: { last_row_id: 777 } };
        },
        first: async () => {
          queries.push({ sql, args: boundArgs });
          if (sql.includes('FROM service_request_assignments a') && sql.includes('JOIN service_requests sr')) {
            if (options && 'assignment' in options) return options.assignment;
            return {
              id: 555,
              technician_id: 'teknisi-1',
              status: 'ditugaskan'
            };
          }
          return null;
        },
        all: async () => {
          queries.push({ sql, args: boundArgs });
          return { success: true, results: [] };
        }
      };
      return stmt;
    }
  } as unknown as D1Database;

  return { db, queries };
}

describe('POST /api/reports/:reportId/assignment/accept - Accept assignment', () => {
  it('Teknisi menerima tugas yang ditugaskan harus 200', async () => {
    const { db, queries } = createAcceptRejectMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assignment/accept', {
      method: 'POST',
      headers: {
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);

    // Update assignment status + acknowledged_at
    const assignUpdateQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_request_assignments') && q.sql.includes("status = 'accepted'")
    );
    expect(assignUpdateQueries.length).toBe(1);
    expect(assignUpdateQueries[0].args[0]).toBe(555);

    // Update report status
    const reportUpdateQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_requests') && q.sql.includes("status = 'diterima'")
    );
    expect(reportUpdateQueries.length).toBe(1);

    // History
    const historyQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_status_history'));
    expect(historyQueries.length).toBe(1);
    expect(historyQueries[0].sql).toContain('diterima');
  });

  it('Teknisi lain yang tidak ditugaskan harus 403', async () => {
    const { db } = createAcceptRejectMockDb({ assignment: null });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assignment/accept', {
      method: 'POST',
      headers: {
        'x-actor-id': 'teknisi-2',
        'x-actor-name': 'Andi Wijaya',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
  });

  it('ID non-numeric harus 400', async () => {
    const { db } = createAcceptRejectMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/abc/assignment/accept', {
      method: 'POST',
      headers: {
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/reports/:reportId/assignment/reject - Reject assignment', () => {
  it('Teknisi menolak tugas dengan alasan harus 200', async () => {
    const { db, queries } = createAcceptRejectMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assignment/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      },
      body: JSON.stringify({ rejection_reason: 'Lokasi terlalu jauh' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);

    // Deaktivasi assignment + catat alasan
    const deactivateQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_request_assignments') && q.sql.includes('is_active = 0')
    );
    expect(deactivateQueries.length).toBe(1);
    expect(deactivateQueries[0].args[0]).toBe('Lokasi terlalu jauh');
    expect(deactivateQueries[0].args[1]).toBe(555);

    // Kembalikan status laporan ke diperiksa
    const reportUpdateQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_requests') && q.sql.includes("status = 'diperiksa'")
    );
    expect(reportUpdateQueries.length).toBe(1);

    // History
    const historyQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_status_history'));
    expect(historyQueries.length).toBe(1);
    expect(historyQueries[0].sql).toContain('diperiksa');
  });

  it('Menolak tanpa alasan harus 400', async () => {
    const { db } = createAcceptRejectMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assignment/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      },
      body: JSON.stringify({ rejection_reason: '' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Rejection reason is required');
  });

  it('Teknisi lain yang tidak ditugaskan harus 403', async () => {
    const { db } = createAcceptRejectMockDb({ assignment: null });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assignment/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'teknisi-2',
        'x-actor-name': 'Andi Wijaya',
        'x-actor-role': 'Teknisi'
      },
      body: JSON.stringify({ rejection_reason: 'Lokasi terlalu jauh' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
  });

  it('ID non-numeric harus 400', async () => {
    const { db } = createAcceptRejectMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/abc/assignment/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'teknisi-1',
        'x-actor-name': 'Budi Santoso',
        'x-actor-role': 'Teknisi'
      },
      body: JSON.stringify({ rejection_reason: 'Lokasi terlalu jauh' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});

function createAssignMockDb(options?: {
  report?: any;
  updatedReport?: any;
}) {
  const queries: QueryLog[] = [];
  let updateStep = 0;

  const db = {
    prepare: (sql: string) => {
      let boundArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          boundArgs = args;
          return stmt;
        },
        run: async () => {
          queries.push({ sql, args: boundArgs });
          updateStep++;
          return { success: true, meta: { last_row_id: 888 } };
        },
        first: async () => {
          queries.push({ sql, args: boundArgs });
          if (sql.includes('SELECT id, status FROM')) {
            if (options && 'report' in options) return options.report;
            return { id: 101, status: 'diperiksa' };
          }
          if (sql.includes('SELECT id, title, description, location, category, priority, status, created_by, assigned_technician_id, created_at, updated_at FROM')) {
            return options?.updatedReport ?? {
              id: 101,
              title: 'AC Mati di Lab Komputer',
              description: 'AC tidak menyala sejak pagi.',
              location: 'Gedung D, Lantai 2',
              category: 'AC & Pendingin Ruangan',
              priority: 'high',
              status: 'ditugaskan',
              created_by: 'pelapor-1',
              assigned_technician_id: 'teknisi-1',
              created_at: '2026-07-03 09:00:00',
              updated_at: '2026-07-03 11:00:00'
            };
          }
          return null;
        },
        all: async () => {
          queries.push({ sql, args: boundArgs });
          return { success: true, results: [] };
        }
      };
      return stmt;
    }
  } as unknown as D1Database;

  return { db, queries };
}

describe('POST /api/reports/:reportId/assign - Assign technician', () => {
  it('POST /api/reports/:reportId/assign - Admin menugaskan teknisi ke laporan diperiksa harus 200', async () => {
    const { db, queries } = createAssignMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ technician_id: 'teknisi-1' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.status).toBe('ditugaskan');
    expect(body.report.assigned_technician_id).toBe('teknisi-1');

    // Verifikasi: deaktivasi lama, insert baru, update status
    const deactivateQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_request_assignments') && q.sql.includes('is_active = 0')
    );
    expect(deactivateQueries.length).toBe(1);
    expect(deactivateQueries[0].args[0]).toBe('101');

    const insertQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_assignments'));
    expect(insertQueries.length).toBe(1);
    expect(insertQueries[0].args[1]).toBe('teknisi-1');
    // is_active = 1 hardcoded in SQL VALUES clause

    const updateStatusQueries = queries.filter(q =>
      q.sql.includes('UPDATE service_requests') && q.sql.includes("status = 'ditugaskan'")
    );
    expect(updateStatusQueries.length).toBe(1);
    expect(updateStatusQueries[0].args[0]).toBe('teknisi-1');

    const historyQueries = queries.filter(q => q.sql.includes('INSERT INTO service_request_status_history'));
    expect(historyQueries.length).toBe(1);
    expect(historyQueries[0].sql).toContain('ditugaskan');
  });

  it('POST /api/reports/:reportId/assign - Admin menugaskan teknisi ke laporan dibuka_kembali harus 200', async () => {
    const { db } = createAssignMockDb({
      report: { id: 101, status: 'dibuka_kembali' }
    });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ technician_id: 'teknisi-2' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(200);

    const body: any = await response.json();
    expect(body.success).toBe(true);
    expect(body.report.status).toBe('ditugaskan');
  });

  it('POST /api/reports/:reportId/assign - Laporan berstatus baru harus 409', async () => {
    const { db } = createAssignMockDb({
      report: { id: 101, status: 'baru' }
    });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ technician_id: 'teknisi-1' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(409);

    const body: any = await response.json();
    expect(body.error).toBe('CONFLICT');
    expect(body.message).toContain('Cannot assign');
  });

  it('POST /api/reports/:reportId/assign - Tanpa technician_id harus 400', async () => {
    const { db } = createAssignMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({})
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Technician ID is required');
  });

  it('POST /api/reports/:reportId/assign - Laporan tidak ditemukan harus 404', async () => {
    const { db } = createAssignMockDb({ report: null });
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/99999/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ technician_id: 'teknisi-1' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(404);

    const body: any = await response.json();
    expect(body.error).toBe('NOT_FOUND');
  });

  it('POST /api/reports/:reportId/assign - Non-Admin role harus 403', async () => {
    const { db } = createAssignMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/101/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'pelapor-1',
        'x-actor-name': 'Fajar Ramadhan',
        'x-actor-role': 'Pelapor'
      },
      body: JSON.stringify({ technician_id: 'teknisi-1' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(403);

    const body: any = await response.json();
    expect(body.error).toBe('FORBIDDEN');
  });

  it('POST /api/reports/:reportId/assign - ID non-numeric harus 400', async () => {
    const { db } = createAssignMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/abc/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      },
      body: JSON.stringify({ technician_id: 'teknisi-1' })
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});

  it('GET /api/reports/:reportId - ID non-numeric harus 400', async () => {
    const { db } = createDetailMockDb();
    const env = { DB: db, ATTACHMENTS: mockR2 } as Env;

    const request = new Request('http://localhost/api/reports/abc', {
      method: 'GET',
      headers: {
        'x-actor-id': 'admin-1',
        'x-actor-name': 'Administrator',
        'x-actor-role': 'Administrator'
      }
    });

    const response = await router.handle(request, env, mockCtx);
    expect(response.status).toBe(400);

    const body: any = await response.json();
    expect(body.error).toBe('VALIDATION_ERROR');
  });
});
