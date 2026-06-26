import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";

export const metadata: Metadata = {
  title: "Projects",
  description: "Data analytics and data science projects.",
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

  return (
    <div className="section-container py-20 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          A selection of data analytics and data science work.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-slate-500 italic">Projects coming soon — add them via the admin panel.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="card overflow-hidden flex flex-col hover:shadow-lg hover:shadow-teal-500/10 transition-shadow"
            >
              {project.image_url && (
                <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h2 className="font-semibold text-slate-900 dark:text-slate-50 text-lg leading-snug">
                  {project.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tech stack tags */}
                {project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.url && (
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors mt-auto"
                  >
                    View project →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
