import crypto from 'crypto';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { public_id, cloud_name, api_key, api_secret } = body || {};

    const cloud = (cloud_name || process.env.CLOUDINARY_CLOUD_NAME || 'aksy1d98').trim();
    const key = (api_key || process.env.CLOUDINARY_API_KEY || '').trim();
    const secret = (api_secret || process.env.CLOUDINARY_API_SECRET || '').trim();

    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id of the asset to delete.' });
    }

    if (!key || !secret) {
      return res.status(400).json({
        error: 'Cloudinary API Key and API Secret are required to execute deletion. Please add them in Admin Settings -> Cloudinary Pipeline.',
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signature convention: parameters sorted alphabetically + api_secret
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
    return res.status(cRes.status).json(data);
  } catch (err) {
    console.error('Cloudinary destroy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during deletion' });
  }
}
