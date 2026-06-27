"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name: form.name, email: form.email, message: form.message });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 " +
    "px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Name
        </label>
        <input
          id="name" name="name" type="text" required
          placeholder="Jane Smith"
          value={form.name} onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email
        </label>
        <input
          id="email" name="email" type="email" required
          placeholder="jane@example.com"
          value={form.email} onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Message
        </label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Hi Nghia, I'd love to connect about..."
          value={form.message} onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-4 py-3 text-sm text-teal-700 dark:text-teal-300">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Message sent! I&apos;ll get back to you within 24 hours.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring w-full py-3 px-6 min-h-[44px] rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold transition-colors shadow-lg shadow-teal-500/20"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
