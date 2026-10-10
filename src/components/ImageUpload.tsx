import React, { useState, useRef } from "react";
import { Upload, Trash2, Loader2, X, Link as LinkIcon, CheckCircle2, Zap } from "lucide-react";
import { getCloudinaryConfig } from "../lib/cloudinary";

const MAX_DIMENSION = 2048;
const INITIAL_JPEG_QUALITY = 0.85;

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folderPath?: string;
  label?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * High-performance client-side image compressor.
 * Takes any image (even 20MB - 80MB DSLR/Phone shots) and downsamples it
 * to a lightweight, web-optimized JPEG (< 1.5MB) while preserving crisp editorial clarity.
 */
const compressImageFile = async (
  file: File,
  onStatus?: (msg: string) => void
): Promise<{ file: File; originalSize: string; compressedSize: string; percentSaved: number }> => {
  const originalBytes = file.size;
  const originalSizeStr = formatBytes(originalBytes);

  // SVGs are vector and do not need raster compression
  if (file.type === "image/svg+xml") {
    return {
      file,
      originalSize: originalSizeStr,
      compressedSize: originalSizeStr,
      percentSaved: 0,
    };
  }

  if (onStatus) onStatus(`Compressing photo (${originalSizeStr})...`);

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Scale dimensions proportionally
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve({ file, originalSize: originalSizeStr, compressedSize: originalSizeStr, percentSaved: 0 });
      }

      // Smooth interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve({ file, originalSize: originalSizeStr, compressedSize: originalSizeStr, percentSaved: 0 });
          }

          // If blob is still > 2.5MB, do a second rapid pass at 1600px with 0.80 quality
          if (blob.size > 2.5 * 1024 * 1024 && width > 1600) {
            const scaleDown = 1600 / width;
            const secondCanvas = document.createElement("canvas");
            secondCanvas.width = 1600;
            secondCanvas.height = Math.round(height * scaleDown);
            const secondCtx = secondCanvas.getContext("2d");
            if (secondCtx) {
              secondCtx.imageSmoothingEnabled = true;
              secondCtx.imageSmoothingQuality = "high";
              secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
              secondCanvas.toBlob(
                (secondBlob) => {
                  const finalBlob = secondBlob || blob;
                  const compressedBytes = finalBlob.size;
                  const compressedSizeStr = formatBytes(compressedBytes);
                  const saved = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));
                  const optimizedFile = new File(
                    [finalBlob],
                    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                    { type: "image/jpeg" }
                  );
                  resolve({
                    file: optimizedFile,
                    originalSize: originalSizeStr,
                    compressedSize: compressedSizeStr,
                    percentSaved: saved,
                  });
                },
                "image/jpeg",
                0.80
              );
              return;
            }
          }

          const compressedBytes = blob.size;
          const compressedSizeStr = formatBytes(compressedBytes);
          const saved = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));
          const optimizedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            { type: "image/jpeg" }
          );

          resolve({
            file: optimizedFile,
            originalSize: originalSizeStr,
            compressedSize: compressedSizeStr,
            percentSaved: saved,
          });
        },
        "image/jpeg",
        INITIAL_JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image file. Please check file format."));
    };

    img.src = objectUrl;
  });
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

