import { createSupabaseServerClient } from "@/lib/supabase-server";

const SECTIONS = [
  { label: "Profile",        href: "/admin/profile",        table: "profile" },
  { label: "Experience",     href: "/admin/experience",     table: "experience" },
  { label: "Education",      href: "/admin/education",      table: "education" },
  { label: "Skills",         href: "/admin/skills",         table: "skills" },
  { label: "Certifications", href: "/admin/certifications", table: "certifications" },
  { label: "Projects",       href: "/admin/projects",       table: "projects" },
];

async function getCounts() {
  const supabase = createSupabaseServerClient();
  const counts = await Promise.all(
    SECTIONS.map(async ({ table }) => {
      const { count } = await supabase
        .from(table as "profile")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    })
  );
  return counts;
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Overview of your resume content.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ label, href, table }, i) => (
          <a
            key={table}
            href={href}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 hover:shadow-md transition-all group"
          >
            <p className="text-3xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              {counts[i]}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </a>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick links</h3>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-sm text-slate-600 transition-colors"
            >
              Edit {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
