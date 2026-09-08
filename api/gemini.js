// SARANG OS — Gemini AI proxy (Vercel serverless function)
// Browser never sees the key: it lives in process.env.GEMINI_API_KEY (deployment env var).
// POST /api/gemini  body: { model?, system?, prompt }  ->  { ok: true, text } | { ok: false, error, detail?, hint? }
module.exports = async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  };
  Object.keys(cors).forEach(k => res.setHeader(k, cors[k]));
  if (req.method === 'OPTIONS') return res.status(204).end();

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(503).json({ ok: false, error: 'server-key-missing', hint: 'add GEMINI_API_KEY to the environment and redeploy' });
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method-not-allowed' });

  const body = req.body || {};
  const model = typeof body.model === 'string' && body.model.trim() ? body.model.trim().slice(0, 80) : 'gemini-3.6-flash';
  const prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, 4000) : '';
  const sys = typeof body.system === 'string' && body.system.trim() ? body.system.slice(0, 800) : '';
  if (!prompt.trim()) return res.status(400).json({ ok: false, error: 'empty-prompt' });

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(key);
  const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
  if (sys) payload.system_instruction = { parts: [{ text: sys }] };
  const RETRYABLE = /high demand|try again later|temporarily|429|500|502|503|overloaded|unavailable/i;
  const attempts = [0, 900, 2200]; // backoff between retries (ms)
  for (let i = 0; i < attempts.length; i++) {
    if (i > 0) await new Promise(r2 => setTimeout(r2, attempts[i]));
    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(25000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      if (e && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
        // timeout: retry once, then surface
        if (i < attempts.length - 1) continue;
        return res.status(504).json({ ok: false, error: 'upstream-timeout', hint: 'Google took too long — try again in a moment' });
      }
      return res.status(502).json({ ok: false, error: 'upstream-fetch-failed', detail: String((e && e.message) || e) });
    }
    const data = await r.json().catch(() => ({}));
    if (r.ok) {
      const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [])
        .map(p => p.text || '').join('').trim();
      if (!text) return res.status(502).json({ ok: false, error: 'empty-upstream' });
      return res.status(200).json({ ok: true, text });
    }
    const msg = (data && data.error && data.error.message) || ('upstream HTTP ' + r.status);
    if (RETRYABLE.test(msg + ' ' + r.status) && i < attempts.length - 1) continue; // transient -> retry
    return res.status(r.status === 429 ? 429 : r.status).json({ ok: false, error: 'upstream', detail: msg });
  }
  return res.status(502).json({ ok: false, error: 'upstream-exhausted', detail: 'retries exhausted' });
};