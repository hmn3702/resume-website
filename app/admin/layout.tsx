import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SessionWatcher from "@/app/admin/_components/SessionWatcher";

export const metadata = {
  title: "Admin Panel | Nghia Ha",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No user = we're on the login page (middleware blocks all other /admin/* routes).
  // Render children directly so the login form shows without the admin shell.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar email={user.email ?? ""} />
        <SessionWatcher />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
