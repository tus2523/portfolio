export default async function handler(req, res) {
  // CORS Support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Configuration from Vercel Environment Variables or request
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();

  // If Upstash isn't configured in environment variables, return unconfigured status cleanly
  if (!url || !token) {
    if (req.method === 'GET') {
      return res.status(200).json({ configured: false, data: null });
    }
    return res.status(200).json({
      configured: false,
      message: 'Cloud database not configured. Saved to local storage.',
    });
  }

  const KEY = 'tushar_portfolio_v3_data';

  // 1. GET: Read current portfolio data from Upstash Redis
  if (req.method === 'GET') {
    try {
      const upstashRes = await fetch(`${url}/get/${KEY}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!upstashRes.ok) {
        return res.status(200).json({ configured: true, data: null });
      }

      const upstashData = await upstashRes.json();
      if (!upstashData || !upstashData.result) {
        return res.status(200).json({ configured: true, data: null });
      }

      let parsed = null;
      try {
        parsed = typeof upstashData.result === 'string' ? JSON.parse(upstashData.result) : upstashData.result;
      } catch {
        parsed = upstashData.result;
      }

      return res.status(200).json({ configured: true, data: parsed });
    } catch (err) {
      console.error('Error reading from Upstash Redis:', err);
      return res.status(200).json({ configured: true, data: null, error: err.message });
    }
  }

  // 2. POST: Write updated portfolio data to Upstash Redis
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = null;
        }
      }

      if (!body) {
        return res.status(400).json({ error: 'Missing portfolio data body' });
      }

      const serialized = typeof body === 'string' ? body : JSON.stringify(body);

      // Save into Upstash Redis via POST command array
      const upstashRes = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', KEY, serialized]),
      });

      if (!upstashRes.ok) {
        const errorText = await upstashRes.text().catch(() => '');
        return res.status(500).json({ error: `Upstash returned HTTP ${upstashRes.status}: ${errorText}` });
      }

      const resultData = await upstashRes.json().catch(() => ({}));
      return res.status(200).json({ success: true, result: resultData });
    } catch (err) {
      console.error('Error writing to Upstash Redis:', err);
      return res.status(500).json({ error: err.message || 'Internal server error while writing data' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
