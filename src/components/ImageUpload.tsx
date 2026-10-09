import React, { useState, useRef } from "react";
import { Upload, Trash2, Loader2, X, Link as LinkIcon } from "lucide-react";
import { getCloudinaryConfig } from "../lib/cloudinary";

const MAX_SIDE = 1920;
const JPEG_QUALITY = 0.92;

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folderPath?: string;
  label?: string;
}

const toJpeg = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") {
      return resolve(file);
    }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_SIDE || height > MAX_SIDE) {
        if (width > height) {
          height = Math.round((height / width) * MAX_SIDE);
          width = MAX_SIDE;
        } else {
          width = Math.round((width / height) * MAX_SIDE);
          height = MAX_SIDE;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Blob failed"));
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Image load error"));
    img.src = URL.createObjectURL(file);
  });

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
  const cloudName = config.cloudName || "digkpl4re";
  const uploadPreset = config.uploadPreset || "axuqgwb1";

  const toUpload = file.type === "image/svg+xml" ? file : await toJpeg(file);
  const fd = new FormData();
  fd.append("file", toUpload);
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
      // If Cloudinary fails, fallback to local Base64
      try {
        const base64 = await fileToBase64(file);
        resolve(base64);
      } catch (err) {
        reject(new Error(`Upload failed and fallback failed`));
      }
    };
    xhr.onerror = async () => {
      try {
        const base64 = await fileToBase64(file);
        resolve(base64);
      } catch (err) {
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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }
    const ok = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
    if (!ok.includes(file.type)) {
      setError("Only JPG, PNG, WebP, AVIF, GIF, SVG allowed.");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadToCloudinary(file, folderPath, setProgress);
      onChange(url);
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-medium">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-[#7621B0] hover:underline flex items-center gap-1"
        >
          <LinkIcon size={10} /> {showUrlInput ? "Hide Link Input" : "Paste Direct Image URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-[#0C0C0C] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-[#D7E2EA]"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSaveCustomUrl}
            className="bg-[#7621B0] text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      )}

      {value ? (
        <div className="relative bg-[#0C0C0C] border border-[#222] rounded-xl overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-40 object-contain bg-[#0C0C0C] p-2"
            onError={(e) => (e.currentTarget.style.opacity = "0.3")}
          />
          <div className="flex items-center justify-between px-3 py-2 bg-[#111] border-t border-[#222]">
            <span className="text-[10px] text-green-500 font-semibold">✔ Image Set</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-[#7621B0]/20 text-[#a855f7] border border-[#7621B0]/30 rounded-lg hover:bg-[#7621B0]/40 transition disabled:opacity-50"
              >
                <Upload size={11} /> Change
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={handleDelete}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-red-950/30 text-red-400 border border-red-900/40 rounded-lg hover:bg-red-950/60 transition disabled:opacity-50"
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
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#222] hover:border-[#7621B0]/60 bg-[#0C0C0C]/50 rounded-xl p-6 cursor-pointer transition text-center min-h-[110px]"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <Loader2 className="animate-spin text-[#7621B0]" size={22} />
              <span className="text-xs text-[#D7E2EA]/60">Uploading… {progress}%</span>
              <div className="w-40 bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#7621B0] h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload className="text-[#D7E2EA]/30" size={22} />
              <span className="text-xs text-[#D7E2EA]/60">
                Drag &amp; drop or <span className="text-[#a855f7] font-semibold">browse photo</span>
              </span>
              <span className="text-[10px] text-[#D7E2EA]/30">Supports JPG, PNG, WebP &amp; Cloudinary (max 10 MB)</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">
          <X size={12} /> {error}
        </div>
      )}
    </div>
  );
};
