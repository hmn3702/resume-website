"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Certification } from "@/types/database";

interface Props {
  certifications: Certification[];
}

// Issuer → accent colour + short label
const ISSUER_META: Record<string, { color: string; bg: string; abbr: string }> = {
  "Google / Coursera":     { color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-950/40",   abbr: "G"  },
  "Microsoft / Coursera":  { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40", abbr: "MS" },
  "Tableau / Coursera":    { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", abbr: "TB" },
  "IBM / Coursera":        { color: "text-cyan-600 dark:text-cyan-400",   bg: "bg-cyan-50 dark:bg-cyan-950/40",   abbr: "IBM" },
  "AWS / Coursera":        { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/40", abbr: "AWS" },
  "Coursera":              { color: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-50 dark:bg-teal-950/40",   abbr: "C"  },
  "CertNexus":             { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40", abbr: "CN" },
  "FPT Software":          { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/40", abbr: "FPT" },
};

const DEFAULT_META = { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", abbr: "✦" };

export default function CertificationsGrid({ certifications }: Props) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  if (certifications.length === 0) {
    return <p className="text-slate-500 italic">Certifications coming soon.</p>;
  }

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {certifications.map((cert) => {
        const meta = ISSUER_META[cert.issuer] ?? DEFAULT_META;

        return (
          <motion.li key={cert.id} variants={item}>
            <div className="group card h-full p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 hover:border-teal-400/50 dark:hover:border-teal-600/50 transition-all duration-200">

              {/* Top row: issuer badge + year */}
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold shrink-0 ${meta.bg} ${meta.color}`}>
                  {meta.abbr}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                  {cert.year}
                </span>
              </div>

              {/* Cert name */}
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug flex-1">
                {cert.name}
              </h3>

              {/* Issuer name */}
              <p className={`text-xs font-medium ${meta.color}`}>
                {cert.issuer}
              </p>

              {/* Credential link */}
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors mt-auto"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View credential
                </a>
              ) : (
                <span className="text-xs text-slate-300 dark:text-slate-600 mt-auto">
                  No link added
                </span>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
