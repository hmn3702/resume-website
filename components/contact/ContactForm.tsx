"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // TODO (Phase 2): replace with Supabase insert or email provider
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
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
          id="name"
          name="name"
          type="text"
          required
          placeholder="Jane Smith"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jane@example.com"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Hi Quynh, I'd love to connect about..."
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "success" && (
        <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">
          ✓ Message sent! I&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold transition-colors shadow-lg shadow-teal-500/20"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