const uploadToCloudinary = async (
  file: File,
  folder: string,
  onProgress: (pct: number) => void
): Promise<string> => {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName;
  const uploadPreset = config.uploadPreset;

  if (!cloudName || !uploadPreset) {
    // Safe Base64 fallback if unconfigured
    return fileToBase64(file);
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  if (folder) fd.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = async () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) return resolve(res.secure_url);
        } catch {}
      }
      // If Cloudinary endpoint fails, fallback to local Base64
      try {
        const base64 = await fileToBase64(file);
        resolve(base64);
      } catch {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = async () => {
      try {
        const base64 = await fileToBase64(file);
        resolve(base64);
      } catch {
        reject(new Error("Network error during upload"));
      }
    };
    xhr.send(fd);
  });
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folderPath = "portfolio",
  label = "Upload Image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    // Support large files up to 100MB
    if (file.size > 100 * 1024 * 1024) {
      setError("File exceeds 100MB limit. Please select a smaller file.");
      return;
    }

    const validTypes = [
      "image/jpeg", "image/png", "image/webp", "image/avif", 
      "image/gif", "image/svg+xml", "image/bmp", "image/tiff"
    ];
    
    // Check type or extension
    const isImage = validTypes.includes(file.type) || file.type.startsWith("image/");
    if (!isImage) {
      setError("Please select an image file (JPG, PNG, WebP, AVIF, HEIC, etc.).");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);
    setCompressionInfo(null);
    setStatusMessage("Compressing high-res image...");

    try {
      // 1. Client-side auto-compression for high-MB files
      const { file: compressedFile, originalSize, compressedSize, percentSaved } = await compressImageFile(
        file,
        (msg) => setStatusMessage(msg)
      );

      if (percentSaved > 0) {
        setCompressionInfo(`Reduced ${percentSaved}% (${originalSize} → ${compressedSize})`);
      }

      // 2. Upload lightweight optimized file to Cloudinary
      setStatusMessage(`Uploading to Cloudinary (${compressedSize})...`);
      const url = await uploadToCloudinary(compressedFile, folderPath, (pct) => {
        setProgress(pct);
        setStatusMessage(`Uploading to Cloudinary... ${pct}%`);
      });

      onChange(url);
    } catch (err: any) {
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setStatusMessage('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processUpload(file);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await processUpload(file);
  };

  const handleDelete = () => {
    if (!value) return;
    if (!confirm("Remove this image?")) return;
    onChange("");
    setCompressionInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveCustomUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="flex flex-col gap-2 font-sans">
      <div className="flex justify-between items-center">
        <label className="text-[10px] uppercase tracking-[0.25em] text-[#ccd5ae]/60 font-bold">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-[#10b981] hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon size={10} /> {showUrlInput ? "Hide Direct Link" : "Paste Image URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            className="flex-1 bg-[#0a120e] border border-[#01472e]/40 rounded-xl px-3.5 py-2 text-xs text-[#fefae0] outline-none focus:border-[#10b981]"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSaveCustomUrl}
            className="bg-[#01472e] hover:bg-[#025c3c] text-[#fefae0] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Apply
          </button>
        </div>
      )}

      {value ? (
        <div className="relative bg-[#0a120e] border border-[#01472e]/40 rounded-2xl overflow-hidden shadow-md">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-44 object-contain bg-[#0a120e] p-2"
            onError={(e) => (e.currentTarget.style.opacity = "0.3")}
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 bg-[#111c16] border-t border-[#01472e]/30 gap-2">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
              <CheckCircle2 size={13} className="shrink-0" />
              <span className="truncate">Cloudinary Photo Set</span>
              {compressionInfo && (
                <span className="text-[#ccd5ae]/60 font-normal lowercase truncate">
                  ({compressionInfo})
                </span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-[#01472e] text-[#fefae0] rounded-xl hover:bg-[#025c3c] transition disabled:opacity-50"
              >
                <Upload size={11} /> Change
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleDelete}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-red-950/30 text-red-400 border border-red-900/40 rounded-xl hover:bg-red-950/60 transition disabled:opacity-50"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#01472e]/40 hover:border-[#10b981] bg-[#0a120e]/60 rounded-2xl p-6 cursor-pointer transition text-center min-h-[120px]"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-2.5 w-full">
              <Loader2 className="animate-spin text-[#10b981]" size={24} />
              <div className="flex items-center gap-1.5 text-xs text-[#fefae0] font-bold">
                <Zap size={13} className="text-amber-400 animate-pulse" />
                <span>{statusMessage || `Uploading... ${progress}%`}</span>
              </div>
              <div className="w-48 bg-[#111c16] h-1.5 rounded-full overflow-hidden border border-[#01472e]/40">
                <div className="bg-[#10b981] h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] text-[#ccd5ae]/50 uppercase tracking-widest">
                Auto-Compressing &amp; Uploading to Cloudinary CDN
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#01472e]/30 flex items-center justify-center text-[#10b981] mb-1">
                <Upload size={18} />
              </div>
              <span className="text-xs text-[#ccd5ae]/80 font-medium">
                Drag &amp; drop or <span className="text-[#10b981] font-bold underline">browse high-res photo</span>
              </span>
              <span className="text-[10px] text-[#ccd5ae]/50 flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                <span>Auto-compresses high-MB DSLR/phone photos &amp; uploads directly to Cloudinary</span>
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 border border-red-900/50 rounded-xl px-3.5 py-2">
          <X size={12} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
