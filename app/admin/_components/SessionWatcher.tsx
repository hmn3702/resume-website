"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SessionWatcher() {
  useEffect(() => {
    const nosave = localStorage.getItem("nh_admin_nosave") === "1";
    const tabActive = sessionStorage.getItem("nh_admin_tab") === "1";

    if (nosave && !tabActive) {
      // "Don't stay signed in" preference set, and this is a fresh browser session
      // (sessionStorage is empty because the browser was closed and reopened)
      const supabase = createSupabaseBrowserClient();
      supabase.auth.signOut().then(() => {
        window.location.href = "/admin/login";
      });
      return;
    }

    // Mark tab as active so SPA navigation within the same tab doesn't trigger sign-out
    sessionStorage.setItem("nh_admin_tab", "1");
  }, []);

  return null;
}
