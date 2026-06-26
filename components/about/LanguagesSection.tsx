"use client";

import { motion, useReducedMotion } from "framer-motion";

const LANGUAGES = [
  { lang: "Vietnamese", level: "Native",       flag: "🇻🇳", bar: 100 },
  { lang: "English",    level: "Professional", flag: "🇦🇺", bar: 85  },
  { lang: "Japanese",   level: "Intermediate", flag: "🇯🇵", bar: 50  },
];

export default function LanguagesSection() {
  const reduce = useReducedMotion();

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {LANGUAGES.map(({ lang, level, flag, bar }, i) => (
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.1 }}
          className="card p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{flag}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{lang}</p>
              <p className="text-xs text-teal-600 dark:text-teal-400">{level}</p>
            </div>
          </div>

          {/* Proficiency bar */}
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${bar}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: reduce ? 0 : i * 0.1 + 0.2, ease: "easeOut" }}
              className="h-full bg-teal-500 rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
