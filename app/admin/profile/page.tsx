"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Profile, Database } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type ProfileInsert = Database["public"]["Tables"]["profile"]["Insert"];

const FIELDS: { key: keyof Profile; label: string; type?: string; multiline?: boolean }[] = [
  { key: "name",         label: "Full name" },
  { key: "title",        label: "Title / headline" },
  { key: "bio",          label: "Bio",           multiline: true },
  { key: "email",        label: "Email",          type: "email" },
  { key: "location",     label: "Location" },
  { key: "linkedin_url", label: "LinkedIn URL",   type: "url" },
  { key: "github_url",   label: "GitHub URL",     type: "url" },
  // avatar_url is handled by the ImageUpload component above
];

export default function AdminProfilePage() {
  const supabase = createSupabaseBrowserClient();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setId(data.id);
        setForm(data);
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: keyof Profile, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = id ? { ...form, id } : form;
    const { data: saved, error } = await supabase
      .from("profile")
      .upsert(payload as ProfileInsert)
      .select()
      .single();

    if (error) {
      toast.error(`Save failed: ${error.message}`);
    } else if (!saved) {
      toast.error("Save blocked — RLS policy rejected the write. Check you are signed in.");
    } else {
      toast.success("Profile saved!");
      setId(saved.id);
      setForm(saved);
    }
    setSaving(false);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Toaster position="top-right" />

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
        <p className="text-slate-500 text-sm mt-1">Your public profile information.</p>
      </div>

      {/* Avatar upload */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <ImageUpload
          folder="avatars"
          currentUrl={form.avatar_url}
          label="Avatar photo"
          onUpload={(url) => setForm((p) => ({ ...p, avatar_url: url }))}
        />
        {form.avatar_url && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700">{form.name}</p>
            <p className="text-xs text-slate-400">{form.title}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        {FIELDS.map(({ key, label, type, multiline }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {label}
            </label>
            {multiline ? (
              <textarea
                rows={4}
                value={(form[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                type={type ?? "text"}
                value={(form[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        ))}

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
