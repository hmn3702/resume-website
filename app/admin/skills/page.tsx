"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Skill } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";

type Level = Skill["level"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced", "expert"];

const EMPTY: Omit<Skill, "id" | "created_at"> = {
  name: "",
  category: "",
  level: "intermediate",
  order: 0,
};

export default function AdminSkillsPage() {
  const supabase = createSupabaseBrowserClient();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Skill>>({});
  const [addForm, setAddForm] = useState({ ...EMPTY });
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("order");
    setItems((data ?? []) as Skill[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const categories = ["All", ...Array.from(new Set(items.map((s) => s.category)))];
  const filtered = filterCategory === "All" ? items : items.filter((s) => s.category === filterCategory);

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditForm({ ...skill });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleInlineSave = async (id: string) => {
    setSaving(true);

    const { error } = await supabase.from("skills").update(editForm).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Saved!"); cancelEdit(); load(); }
    setSaving(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("skills").insert(addForm);
    if (error) toast.error(error.message);
    else { toast.success("Added!"); setAddForm({ ...EMPTY }); setShowAdd(false); load(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("skills").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); load(); }
    setDeleteId(null);
  };

  const inputClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
          <p className="text-slate-500 text-sm mt-1">{items.length} skills across {categories.length - 1} categories</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add skill
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === cat
                ? "bg-teal-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add new skill form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-teal-200 rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-semibold text-slate-900 text-sm">New skill</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
              <input
                required
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
              <input
                required
                value={addForm.category}
                onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Level</label>
              <select
                value={addForm.level}
                onChange={(e) => setAddForm((p) => ({ ...p, level: e.target.value as Level }))}
                className={`${inputClass} w-full`}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Order</label>
              <input
                type="number"
                value={addForm.order}
                onChange={(e) => setAddForm((p) => ({ ...p, order: Number(e.target.value) }))}
                className={`${inputClass} w-full`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {saving ? "Adding…" : "Add skill"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Skills table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Level</th>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((skill) => {
              const isEditing = editingId === skill.id;
              return (
                <tr key={skill.id} className="hover:bg-slate-50 transition-colors">
                  {isEditing ? (
                    <>
                      <td className="px-5 py-2.5">
                        <input
                          value={editForm.name ?? ""}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                          className={inputClass}
                        />
                      </td>
                      <td className="px-5 py-2.5">
                        <input
                          value={editForm.category ?? ""}
                          onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                          className={inputClass}
                        />
                      </td>
                      <td className="px-5 py-2.5">
                        <select
                          value={editForm.level ?? "intermediate"}
                          onChange={(e) => setEditForm((p) => ({ ...p, level: e.target.value as Level }))}
                          className={inputClass}
                        >
                          {LEVELS.map((l) => (
                            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-2.5">
                        <input
                          type="number"
                          value={editForm.order ?? 0}
                          onChange={(e) => setEditForm((p) => ({ ...p, order: Number(e.target.value) }))}
                          className={`${inputClass} w-20`}
                        />
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleInlineSave(skill.id)}
                            disabled={saving}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                          >
                            Save
                          </button>
                          <button onClick={cancelEdit} className="text-xs text-slate-400 hover:text-slate-600 font-medium">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 font-medium text-slate-800">{skill.name}</td>
                      <td className="px-5 py-3 text-slate-600">{skill.category}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs capitalize">
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{skill.order}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(skill)}
                            className="text-xs text-slate-600 hover:text-teal-600 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(skill.id)}
                            className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-slate-900">Delete skill?</h3>
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
