"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";

const EMPTY: Omit<Experience, "id" | "created_at"> = {
  role: "",
  company: "",
  location: "",
  start_date: "",
  end_date: null,
  is_current: false,
  description: "",
  order: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("order", { ascending: true });
    setItems((data ?? []) as Experience[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY });
    setPanelOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditId(item.id);
    setForm({
      role: item.role,
      company: item.company,
      location: item.location ?? "",
      start_date: item.start_date,
      end_date: item.end_date ?? null,
      is_current: item.is_current,
      description: item.description ?? "",
      order: item.order,
    });
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setEditId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      location: form.location || null,
      end_date: form.is_current ? null : (form.end_date || null),
    };

    let error;
    if (editId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await supabase.from("experience").update(payload as any).eq("id", editId));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await supabase.from("experience").insert(payload as any));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editId ? "Updated!" : "Added!");
      closePanel();
      load();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("experience").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); }
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
          <h2 className="text-2xl font-bold text-slate-900">Experience</h2>
          <p className="text-slate-500 text-sm mt-1">{items.length} entries</p>
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No experience entries yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{item.role}</td>
                  <td className="px-5 py-3.5 text-slate-600">{item.company}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                    {item.start_date} — {item.is_current ? "Present" : (item.end_date ?? "?")}
                  </td>
                  <td className="px-5 py-3.5">
                    {item.is_current && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-medium">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-xs text-slate-600 hover:text-teal-600 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-in panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={closePanel}
          />
          {/* Panel */}
          <aside className="w-[480px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">
                {editId ? "Edit experience" : "Add experience"}
              </h3>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 px-6 py-5 space-y-4">
              {[
                { key: "role",     label: "Role",     required: true  },
                { key: "company",  label: "Company",  required: true  },
                { key: "location", label: "Location", required: false },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    required={required}
                    value={(form as Record<string, unknown>)[key] as string ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2023-01"
                    value={form.start_date}
                    onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End date</label>
                  <input
                    type="text"
                    placeholder="2024-06"
                    disabled={form.is_current}
                    value={form.end_date ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value || null }))}
                    className={`${inputClass} disabled:opacity-40`}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(e) => setForm((p) => ({ ...p, is_current: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700">Current role</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={5}
                  placeholder="Use line breaks for bullet points. Prefix with 1. 2. etc or just new lines."
                  value={form.description ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-900">Delete experience?</h3>
            <p className="text-sm text-slate-500">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
