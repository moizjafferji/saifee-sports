// Cloudflare Pages Function: /functions/gas.js
// Env vars (set in Pages → Settings → Environment variables):
//   GAS_BASE    = your Apps Script /exec URL
//   CORS_ORIGIN = https://your-domain.example (optional; otherwise "*")

export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin'))
  });
}

export async function onRequest({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (!env.GAS_BASE) {
    return json({ ok:false, error:'Missing GAS_BASE env var' }, 500, origin);
  }

  // pull method + args from request
  let targetMethod = '';
  let args = [];
  if (method === 'GET') {
    targetMethod = url.searchParams.get('method') || '';
    const raw = url.searchParams.get('args');
    args = raw ? JSON.parse(raw) : [];
  } else if (method === 'POST') {
    const body = await request.json().catch(()=>({}));
    targetMethod = body && body.method || '';
    args = (body && body.args) || [];
  }

  // Cache TTLs (seconds) per method.
  // User-specific methods use a short TTL so data stays fresh.
  // Public methods use a longer TTL since they're the same for everyone.
  const CACHE_TTLS = {
    // Public — same for all users
    'api_listEvents':      300,  // 5 min
    'api_upcomingEvents':  300,  // 5 min
    'api_eventDetails':    300,  // 5 min

    // Semi-public boot data (sports list, settings, logo) — changes rarely
    'api_bootstrap':       300,  // 5 min

    // Per-user but safe to cache briefly — keyed by ITS in the URL args
    'api_balanceQuick':     60,  // 1 min (col U read, very fast to recompute)
    'api_fullBootstrap':    60,  // 1 min (includes admin data per user)
  };

  const ttl = CACHE_TTLS[targetMethod];
  const isCacheableGet = (method === 'GET') && !!ttl;

  // Always POST to GAS (GAS reads JSON in doPost)
  const upstreamInit = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ method: targetMethod, args })
  };

  // Edge cache for cacheable GETs
  if (isCacheableGet) {
    const cache = caches.default;
    const cacheKey = new Request(request.url, { method:'GET' });
    const hit = await cache.match(cacheKey);
    if (hit) return withCors(hit, origin);

    const upstream = await fetch(env.GAS_BASE, upstreamInit);
    const body = await upstream.text();
    const resp = new Response(body, upstream);
    resp.headers.set('Cache-Control', `public, s-maxage=${ttl}, max-age=0, stale-while-revalidate=60`);
    await cache.put(cacheKey, resp.clone());
    return withCors(resp, origin);
  }

  // Non-cacheable (POST or write operations)
  const upstream = await fetch(env.GAS_BASE, upstreamInit);
  const resp = new Response(upstream.body, upstream);
  resp.headers.set('Cache-Control', 'no-store');
  return withCors(resp, origin);
}

// ---- helpers ----
function corsHeaders(origin) {
  const allow = origin && origin !== 'null' ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type, Authorization'
  };
}
function withCors(resp, origin) {
  const h = new Headers(resp.headers);
  const c = corsHeaders(origin);
  for (const [k,v] of Object.entries(c)) h.set(k,v);
  return new Response(resp.body, { status: resp.status, headers: h });
}
function json(obj, status=200, origin='') {
  const resp = new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type':'application/json' }
  });
  return withCors(resp, origin);
}
