"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Education } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";

type EduForm = Omit<Education, "id" | "created_at">;

const EMPTY: EduForm = {
  institution: "",
  degree: "",
  field: "",
  start_year: new Date().getFullYear() - 2,
  end_year: null,
  description: null,
};

export default function AdminEducationPage() {
  const supabase = createSupabaseBrowserClient();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<EduForm>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("education").select("*").order("start_year", { ascending: false });
    setItems((data ?? []) as Education[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setPanelOpen(true); };
  const openEdit = (item: Education) => {
    setEditId(item.id);
    setForm({ institution: item.institution, degree: item.degree, field: item.field, start_year: item.start_year, end_year: item.end_year, description: item.description });
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setEditId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let error;
    if (editId) {

      ({ error } = await supabase.from("education").update(form).eq("id", editId));
    } else {
      ({ error } = await supabase.from("education").insert(form));
    }
    if (error) toast.error(error.message);
    else { toast.success(editId ? "Updated!" : "Added!"); closePanel(); load(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("education").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); load(); }
    setDeleteId(null);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Education</h2>
          <p className="text-slate-500 text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add new
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No education entries yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Institution</th>
                <th className="px-5 py-3">Degree</th>
                <th className="px-5 py-3">Years</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{item.institution}</td>
                  <td className="px-5 py-3.5 text-slate-600">{item.degree} in {item.field}</td>
                  <td className="px-5 py-3.5 text-slate-500">{item.start_year} — {item.end_year ?? "Present"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="text-xs text-slate-600 hover:text-teal-600 font-medium transition-colors">Edit</button>
                      <button onClick={() => setDeleteId(item.id)} className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closePanel} />
          <aside className="w-[480px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{editId ? "Edit education" : "Add education"}</h3>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 px-6 py-5 space-y-4">
              {[
                { key: "institution", label: "Institution", required: true },
                { key: "degree",      label: "Degree",      required: true },
                { key: "field",       label: "Field",       required: true },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label} {required && <span className="text-red-400">*</span>}</label>
                  <input
                    required={required}
                    value={(form as Record<string, unknown>)[key] as string ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start year <span className="text-red-400">*</span></label>
                  <input type="number" required value={form.start_year} onChange={(e) => setForm((p) => ({ ...p, start_year: Number(e.target.value) }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End year</label>
                  <input type="number" value={form.end_year ?? ""} onChange={(e) => setForm((p) => ({ ...p, end_year: e.target.value ? Number(e.target.value) : null }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value || null }))} className={`${inputClass} resize-none`} />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                  {saving ? "Saving…" : editId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={closePanel} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-900">Delete education entry?</h3>
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
