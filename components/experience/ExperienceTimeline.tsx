"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Experience } from "@/types/database";

interface Props {
  experiences: Experience[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Present";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });
}

function duration(start: string, end: string | null): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (months < 1) return "< 1 mo";
  if (months < 12) return `${months} mo`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${yrs} yr ${rem} mo` : `${yrs} yr`;
}

export default function ExperienceTimeline({ experiences }: Props) {
  const reduce = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, x: reduce ? 0 : -32 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : i * 0.12,
      },
    }),
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, delay: reduce ? 0 : i * 0.12 + 0.1 },
    }),
  };

  if (experiences.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400 italic">
        Experience data coming soon.
      </p>
    );
  }

  return (
    <ol className="relative ml-4 sm:ml-6">
      {/* Vertical line */}
      <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-teal-400 via-teal-300/50 to-transparent dark:from-teal-600 dark:via-teal-800/50" />

      {experiences.map((exp, i) => (
        <li key={exp.id} className="relative pl-8 sm:pl-10 pb-12 last:pb-0">

          {/* Timeline dot */}
          <motion.div
            variants={dotVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i}
            className="absolute left-0 top-1.5 -translate-x-1/2"
          >
            {exp.is_current ? (
              /* Pulsing dot for current role */
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-950" />
              </span>
            ) : (
              <span className="flex h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-2 ring-white dark:ring-slate-950" />
            )}
          </motion.div>

          {/* Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i}
            className="card p-5 sm:p-6 space-y-3 hover:shadow-md hover:shadow-teal-500/5 transition-shadow"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {exp.role}
                  </h2>
                  {exp.is_current && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      Current
                    </span>
                  )}
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                  {exp.company}
                </p>
              </div>

              {/* Dates + duration */}
              <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
                <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {duration(exp.start_date, exp.end_date)}
                </span>
              </div>
            </div>

            {/* Location */}
            {exp.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {exp.location}
              </div>
            )}

            {/* Description */}
            {exp.description && (
              <ul className="space-y-1.5 pt-1">
                {exp.description
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-teal-400 dark:bg-teal-600 shrink-0" />
                      {line.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
              </ul>
            )}
          </motion.div>
        </li>
      ))}
    </ol>
  );
}
