"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkRecovery() {
      try {
        const url = new URL(window.location.href);
        const hash = new URLSearchParams(url.hash.slice(1));
        if (url.searchParams.has("error") || hash.has("error")) {
          throw new Error("This reset link is invalid or has expired. Request a new link from the login page.");
        }
        // The browser client automatically exchanges the PKCE code before getUser resolves.
        const { data: { user }, error } = await createSupabaseBrowserClient().auth.getUser();
        if (error || !user) {
          throw new Error("No valid recovery session. Request a new reset link and open it in the same browser.");
        }
        window.history.replaceState(null, "", window.location.pathname);
        if (active) setReady(true);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not verify the reset link. Please try again.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void checkRecovery();
    return () => { active = false; };
  }, []);

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || saving) return;
    setError(null);
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setReady(false);
      setPassword("");
      setConfirmPassword("");
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) setError("Password updated, but sign-out failed. Close this browser session if you are on a shared device.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-400";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Admin Panel</p>
          <h1 className="text-xl font-semibold text-white">Reset your password</h1>
        </div>
        {checking && <p role="status" className="text-sm text-slate-300">Verifying your reset link…</p>}
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        {success && <p role="status" className="text-sm text-slate-200">Your password has been updated. You can now sign in with your new password.</p>}
        {ready && !success && (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-slate-300">New password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" aria-describedby="password-hint" value={password} onChange={event => setPassword(event.target.value)} className={`${inputClass} pr-11`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors" aria-label={showPassword ? "Hide passwords" : "Show passwords"} aria-pressed={showPassword}>
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p id="password-hint" className="text-xs text-slate-400">Use at least 8 characters.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm text-slate-300">Confirm new password</label>
              <div className="relative">
                <input id="confirm-password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={`${inputClass} pr-11`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors" aria-label={showPassword ? "Hide passwords" : "Show passwords"} aria-pressed={showPassword}>
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={saving} className="button-primary w-full">{saving ? "Updating…" : "Update password"}</button>
          </form>
        )}
        <Link href="/admin/login" className="inline-flex min-h-[44px] items-center text-sm text-accent-400 hover:text-accent-300">Back to sign in</Link>
      </div>
    </div>
  );
}
