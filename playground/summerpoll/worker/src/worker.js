// Summer Poll — Cloudflare Worker API
//
// Endpoints:
//   POST   /api/polls                                  → create poll
//   GET    /api/polls/:id                              → fetch poll + responses
//   POST   /api/polls/:id/responses                    → upsert a response
//   DELETE /api/polls/:id/responses/:respId            → remove response (admin only)
//   DELETE /api/polls/:id                              → remove poll (admin only)
//
// Storage:
//   KV namespace bound as POLLS
//     poll:{id}        → { id, title, description, start, end, created, adminToken }
//     responses:{id}   → [ { id, name, color, availability, created, updated } ]

const ALLOWED_ORIGIN_SUFFIXES = ['.pages.dev', '.workers.dev'];
const ALLOWED_ORIGINS = new Set([
  'https://jccl.me',
  'https://www.jccl.me',
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
]);

function originAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return ALLOWED_ORIGIN_SUFFIXES.some(s => origin.endsWith(s));
}

function withCors(req, res) {
  const origin = req.headers.get('Origin') || '';
  const h = new Headers(res.headers);
  if (originAllowed(origin)) h.set('Access-Control-Allow-Origin', origin);
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  h.set('Access-Control-Max-Age', '86400');
  return new Response(res.body, { status: res.status, headers: h });
}

function jsonRes(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
function randomId(len = 9) {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < len; i++) out += ID_ALPHABET[buf[i] % ID_ALPHABET.length];
  return out;
}

function randomToken() {
  const buf = new Uint8Array(24);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime());
}

function clampStr(v, max) {
  return String(v ?? '').slice(0, max).trim();
}

function safeAvailability(av) {
  if (!av || typeof av !== 'object') return {};
  const out = {};
  let n = 0;
  for (const k of Object.keys(av)) {
    if (++n > 400) break;
    if (!isDate(k)) continue;
    const v = av[k];
    if (v === 1 || v === 2) out[k] = v;
  }
  return out;
}

async function readJson(req, max = 32 * 1024) {
  const text = await req.text();
  if (text.length > max) throw new Error('payload too large');
  try { return JSON.parse(text); } catch { throw new Error('invalid json'); }
}

async function createPoll(req, env) {
  const body = await readJson(req);
  const title = clampStr(body.title, 200);
  const description = clampStr(body.description, 1000);
  const start = body.start, end = body.end;
  if (!title) return jsonRes({ error: 'title required' }, 400);
  if (!isDate(start) || !isDate(end)) return jsonRes({ error: 'invalid dates' }, 400);
  if (start > end) return jsonRes({ error: 'start after end' }, 400);
  const days = (new Date(end) - new Date(start)) / 86400000;
  if (days > 365) return jsonRes({ error: 'range too long (max 365 days)' }, 400);

  const id = randomId(9);
  const adminToken = randomToken();
  const poll = {
    id, title, description, start, end,
    created: new Date().toISOString(),
    adminToken,
  };
  await env.POLLS.put('poll:' + id, JSON.stringify(poll));
  await env.POLLS.put('responses:' + id, '[]');
  return jsonRes(poll);
}

async function getPoll(id, env) {
  const raw = await env.POLLS.get('poll:' + id);
  if (!raw) return jsonRes({ error: 'not found' }, 404);
  const poll = JSON.parse(raw);
  delete poll.adminToken;
  const rawResp = await env.POLLS.get('responses:' + id);
  const responses = rawResp ? JSON.parse(rawResp) : [];
  return jsonRes({ ...poll, responses });
}

