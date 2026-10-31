import type { Project } from "@/types/database";

export default function ProjectCover({ project }: { project: Pick<Project, "title" | "description" | "tech_stack"> }) {
  const subject = `${project.title} ${project.description} ${project.tech_stack.join(" ")}`;
  // shortcut: infer cover themes from keywords, use explicit categories if projects need manual art direction.
  const theme = /plant|cultivat|agricultur|abelmoschus/i.test(subject)
    ? { label: "Plant Monitoring", color: "from-emerald-100 to-teal-50 text-emerald-800 dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-200", path: "M12 21V11m0 5C5 16 3 11 3 5c6 0 9 3 9 8m0-2c0-5 3-8 9-8 0 7-3 11-9 11" }
    : /iot|arduino|esp8266|sensor|embedded/i.test(subject)
    ? { label: "Connected Devices", color: "from-cyan-100 to-sky-50 text-cyan-800 dark:from-cyan-950 dark:to-sky-950 dark:text-cyan-200", path: "M8 8h8v8H8zM9 3v5m6-5v5M9 16v5m6-5v5M3 9h5m-5 6h5m8-6h5m-5 6h5" }
    : /data|analytics|tableau|power\s?bi|machine learning/i.test(subject)
    ? { label: "Data & Insights", color: "from-violet-100 to-indigo-50 text-violet-800 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-200", path: "M4 3v17h17M8 16v-5m5 5V7m5 9V4" }
    : { label: "Software & Web", color: "from-blue-100 to-slate-50 text-blue-800 dark:from-blue-950 dark:to-slate-900 dark:text-blue-200", path: "M8 8l-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" };

  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br ${theme.color}`}>
      <div aria-hidden="true" className="absolute h-56 w-56 rounded-full border border-current opacity-10" />
      <div aria-hidden="true" className="absolute h-40 w-40 rounded-full border border-current opacity-10" />
      <svg aria-hidden="true" className="relative h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d={theme.path} />
      </svg>
      <span className="relative px-4 text-center text-xs font-semibold tracking-[0.16em] uppercase">{theme.label}</span>
    </div>
  );
}
