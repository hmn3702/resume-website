"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Education } from "@/types/database";

interface Props {
  education: Education[];
}

export default function EducationCards({ education }: Props) {
  const reduce = useReducedMotion();

  if (education.length === 0) {
    return <p className="text-slate-500 italic">Education data coming soon.</p>;
  }

  return (
    <div className="space-y-4">
      {education.map((edu, i) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, x: reduce ? 0 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="card p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-md hover:shadow-teal-500/5 transition-shadow"
        >
          {/* Icon */}
          <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-2xl">
            🎓
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {edu.degree} — <span className="text-teal-600 dark:text-teal-400">{edu.field}</span>
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                {edu.start_year} – {edu.end_year ?? "Present"}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {edu.institution}
            </p>

            {edu.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                {edu.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