async function upsertResponse(pollId, req, env) {
  const pollRaw = await env.POLLS.get('poll:' + pollId);
  if (!pollRaw) return jsonRes({ error: 'poll not found' }, 404);
  const poll = JSON.parse(pollRaw);

  const body = await readJson(req);
  const name = clampStr(body.name, 60);
  if (!name) return jsonRes({ error: 'name required' }, 400);
  const color = (typeof body.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.color))
    ? body.color : '#7c3aed';
  const availability = safeAvailability(body.availability);

  // Validate availability dates fall in the poll range
  for (const k of Object.keys(availability)) {
    if (k < poll.start || k > poll.end) delete availability[k];
  }

  const rawResp = await env.POLLS.get('responses:' + pollId);
  let responses = rawResp ? JSON.parse(rawResp) : [];
  const now = new Date().toISOString();

  let resp = null;
  if (typeof body.id === 'string' && body.id) {
    const idx = responses.findIndex(r => r.id === body.id);
    if (idx >= 0) {
      responses[idx] = { ...responses[idx], name, color, availability, updated: now };
      resp = responses[idx];
    }
  }
  if (!resp) {
    if (responses.length >= 200) return jsonRes({ error: 'poll full (200 max)' }, 400);
    resp = {
      id: randomId(12), name, color, availability,
      created: now, updated: now,
    };
    responses.push(resp);
  }
  await env.POLLS.put('responses:' + pollId, JSON.stringify(responses));
  return jsonRes(resp);
}

async function deleteResponse(pollId, respId, req, env) {
  const token = req.headers.get('X-Admin-Token') || '';
  const pollRaw = await env.POLLS.get('poll:' + pollId);
  if (!pollRaw) return jsonRes({ error: 'poll not found' }, 404);
  const poll = JSON.parse(pollRaw);
  if (poll.adminToken !== token) return jsonRes({ error: 'forbidden' }, 403);

  const rawResp = await env.POLLS.get('responses:' + pollId);
  let responses = rawResp ? JSON.parse(rawResp) : [];
  const before = responses.length;
  responses = responses.filter(r => r.id !== respId);
  if (responses.length === before) return jsonRes({ error: 'response not found' }, 404);
  await env.POLLS.put('responses:' + pollId, JSON.stringify(responses));
  return jsonRes({ ok: true });
}

async function deletePoll(id, req, env) {
  const token = req.headers.get('X-Admin-Token') || '';
  const pollRaw = await env.POLLS.get('poll:' + id);
  if (!pollRaw) return jsonRes({ error: 'not found' }, 404);
  const poll = JSON.parse(pollRaw);
  if (poll.adminToken !== token) return jsonRes({ error: 'forbidden' }, 403);
  await env.POLLS.delete('poll:' + id);
  await env.POLLS.delete('responses:' + id);
  return jsonRes({ ok: true });
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') {
      return withCors(req, new Response(null, { status: 204 }));
    }
    const url = new URL(req.url);
    const path = url.pathname;

    let res;
    try {
      if (path === '/' || path === '/api') {
        res = jsonRes({ name: 'summerpoll-api', ok: true });
      } else if (path === '/api/polls' && req.method === 'POST') {
        res = await createPoll(req, env);
      } else {
        const m = path.match(/^\/api\/polls\/([a-z0-9]+)(?:\/responses(?:\/([a-z0-9]+))?)?$/);
        if (m) {
          const [, pollId, respId] = m;
          if (!respId && !path.endsWith('/responses') && req.method === 'GET') {
            res = await getPoll(pollId, env);
          } else if (path.endsWith('/responses') && req.method === 'POST') {
            res = await upsertResponse(pollId, req, env);
          } else if (respId && req.method === 'DELETE') {
            res = await deleteResponse(pollId, respId, req, env);
          } else if (!respId && !path.endsWith('/responses') && req.method === 'DELETE') {
            res = await deletePoll(pollId, req, env);
          }
        }
        if (!res) res = jsonRes({ error: 'not found' }, 404);
      }
    } catch (e) {
      const msg = e && e.message ? e.message : 'server error';
      const status = /payload too large|invalid json/.test(msg) ? 400 : 500;
      res = jsonRes({ error: msg }, status);
    }
    return withCors(req, res);
  },
};
