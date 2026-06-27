"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Certification } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";
import { AdminCardGridSkeleton } from "@/components/ui/Skeleton";

type CertForm = Omit<Certification, "id" | "created_at">;

const EMPTY: CertForm = {
  name: "",
  issuer: "",
  year: new Date().getFullYear(),
  credential_url: null,
  image_url: null,
};

export default function AdminCertificationsPage() {
  const supabase = createSupabaseBrowserClient();
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CertForm>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("certifications")
      .select("*")
      .order("year", { ascending: false });
    setItems((data ?? []) as Certification[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setPanelOpen(true); };
  const openEdit = (item: Certification) => {
    setEditId(item.id);
    setForm({ name: item.name, issuer: item.issuer, year: item.year, credential_url: item.credential_url, image_url: item.image_url });
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setEditId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, credential_url: form.credential_url || null, image_url: form.image_url || null };
    let error;
    if (editId) {

      ({ error } = await supabase.from("certifications").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("certifications").insert(payload));
    }
    if (error) toast.error(error.message);
    else { toast.success(editId ? "Updated!" : "Added!"); closePanel(); load(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("certifications").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); load(); }
    setDeleteId(null);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
          <p className="text-slate-500 text-sm mt-1">{items.length} certifications</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add new
        </button>
      </div>

      {/* Card grid */}
      {loading ? (
        <AdminCardGridSkeleton count={6} cols={3} />
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No certifications yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-teal-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm leading-snug">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.issuer} · {item.year}</p>
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.issuer} className="w-8 h-8 object-contain rounded shrink-0" />
                )}
              </div>

              {item.credential_url && (
                <a
                  href={item.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:underline"
                >
                  View credential →
                </a>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 text-xs text-slate-600 hover:text-teal-600 font-medium py-1 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="flex-1 text-xs text-slate-400 hover:text-red-500 font-medium py-1 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closePanel} />
          <aside className="w-[480px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">
                {editId ? "Edit certification" : "Add certification"}
              </h3>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issuer <span className="text-red-400">*</span>
                  </label>
                  <input required value={form.issuer} onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={form.year}
                    onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credential URL</label>
                <input type="url" value={form.credential_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, credential_url: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="url" value={form.image_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} className={inputClass} />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="mt-2 w-12 h-12 object-contain rounded border border-slate-200" />
                )}
              </div>
              <div className="pt-2 flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                  {saving ? "Saving…" : editId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={closePanel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-900">Delete certification?</h3>
            <p className="text-sm text-slate-500">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
