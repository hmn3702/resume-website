"use client";

import { useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Props {
  /** Current public URL of the CV, if any */
  currentUrl?: string | null;
  /** Called with the new public URL after upload, or null when removed */
  onChange: (url: string | null) => void;
}

const MAX_MB = 10;

const BUCKET = "resume-assets";
const CV_FOLDER = "cv";

/** Storage path ("cv/123.pdf") of a public URL in this bucket, or null if it isn't one. */
function cvPathFromUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

/**
 * Delete every file in cv/ except the CV the profile currently uses.
 * Call ONLY after the profile save succeeded, so the live CV is never removed.
 * Returns the number of files deleted.
 */
export async function pruneOldCvs(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  keepUrl: string | null | undefined
): Promise<number> {
  const keepPath = keepUrl ? cvPathFromUrl(keepUrl) : null;
  // Safety: the saved URL points into our bucket but couldn't be parsed — don't touch anything.
  if (keepUrl && keepUrl.includes(`/${BUCKET}/`) && !keepPath) return 0;

  const { data, error } = await supabase.storage.from(BUCKET).list(CV_FOLDER, { limit: 1000 });
  if (error || !data) return 0;

  const stale = data
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => `${CV_FOLDER}/${f.name}`)
    .filter((path) => path !== keepPath);
  if (!stale.length) return 0;

  const { error: removeError } = await supabase.storage.from(BUCKET).remove(stale);
  return removeError ? 0 : stale.length;
}

export default function CvUpload({ currentUrl, onChange }: Props) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError(null);

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    const path = `${CV_FOLDER}/${Date.now()}.pdf`;
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: "application/pdf" });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    onChange(urlData.publicUrl);
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">CV / Resume (PDF)</label>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
      />

      <div className="flex flex-wrap items-center gap-3">
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:border-teal-400 transition-colors"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View current CV
          </a>
        ) : (
          <p className="text-sm text-slate-400">No CV uploaded — the &quot;Download CV&quot; buttons are hidden.</p>
        )}

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
        >
          {uploading ? "Uploading…" : currentUrl ? "Replace PDF" : "Upload PDF"}
        </button>

        {currentUrl && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">PDF · max {MAX_MB} MB · click &quot;Save changes&quot; below to publish. Older CV files are deleted after saving.</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
