/**
 * Cloudinary image upload utility helper for Tushar Maru Portfolio
 */
import { getData } from './store';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  // 1. Check Store / Firebase settings
  try {
    const storeSettings = getData().settings;
    if (storeSettings?.cloudinaryCloudName && storeSettings?.cloudinaryUploadPreset) {
      return {
        cloudName: storeSettings.cloudinaryCloudName.trim(),
        uploadPreset: storeSettings.cloudinaryUploadPreset.trim(),
      };
    }
  } catch {}

  // 2. Check localStorage
  if (typeof window !== 'undefined') {
    const savedCloud = localStorage.getItem('tushar_cloudinary_cloud_name');
    const savedPreset = localStorage.getItem('tushar_cloudinary_upload_preset');
    if (savedCloud && savedPreset) {
      return { cloudName: savedCloud.trim(), uploadPreset: savedPreset.trim() };
    }
  }

  // 3. Fallback to Environment Variables (Vite)
  return {
    cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim(),
    uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim(),
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tushar_cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('tushar_cloudinary_upload_preset', uploadPreset.trim());
  }
}

/**
 * Tests connection to Cloudinary with the provided cloud name and upload preset
 */
export async function testCloudinaryConnection(cloudName: string, uploadPreset: string): Promise<boolean> {
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

  return true;
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
