import { RouteContext, RouteHandler, Middleware, Env } from './types';

interface Route {
  method: string;
  path: string;
  regex: RegExp;
  paramNames: string[];
  handlers: RouteHandler[];
}

export class Router {
  private routes: Route[] = [];
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  private add(method: string, path: string, ...handlers: RouteHandler[]) {
    const paramNames: string[] = [];
    // Convert path parameter pattern: :param to regex ([^/]+)
    const parsedPath = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${parsedPath}$`);

    this.routes.push({
      method,
      path,
      regex,
      paramNames,
      handlers
    });
  }

  get(path: string, ...handlers: RouteHandler[]) {
    this.add('GET', path, ...handlers);
  }

  post(path: string, ...handlers: RouteHandler[]) {
    this.add('POST', path, ...handlers);
  }

  put(path: string, ...handlers: RouteHandler[]) {
    this.add('PUT', path, ...handlers);
  }

  delete(path: string, ...handlers: RouteHandler[]) {
    this.add('DELETE', path, ...handlers);
  }

  async handle(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    let matchedRoute: Route | null = null;
    let matchedParams: Record<string, string> = {};

    for (const route of this.routes) {
      if (route.method === method) {
        const match = pathname.match(route.regex);
        if (match) {
          matchedRoute = route;
          matchedParams = {};
          route.paramNames.forEach((name, idx) => {
            matchedParams[name] = decodeURIComponent(match[idx + 1]);
          });
          break;
        }
      }
    }

    if (!matchedRoute) {
      return new Response(
        JSON.stringify({ error: 'NOT_FOUND', message: 'Resource not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Build the middleware / handler chain
    let handlerIndex = 0;
    const allHandlers = [...matchedRoute.handlers];

    const next = async (): Promise<Response> => {
      if (handlerIndex < allHandlers.length) {
        const currentHandler = allHandlers[handlerIndex++];
        return currentHandler(request, ctx);
      }
      return new Response(
        JSON.stringify({ error: 'NO_RESPONSE', message: 'No handler returned a response' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    };

    const ctx: RouteContext = {
      env,
      executionCtx,
      params: matchedParams,
      next
    };

    // Chain global middlewares
    let middlewareIndex = 0;
    const runMiddleware = async (): Promise<Response> => {
      if (middlewareIndex < this.middlewares.length) {
        const mw = this.middlewares[middlewareIndex++];
        return mw(request, ctx, runMiddleware);
      }
      return next();
    };

    return runMiddleware();
  }
}
