import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

// Same limits as the DB constraints in supabase/07_contact_messages.sql
const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Uncached client: the shared lib/supabase client is wired to Next's Data Cache
function supabaseNoStore() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
    {
      auth: { persistSession: false },
      global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }) },
    }
  );
}

async function notifyByEmail(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn("[contact] RESEND_API_KEY or CONTACT_NOTIFY_EMAIL not set — skipping email");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email, // "Reply" in your mail app goes straight to the sender
      subject: `New message from ${name} via your portfolio`,
      text: `${name} <${email}> wrote:\n\n${message}\n\n— Inbox: ${siteUrl}/admin/messages`,
      html: `
        <p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote:</p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #0066cc;background:#f5f5f7;white-space:pre-wrap">${escapeHtml(message)}</blockquote>
        <p style="color:#515154;font-size:13px">Reply to this email to answer ${escapeHtml(name)} directly, or open the <a href="${escapeHtml(siteUrl)}/admin/messages">admin inbox</a>.</p>`,
    }),
  });

  if (!res.ok) console.error("[contact] Resend error", res.status, await res.text());
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "website" field
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > LIMITS.name) {
    return NextResponse.json({ error: `Please enter your name (max ${LIMITS.name} characters).` }, { status: 400 });
  }
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > LIMITS.message) {
    return NextResponse.json({ error: `Please enter a message (max ${LIMITS.message} characters).` }, { status: 400 });
  }

  const { error } = await supabaseNoStore().from("contact_messages").insert({ name, email, message });
  if (error) {
    console.error("[contact] insert failed", error);
    return NextResponse.json({ error: "Could not send your message. Please try again or email me directly." }, { status: 500 });
  }

  // Message is saved; an email failure must not fail the request
  try {
    await notifyByEmail(name, email, message);
  } catch (err) {
    console.error("[contact] email notification failed", err);
  }

  return NextResponse.json({ ok: true });
}
