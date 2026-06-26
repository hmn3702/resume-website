export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Data analytics and data science projects by Ha Minh Nghia.",
};

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });
  return (data ?? []) as Project[];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="section-container py-20 space-y-12">

      {/* Header */}
      <div className="space-y-3 max-w-xl">
        <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {projects.length === 0
            ? "Data analytics, data science, and IoT projects."
            : `${projects.length} project${projects.length !== 1 ? "s" : ""}${featuredCount > 0 ? ` · ${featuredCount} featured` : ""}`}
        </p>
      </div>

      <ProjectsGrid projects={projects} />

    </div>
  );
}
