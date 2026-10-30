"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Certification } from "@/types/database";

interface Props {
  certifications: Certification[];
}

const ISSUER_LABELS: Record<string, string> = {
  "Google / Coursera": "G",
  "Microsoft / Coursera": "MS",
  "Tableau / Coursera": "TB",
  "IBM / Coursera": "IBM",
  "AWS / Coursera": "AWS",
  "Coursera": "C",
  "CertNexus": "CN",
  "FPT Software": "FPT",
};

export default function CertificationsGrid({ certifications }: Props) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
  };

  const item = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
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

        return (
          <motion.li key={cert.id} variants={item}>
            <div className="group card h-full p-5 flex flex-col gap-3 hover:border-accent-400/50 dark:hover:border-accent-600/50 transition-all duration-200">

              {/* Top row: issuer badge + year */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-semibold shrink-0 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {ISSUER_LABELS[cert.issuer] ?? "C"}
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 tabular-nums">
                  {cert.year}
                </span>
              </div>

              {/* Cert name */}
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug flex-1">
                {cert.name}
              </h3>

              {/* Issuer name */}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {cert.issuer}
              </p>

              {/* Credential link */}
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors mt-auto min-h-[44px]"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View credential
                </a>
              ) : (
                <span className="text-xs text-slate-300 dark:text-slate-400 mt-auto">
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
