"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/database";

interface Props {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: Props) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };

  const item = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  // Featured first, then newest first
  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (projects.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center text-center gap-4">
        <span className="text-5xl" aria-hidden="true">🚧</span>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Projects coming soon
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          I&apos;m currently building out this section. Check back soon, or view my work directly on GitHub.
        </p>
        <Link
          href="https://github.com/hmn3702"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring button-primary"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          View GitHub
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid md:grid-cols-2 gap-8"
    >
      {sorted.map((project, index) => {
        const spotlight = index === 0 && project.featured;

        return (
          <motion.article
            key={project.id}
            variants={item}
            className={`group card overflow-hidden flex flex-col hover:border-accent-400/40 dark:hover:border-accent-600/40 transition-colors duration-200 ${spotlight ? "md:col-span-2 md:grid md:grid-cols-2" : ""}`}
          >
            {/* Image / neutral fallback */}
            <div className={`relative aspect-[4/3] w-full overflow-hidden ${spotlight ? "md:aspect-auto md:min-h-96" : ""}`}>
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 767px) 100vw, (max-width: 1152px) 50vw, 528px"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <span className="font-display text-7xl font-semibold tracking-tighter text-slate-500 dark:text-slate-400" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
              )}

              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-500 text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Card body */}
            <div className={`p-6 sm:p-8 flex flex-col gap-4 flex-1 min-w-0 ${spotlight ? "md:justify-center md:p-10" : ""}`}>
              <h2 className={`font-display font-semibold text-slate-900 dark:text-slate-50 leading-tight break-words ${spotlight ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                {project.title}
              </h2>

              <p className="text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                {project.description}
              </p>

              {/* Tech stack pills */}
              {project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-accent-50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300 border border-accent-100 dark:border-accent-900"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              {(project.live_url || project.github_url) && (
                <div className="flex flex-wrap items-center gap-3 pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring button-primary text-sm"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring button-secondary text-sm"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
