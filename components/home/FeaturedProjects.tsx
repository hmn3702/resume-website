import Link from "next/link";
import type { Project } from "@/types/database";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Featured Work
            </p>
            <h2 className="text-3xl font-bold text-white">Selected Projects</h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            All projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-teal-500/40 transition-all duration-300"
            >
              {/* Thumbnail */}
              {project.image_url && (
                <div className="w-full h-40 rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-white text-base leading-snug">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech stack */}
              {project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-500 text-xs">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-4 pt-1 border-t border-white/10">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors py-2"
                  >
                    Live demo
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors py-2"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Mobile "all projects" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
