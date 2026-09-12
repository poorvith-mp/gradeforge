export interface StrategyContext {
  cache?: {
    match: (req: string | Request) => Promise<Response | undefined>;
    put: (req: string | Request, res: Response) => Promise<void>;
  };
  fetchFn?: typeof fetch;
  origin?: string;
}

export function shouldBypassCache(url: URL, selfOrigin?: string): boolean {
  const origin = selfOrigin ?? (typeof self !== 'undefined' && self.location ? self.location.origin : '');
  if (!origin) return false;
  return url.origin !== origin;
}

export function isNavigationRequest(request: Request): boolean {
  return request.mode === 'navigate' || request.destination === 'document';
}

export async function handleNavigation(
  request: Request,
  canonicalFallback: string = '/calculator',
  ctx: StrategyContext = {}
): Promise<Response> {
  const cacheMatch = ctx.cache ? ctx.cache.match.bind(ctx.cache) : async (r: string | Request) => caches.match(r);
  const fetchFn = ctx.fetchFn ?? fetch;

  // Cache-first for navigation
  const cached = await cacheMatch(request);
  if (cached) return cached;

  const cachedCanonical = await cacheMatch(canonicalFallback);

  try {
    const res = await fetchFn(request);
    // If response is a redirect (e.g. 301/302) or error, serve canonical fallback
    if ((!res || res.status >= 300) && cachedCanonical) {
      return cachedCanonical;
    }
    return res;
  } catch {
    if (cachedCanonical) return cachedCanonical;
    throw new Error('Offline and no cached fallback available');
  }
}

export async function handleStaleWhileRevalidate(
  request: Request,
  ctx: StrategyContext = {}
): Promise<Response> {
  const cacheMatch = ctx.cache ? ctx.cache.match.bind(ctx.cache) : async (r: string | Request) => caches.match(r);
  const cachePut = ctx.cache ? ctx.cache.put.bind(ctx.cache) : async (r: string | Request, res: Response) => {
    const c = await caches.open('gradeforge-assets');
    return c.put(r, res);
  };
  const fetchFn = ctx.fetchFn ?? fetch;

  const cached = await cacheMatch(request);
  const networkPromise = (async () => {
    try {
      const response = await fetchFn(request);
      if (response && response.status === 200) {
        await cachePut(request, response.clone());
      }
      return response;
    } catch {
      return null;
    }
  })();

  if (cached) {
    return cached;
  }
  const netRes = await networkPromise;
  if (netRes) return netRes;
  return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
}
