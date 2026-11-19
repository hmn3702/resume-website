"use client";

import { useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Props {
  /** Current gallery URLs, in display order */
  value: string[];
  onChange: (urls: string[]) => void;
}

type Item = { id: string; name: string; status: "uploading" | "done" | "error"; error?: string };

const BUCKET = "resume-assets";
const MAX_MB = 5;
const CONCURRENCY = 3;

export default function GalleryUpload({ value, onChange }: Props) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Always append to the latest list, even if several batches overlap
  const valueRef = useRef(value);
  valueRef.current = value;

  const update = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const uploadOne = async (file: File, id: string): Promise<string | null> => {
    if (!file.type.startsWith("image/")) { update(id, { status: "error", error: "Not an image" }); return null; }
    if (file.size > MAX_MB * 1024 * 1024) { update(id, { status: "error", error: `Over ${MAX_MB} MB` }); return null; }

    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    // Unique name: several files can be uploaded in the same millisecond
    const path = `projects/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) { update(id, { status: "error", error: error.message }); return null; }

    update(id, { status: "done" });
    return supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl;
  };

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;

    const batch = files.map((f) => ({ file: f, id: crypto.randomUUID() }));
    setItems((prev) => [...prev.filter((it) => it.status === "uploading"), ...batch.map(({ file, id }) => ({ id, name: file.name, status: "uploading" as const }))]);

    // Upload a few at a time, keep the original selection order in the gallery
    const urls: (string | null)[] = new Array(batch.length).fill(null);
    let next = 0;
    const worker = async () => {
      while (next < batch.length) {
        const i = next++;
        urls[i] = await uploadOne(batch[i].file, batch[i].id);
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, batch.length) }, worker));

    const added = urls.filter((u): u is string => !!u);
    if (added.length) onChange([...valueRef.current, ...added]);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const uploading = items.some((it) => it.status === "uploading");

  return (
    <div className="space-y-3">
      <p className="block text-sm font-medium text-slate-700">Gallery (dashboard screenshots)</p>

      {/* Current gallery */}
      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <li key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail */}
              <img src={url} alt={`Gallery image ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-slate-200" />
              <span className="absolute bottom-1 left-1 px-1.5 rounded bg-black/60 text-white text-[10px]">{i + 1}</span>
              <div className="absolute top-1 right-1 flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} earlier`}
                  className="w-6 h-6 rounded-full bg-black/60 text-white text-xs leading-none hover:bg-black/80 disabled:opacity-30">‹</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move image ${i + 1} later`}
                  className="w-6 h-6 rounded-full bg-black/60 text-white text-xs leading-none hover:bg-black/80 disabled:opacity-30">›</button>
                <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} aria-label={`Remove image ${i + 1}`}
                  className="w-6 h-6 rounded-full bg-black/60 text-white text-xs leading-none hover:bg-red-500">×</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
          dragging ? "border-teal-400 bg-teal-50" : "border-slate-300 hover:border-teal-400 hover:bg-teal-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
        <p className="text-xs text-slate-600 text-center">
          {uploading ? "Uploading…" : "Drag & drop or click to add screenshots - select several at once"}
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, WebP · max {MAX_MB} MB each</p>
      </div>

      {/* Per-file status */}
      {items.length > 0 && (
        <ul className="space-y-1" aria-live="polite">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-slate-600">{it.name}</span>
              <span className={`shrink-0 ${it.status === "error" ? "text-red-500" : it.status === "done" ? "text-teal-600" : "text-slate-400"}`}>
                {it.status === "uploading" ? "Uploading…" : it.status === "done" ? "Added ✓" : `Failed: ${it.error}`}
              </span>
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <p className="text-xs text-slate-400">Images appear on the case-study page in this order. Click &quot;Save case study&quot; to save.</p>
      )}
    </div>
  );
}
