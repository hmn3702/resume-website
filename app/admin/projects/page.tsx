"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type ProjectForm = Omit<Project, "id" | "created_at"> & { tech_stack_raw: string };

const EMPTY: ProjectForm = {
  title: "",
  description: "",
  tech_stack: [],
  tech_stack_raw: "",
  live_url: null,
  github_url: null,
  image_url: null,
  featured: false,
  order: 0,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true });
    setItems((data ?? []) as Project[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setPanelOpen(true); };
  const openEdit = (item: Project) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tech_stack: item.tech_stack,
      tech_stack_raw: item.tech_stack.join(", "),
      live_url: item.live_url,
      github_url: item.github_url,
      image_url: item.image_url,
      featured: item.featured,
      order: item.order,
    });
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setEditId(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack_raw.split(",").map((t) => t.trim()).filter(Boolean),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      image_url: form.image_url || null,
      featured: form.featured,
      order: form.order,
    };
    let error;
    if (editId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await supabase.from("projects").update(payload as any).eq("id", editId));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ error } = await supabase.from("projects").insert(payload as any));
    }
    if (error) toast.error(error.message);
    else { toast.success(editId ? "Updated!" : "Added!"); closePanel(); load(); }
    setSaving(false);
  };

  const toggleFeatured = async (item: Project) => {
    const { error } = await supabase
      .from("projects")
      .update({ featured: !item.featured })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else { toast.success(item.featured ? "Unfeatured." : "Featured!"); load(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteId);
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
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-500 text-sm mt-1">{items.length} projects</p>
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
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No projects yet. Add your first one!</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 space-y-3 hover:shadow-sm transition-all ${
                item.featured ? "border-teal-300 ring-1 ring-teal-200" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {item.featured && (
                      <span className="px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                )}
              </div>

              {/* Tech stack */}
              {item.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tech_stack.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{t}</span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {item.live_url && <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Live →</a>}
                {item.github_url && <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">GitHub →</a>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`flex-1 text-xs font-medium py-1 transition-colors ${
                    item.featured ? "text-teal-600 hover:text-teal-700" : "text-slate-400 hover:text-teal-600"
                  }`}
                >
                  {item.featured ? "★ Unfeature" : "☆ Feature"}
                </button>
                <button onClick={() => openEdit(item)} className="flex-1 text-xs text-slate-600 hover:text-teal-600 font-medium py-1 transition-colors">Edit</button>
                <button onClick={() => setDeleteId(item.id)} className="flex-1 text-xs text-slate-400 hover:text-red-500 font-medium py-1 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closePanel} />
          <aside className="w-[520px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{editId ? "Edit project" : "Add project"}</h3>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-400">*</span></label>
                <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech stack (comma separated)</label>
                <input
                  placeholder="Python, SQL, Power BI"
                  value={form.tech_stack_raw}
                  onChange={(e) => setForm((p) => ({ ...p, tech_stack_raw: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Live URL</label>
                <input type="url" value={form.live_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, live_url: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                <input type="url" value={form.github_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))} className={inputClass} />
              </div>

              <ImageUpload
                folder="projects"
                currentUrl={form.image_url}
                label="Project image"
                onUpload={(url) => setForm((p) => ({ ...p, image_url: url }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} className={inputClass} />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Featured</span>
                  </label>
                </div>
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
            <h3 className="font-semibold text-slate-900">Delete project?</h3>
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
