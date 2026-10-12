import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-delete-cloudinary',
      configureServer(server) {
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
      },
    },
  ],
});
