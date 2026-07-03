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
