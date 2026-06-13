import React, { useState, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { uploadImage, deleteImageByUrl } from "../lib/storage";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folderPath: string; // e.g., 'profile' or 'thumbnails'
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folderPath,
  label = "Upload Image"
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const processUpload = async (file: File) => {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // 1. If we have an existing image uploaded to firebase, delete it first
      if (value && value.includes("firebasestorage.googleapis.com")) {
        try {
          await deleteImageByUrl(value);
        } catch (err) {
          console.warn("Failed to delete old image, continuing upload:", err);
        }
      }

      // 2. Upload new image
      // Create a unique filename: timestamp_filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storagePath = `${folderPath}/${Date.now()}_${sanitizedName}`;
      const downloadUrl = await uploadImage(file, storagePath, (p) => {
        setProgress(Math.round(p));
      });

      onChange(downloadUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    if (!confirm("Are you sure you want to delete this image?")) return;

    setUploading(true);
    setError(null);
    try {
      if (value.includes("firebasestorage.googleapis.com")) {
        await deleteImageByUrl(value);
      }
      onChange("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error("Delete error:", err);
      setError("Failed to delete image from storage.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-medium">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-4 bg-[#0C0C0C] border border-[#222] p-3 rounded-lg">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#222] bg-zinc-900 shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#D7E2EA]/60 truncate">{value}</p>
            <p className="text-[10px] text-green-500 font-medium mt-0.5">Uploaded successfully</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading}
            className="p-2 bg-red-950/20 text-red-400 border border-red-900/40 rounded-lg hover:bg-red-950/40 transition shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#222] hover:border-[#7621B0]/50 bg-[#0C0C0C]/50 rounded-lg p-6 cursor-pointer transition text-center min-h-[120px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#7621B0]" size={24} />
              <span className="text-xs text-[#D7E2EA]/60">Uploading... {progress}%</span>
              <div className="w-32 bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#7621B0] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-[#D7E2EA]/40" size={24} />
              <span className="text-xs text-[#D7E2EA]/60">
                Drag & drop image here, or <span className="text-[#7621B0] font-medium">browse</span>
              </span>
              <span className="text-[10px] text-[#D7E2EA]/30">
                Supports JPG, PNG, WebP, GIF (Max 5MB)
              </span>
            </div>
          )}
        </div>
      )}

      {error && <span className="text-xs text-red-500 font-medium mt-1">{error}</span>}
    </div>
  );
};
