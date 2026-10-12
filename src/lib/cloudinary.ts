/**
 * Cloudinary image upload & deletion utility helper for Tushar Maru Portfolio
 */
import { getData } from './store';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
  apiSecret?: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  let cloudName = 'aksy1d98';
  let uploadPreset = 'tushar_portfolio';
  let apiKey = '';
  let apiSecret = '';

  // 1. Check Store settings
  try {
    const storeSettings = getData().settings;
    if (storeSettings) {
      if (storeSettings.cloudinaryCloudName) cloudName = storeSettings.cloudinaryCloudName.trim();
      if (storeSettings.cloudinaryUploadPreset) uploadPreset = storeSettings.cloudinaryUploadPreset.trim();
      if ((storeSettings as any).cloudinaryApiKey) apiKey = (storeSettings as any).cloudinaryApiKey.trim();
      if ((storeSettings as any).cloudinaryApiSecret) apiSecret = (storeSettings as any).cloudinaryApiSecret.trim();
    }
  } catch {}

  // 2. Check localStorage
  if (typeof window !== 'undefined') {
    const savedCloud = localStorage.getItem('tushar_cloudinary_cloud_name');
    const savedPreset = localStorage.getItem('tushar_cloudinary_upload_preset');
    const savedKey = localStorage.getItem('tushar_cloudinary_api_key');
    const savedSecret = localStorage.getItem('tushar_cloudinary_api_secret');
    if (savedCloud) cloudName = savedCloud.trim();
    if (savedPreset) uploadPreset = savedPreset.trim();
    if (savedKey) apiKey = savedKey.trim();
    if (savedSecret) apiSecret = savedSecret.trim();
  }

  // 3. Fallback to Environment Variables (Vite)
  if (!apiKey && import.meta.env.VITE_CLOUDINARY_API_KEY) {
    apiKey = String(import.meta.env.VITE_CLOUDINARY_API_KEY).trim();
  }
  if (!apiSecret && import.meta.env.VITE_CLOUDINARY_API_SECRET) {
    apiSecret = String(import.meta.env.VITE_CLOUDINARY_API_SECRET).trim();
  }

  return {
    cloudName,
    uploadPreset,
    apiKey,
    apiSecret,
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string, apiKey?: string, apiSecret?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tushar_cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('tushar_cloudinary_upload_preset', uploadPreset.trim());
    if (apiKey !== undefined) localStorage.setItem('tushar_cloudinary_api_key', apiKey.trim());
    if (apiSecret !== undefined) localStorage.setItem('tushar_cloudinary_api_secret', apiSecret.trim());
  }
}

/**
 * Extracts the public_id identifier from a Cloudinary image URL
 * e.g. "https://res.cloudinary.com/aksy1d98/image/upload/v1728512345/photos/xyz9876.jpg" -> "photos/xyz9876"
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary.com') || !url.includes('/image/upload/')) return null;

  try {
    const after = url.split('/image/upload/')[1]?.split('?')[0];
    if (!after) return null;

    const parts = after.split('/');
    let startIndex = 0;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Skip version tag like v1728512345
      if (/^v\d+$/.test(part)) {
        startIndex = i + 1;
        break;
      }
      // Skip transformation tags (e.g. w_800, c_fill, f_auto, etc.)
      if (part.includes(',') || /^[a-z]_[a-z0-9_]+/i.test(part)) {
        startIndex = i + 1;
        continue;
      }
    }

    const idParts = parts.slice(startIndex);
    if (idParts.length === 0) return null;

    // Strip extension from last segment
    idParts[idParts.length - 1] = idParts[idParts.length - 1].replace(/\.[^/.]+$/, '');
    return decodeURIComponent(idParts.join('/'));
  } catch (err) {
    console.warn('Failed to parse Cloudinary publicId:', err);
    return null;
  }
}

const DELETE_TOKEN_PREFIX = 'tushar_cld_del_tok_';

export function saveDeleteToken(url: string, token: string) {
  if (typeof window === 'undefined' || !url || !token) return;
  try {
    const publicId = extractCloudinaryPublicId(url) || url;
    sessionStorage.setItem(`${DELETE_TOKEN_PREFIX}${publicId}`, token);
  } catch {}
}

export function getDeleteToken(url: string): string | null {
  if (typeof window === 'undefined' || !url) return null;
  try {
    const publicId = extractCloudinaryPublicId(url) || url;
    return sessionStorage.getItem(`${DELETE_TOKEN_PREFIX}${publicId}`) || null;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary storage
 */
