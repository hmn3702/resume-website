export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Data analytics, data science, and IoT projects by Nghia Ha — including dashboards, machine learning models, and full-stack applications built with Python, SQL, Power BI, and Next.js.",
  keywords: ["projects", "portfolio", "Data Analytics", "Python", "SQL", "Power BI", "Next.js", "Nghia Ha"],
  openGraph: {
    title: "Projects | Nghia Ha",
    description:
      "Data analytics, data science, and IoT projects — dashboards, ML models, and full-stack apps.",
    url: "/projects",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Projects | Nghia Ha",
    description: "Data analytics, data science, and IoT projects by Nghia Ha.",
  },
  alternates: { canonical: "/projects" },
};

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("hidden", false)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="relative section-container py-16 sm:py-24 space-y-12 sm:space-y-16">

      {/* Header */}
      <div className="space-y-5 max-w-2xl">
        <p className="eyebrow">
          Portfolio
        </p>
        <h1 className="page-title font-semibold text-slate-900 dark:text-slate-50">
          My <span>Projects</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          Exploring data, building solutions, and turning ideas into working products.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {projects.length === 0
            ? "Data analytics, data science, and IoT projects."
            : `${projects.length} project${projects.length !== 1 ? "s" : ""}${featuredCount > 0 ? ` · ${featuredCount} featured` : ""}`}
        </p>
      </div>

      <ProjectsGrid projects={projects} />

    </div>
  );
}
