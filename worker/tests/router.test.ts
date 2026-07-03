import { describe, it, expect } from 'vitest';
import { router } from '../index';
import { Env } from '../types';

describe('Router & Middleware Tests', () => {
  const mockEnv = {} as Env;
  const mockCtx = {} as ExecutionContext;

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