export async function deleteFromCloudinary(
  urlOrPublicId: string
): Promise<{ success: boolean; message: string; notCloudinary?: boolean }> {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') {
    return { success: false, message: 'Invalid URL or asset ID' };
  }

  const isUrl = urlOrPublicId.startsWith('http://') || urlOrPublicId.startsWith('https://');
  let publicId: string | null = urlOrPublicId;
  if (isUrl) {
    if (!urlOrPublicId.includes('cloudinary.com')) {
      return { success: true, message: 'External image (not stored on Cloudinary)', notCloudinary: true };
    }
    publicId = extractCloudinaryPublicId(urlOrPublicId);
  }

  if (!publicId) {
    return { success: false, message: 'Could not extract Cloudinary asset identifier' };
  }

  const config = getCloudinaryConfig();

  // Strategy 1: Check for session delete_token (unsigned instantaneous deletion)
  const token = getDeleteToken(urlOrPublicId);
  if (token) {
    try {
      const fd = new FormData();
      fd.append('token', token);
      const tokenRes = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/delete_by_token`, {
        method: 'POST',
        body: fd,
      });
      if (tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        if (data.result === 'ok') {
          return { success: true, message: 'Image deleted from Cloudinary storage' };
        }
      }
    } catch {
      // Continue to Strategy 2
    }
  }

  // Strategy 2: Call backend /api/delete-cloudinary
  try {
    const res = await fetch('/api/delete-cloudinary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_id: publicId,
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        api_secret: config.apiSecret,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.result === 'ok' || data.result === 'not found')) {
      return {
        success: true,
        message: data.result === 'ok'
          ? 'Image permanently deleted from Cloudinary storage'
          : 'Asset not found on Cloudinary (may have already been deleted)',
      };
    }

    if (data.error) {
      return { success: false, message: data.error };
    }
    return { success: false, message: `Cloudinary returned status ${res.status}` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to Cloudinary deletion service' };
  }
}

/**
 * Tests connection to Cloudinary with the provided cloud name and upload preset
 */
export async function testCloudinaryConnection(
  cloudName: string,
  uploadPreset: string,
  apiKey?: string,
  apiSecret?: string
): Promise<{ uploadOk: boolean; apiCredentialsOk?: boolean; message: string }> {
  const cName = cloudName.trim();
  const uPreset = uploadPreset.trim();

  if (!cName || !uPreset) {
    throw new Error('Please enter both Cloud Name and Upload Preset.');
  }

  // Create a 1x1 test image blob
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#01472e';
    ctx.fillRect(0, 0, 1, 1);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8);
  });

  if (!blob) throw new Error('Failed to generate test image blob');

  const formData = new FormData();
  formData.append('file', blob, 'test_ping.jpg');
  formData.append('upload_preset', uPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const msg = errorJson.error?.message || `Cloudinary returned HTTP status ${res.status}`;
    throw new Error(msg);
  }

  const uploadResult = await res.json().catch(() => ({}));
  const uploadedUrl = uploadResult.secure_url;
  const publicId = uploadResult.public_id;

  let apiCredentialsOk = false;
  // If API Key & Secret were provided, test deleting the test image via /api/delete-cloudinary!
  if (apiKey && apiSecret && publicId) {
    try {
      const deleteRes = await fetch('/api/delete-cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          cloud_name: cName,
          api_key: apiKey.trim(),
          api_secret: apiSecret.trim(),
        }),
      });
      const deleteData = await deleteRes.json().catch(() => ({}));
      if (deleteRes.ok && deleteData.result === 'ok') {
        apiCredentialsOk = true;
      }
    } catch {}
  } else if (uploadedUrl && uploadResult.delete_token) {
    // Clean up test image via token if possible
    try {
      const fd = new FormData();
      fd.append('token', uploadResult.delete_token);
      await fetch(`https://api.cloudinary.com/v1_1/${cName}/delete_by_token`, { method: 'POST', body: fd });
    } catch {}
  }

  return {
    uploadOk: true,
    apiCredentialsOk,
    message: apiCredentialsOk
      ? 'Upload Pipeline and Cloudinary Auto-Deletion are both verified and fully active!'
      : 'Upload Pipeline is verified! (Add API Key & Secret if you want automatic deletion on removal)',
  };
}

/**
 * Uploads a file to Cloudinary using an Unsigned Upload Preset
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const config = getCloudinaryConfig();
  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Cloudinary is not configured. Please add your Cloud Name and Upload Preset in Admin Settings.');
  }

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            if (res.delete_token) {
              saveDeleteToken(res.secure_url, res.delete_token);
            }
            resolve(res.secure_url);
          } else {
            reject(new Error('No secure_url returned from Cloudinary response'));
          }
        } catch (e: any) {
          reject(e);
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Cloudinary upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error uploading to Cloudinary'));
    xhr.send(formData);
  });
}
