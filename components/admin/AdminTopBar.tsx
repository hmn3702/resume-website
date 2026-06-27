"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Props {
  email: string;
}

export default function AdminTopBar({ email }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    localStorage.removeItem("nh_admin_nosave");
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <h1 className="text-sm font-semibold text-slate-700">Admin Panel</h1>

      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500">{email}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-500 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </header>
  );
}
