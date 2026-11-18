"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { ContactMessage } from "@/types/database";
import toast, { Toaster } from "react-hot-toast";
import { AdminTableSkeleton } from "@/components/ui/Skeleton";

type Filter = "all" | "unread";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });

export default function AdminMessagesPage() {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(`Could not load messages: ${error.message}`);
    setItems((data ?? []) as ContactMessage[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const setRead = async (id: string, read: boolean) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ read })
      .eq("id", id)
      .select("id");
    if (error) { toast.error(error.message); return; }
    if (!data?.length) { toast.error("Update blocked — check the admin RLS policy."); return; }
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  };

  const toggleOpen = (m: ContactMessage) => {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    setDeleteId(null);
    if (next && !m.read) setRead(m.id, true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted.");
    setItems((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    setOpenId(null);
  };

  const unreadCount = items.filter((m) => !m.read).length;
  const visible = filter === "unread" ? items.filter((m) => !m.read) : items;

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div className="h-7 w-32 bg-slate-200 rounded" />
        <AdminTableSkeleton cols={1} rows={5} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
          <p className="text-slate-500 text-sm mt-1">
            {items.length} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
          {filter === "unread" ? "No unread messages." : "No messages yet."}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => {
            const open = openId === m.id;
            return (
              <li
                key={m.id}
                className={`bg-white border rounded-2xl transition-colors ${
                  m.read ? "border-slate-200" : "border-teal-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(m)}
                  aria-expanded={open}
                  className="w-full text-left px-5 py-4 flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl"
                >
                  <span
                    aria-label={m.read ? "Read" : "Unread"}
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${m.read ? "bg-transparent" : "bg-teal-500"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={`text-sm truncate ${m.read ? "text-slate-700" : "font-semibold text-slate-900"}`}>
                        {m.name} <span className="font-normal text-slate-400">&lt;{m.email}&gt;</span>
                      </p>
                      <time dateTime={m.created_at} className="text-xs text-slate-400 shrink-0">
                        {formatDate(m.created_at)}
                      </time>
                    </div>
                    {!open && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{m.message}</p>}
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 pl-10 space-y-4">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{m.message}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message via my website")}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                      >
                        Reply by email
                      </a>
                      <button
                        type="button"
                        onClick={() => setRead(m.id, false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Mark as unread
                      </button>
                      {deleteId === m.id ? (
                        <span className="flex items-center gap-2 ml-auto">
                          <span className="text-xs text-slate-500">Delete permanently?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteId(m.id)}
                          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
