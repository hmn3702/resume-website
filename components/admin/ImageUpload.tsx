"use client";

import { useState, useRef, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Props {
  /** Storage folder: "avatars" | "projects" */
  folder: "avatars" | "projects";
  /** Current URL (shown as preview) */
  currentUrl?: string | null;
  /** Called with the new public URL after upload */
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ folder, currentUrl, onUpload, label = "Image" }: Props) {
  const supabase = createSupabaseBrowserClient();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setProgress(0);

      // Validate type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }

      // Validate size (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File must be under 5 MB.");
        return;
      }

      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}.${ext}`;

      setProgress(30);

      const { data, error: uploadError } = await supabase.storage
        .from("resume-assets")
        .upload(fileName, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        setProgress(null);
        return;
      }

      setProgress(80);

      const { data: urlData } = supabase.storage
        .from("resume-assets")
        .getPublicUrl(data.path);

      setProgress(100);
      onUpload(urlData.publicUrl);

      // Reset progress after a beat
      setTimeout(() => setProgress(null), 1000);
    },
    [folder, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors ${
          dragging
            ? "border-teal-400 bg-teal-50"
            : "border-slate-300 hover:border-teal-400 hover:bg-teal-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />

        {/* Preview */}
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Current"
            className="w-20 h-20 object-cover rounded-xl border border-slate-200"
          />
        ) : (
          <svg
            className="w-8 h-8 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}

        <p className="text-xs text-slate-500 text-center">
          {currentUrl ? "Click or drag to replace" : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, WebP · max 5 MB</p>
      </div>

      {/* Progress bar */}
      {progress !== null && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
