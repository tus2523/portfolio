import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

let devMemoryStore: any = null;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-portfolio-and-cloudinary',
      configureServer(server) {
        // 1. Cloudinary Delete API proxy
        server.middlewares.use('/api/delete-cloudinary', (req, res) => {
          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                const { public_id, cloud_name, api_key, api_secret } = JSON.parse(bodyStr || '{}');
                const cloud = (cloud_name || process.env.CLOUDINARY_CLOUD_NAME || 'aksy1d98').trim();
                const key = (api_key || process.env.CLOUDINARY_API_KEY || '').trim();
                const secret = (api_secret || process.env.CLOUDINARY_API_SECRET || '').trim();

                if (!public_id) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Missing public_id' }));
                }

                if (!key || !secret) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(
                    JSON.stringify({
                      error:
                        'Cloudinary API Key and API Secret are required to delete files from Cloudinary storage.',
                    })
                  );
                }

                const timestamp = Math.floor(Date.now() / 1000);
                const signaturePayload = `public_id=${public_id}&timestamp=${timestamp}${secret}`;
                const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

                const formData = new URLSearchParams();
                formData.append('public_id', public_id);
                formData.append('timestamp', String(timestamp));
                formData.append('api_key', key);
                formData.append('signature', signature);

                const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: formData.toString(),
                });

                const data = await cRes.json();
                res.statusCode = cRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });

        // 2. Portfolio Data API (Upstash Redis proxy / local fallback)
        server.middlewares.use('/api/portfolio-data', (req, res) => {
          const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').trim();
          const token = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();
          const KEY = 'tushar_portfolio_v3_data';

          if (req.method === 'GET') {
            if (url && token) {
              fetch(`${url}/get/${KEY}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((r) => r.json())
                .then((uData: any) => {
                  let parsed = null;
                  if (uData && uData.result) {
                    try {
                      parsed = typeof uData.result === 'string' ? JSON.parse(uData.result) : uData.result;
                    } catch {
                      parsed = uData.result;
                    }
                  }
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ configured: true, data: parsed }));
                })
                .catch(() => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ configured: true, data: devMemoryStore }));
                });
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ configured: false, data: devMemoryStore }));
            }
          } else if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                let parsedBody: any = null;
                try {
                  parsedBody = JSON.parse(bodyStr || '{}');
                } catch {
                  parsedBody = bodyStr;
                }
                devMemoryStore = parsedBody;

                if (url && token) {
                  const serialized = typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody);
                  await fetch(url, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(['SET', KEY, serialized]),
                  });
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      },
    },
  ],
});
