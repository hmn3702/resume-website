import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types/database";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work experience and professional history.",
};

async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("order", { ascending: true });
  return (data ?? []) as Experience[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });
}

export default async function ExperiencePage() {
  const experiences = await getExperience();

  return (
    <div className="section-container py-20 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Work <span className="gradient-text">Experience</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          My professional journey so far.
        </p>
      </div>

      {experiences.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 italic">
          Experience data coming soon — add it via the admin panel.
        </p>
      ) : (
        <ol className="relative border-l border-teal-200 dark:border-teal-900 space-y-10 ml-4">
          {experiences.map((exp) => (
            <li key={exp.id} className="ml-6">
              {/* Timeline dot */}
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 ring-4 ring-white dark:ring-slate-950">
                <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx={4} cy={4} r={4} />
                </svg>
              </span>

              <div className="card p-6 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {exp.role}
                  </h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
                    {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
