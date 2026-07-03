export interface Actor {
  id: string;
  name: string;
  role: 'Pelapor' | 'Administrator' | 'Teknisi' | 'Manajer Fasilitas';
}

export interface RouteContext {
  env: Env;
  executionCtx: ExecutionContext;
  actor?: Actor;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export type RouteHandler = (request: Request, ctx: RouteContext) => Promise<Response> | Response;

export type Middleware = (
  request: Request,
  ctx: RouteContext,
  next: () => Promise<Response>
) => Promise<Response> | Response;

export interface Env {
  DB: D1Database;
}
