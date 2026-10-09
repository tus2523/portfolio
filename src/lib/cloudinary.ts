/**
 * Cloudinary image upload utility helper
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  if (typeof window !== 'undefined') {
    const savedCloud = localStorage.getItem('tushar_cloudinary_cloud_name');
    const savedPreset = localStorage.getItem('tushar_cloudinary_upload_preset');
    if (savedCloud && savedPreset) {
      return { cloudName: savedCloud, uploadPreset: savedPreset };
    }
  }

  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tushar_cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('tushar_cloudinary_upload_preset', uploadPreset.trim());
  }
}

/**
 * Uploads a file to Cloudinary using Unsigned Preset
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const config = getCloudinaryConfig();
  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Cloudinary Cloud Name or Upload Preset is not configured. Please set them in Admin Settings or env variables.');
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
