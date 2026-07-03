import type { RouteContext } from '../types';

export class AppError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

export async function errorHandler(
  request: Request,
  ctx: RouteContext,
  next: () => Promise<Response>
): Promise<Response> {
  try {
    return await next();
  } catch (err: any) {
    const url = new URL(request.url);

    // 1. Tangani error bisnis yang terstruktur (AppError)
    if (err instanceof AppError) {
      console.warn(
        JSON.stringify({
          level: 'warn',
          timestamp: new Date().toISOString(),
          errorCode: err.errorCode,
          message: err.message,
          path: url.pathname,
          method: request.method,
          actor: ctx.actor ? ctx.actor.id : 'unauthenticated'
        })
      );

      return new Response(
        JSON.stringify({
          error: err.errorCode,
          message: err.message
        }),
        {
          status: err.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Tangani runtime error umum (General Exception) secara aman dan terstruktur
    // NFR-006 (Observability): Logging terstruktur
    console.error(
      JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        message: err.message || 'An unexpected error occurred',
        stack: err.stack,
        path: url.pathname,
        method: request.method,
        actor: ctx.actor ? ctx.actor.id : 'unauthenticated'
      })
    );

    // NFR-005 (Availability): Mengembalikan response terstruktur tanpa membocorkan stack trace
    return new Response(
      JSON.stringify({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred on the server'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
