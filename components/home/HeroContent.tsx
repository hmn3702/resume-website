"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Profile } from "@/types/database";

const fadeUp = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.8, delay },
  }),
};

interface Props {
  profile: Profile | null;
}

export default function HeroContent({ profile }: Props) {
  const name  = profile?.name  ?? "Ha Minh Nghia";
  const title = profile?.title ?? "Data Analyst | Data Science Graduate";
  const bio   = profile?.bio   ?? "Data Science graduate (QUT Brisbane) with a background in IoT engineering. Passionate about turning raw data into clear, actionable insights.";
  const cvUrl = profile?.cv_url ?? null;

  return (
    <div className="relative z-10 flex flex-col items-center text-center gap-8 w-full max-w-3xl mx-auto">

      {/* Avatar */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        custom={0}
        className="relative"
      >
        {profile?.avatar_url ? (
          <>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden">
              <Image
                src={profile.avatar_url}
                alt={name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 112px, 144px"
                priority
              />
            </div>
          </>
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <span className="text-3xl font-semibold text-slate-950 dark:text-white select-none">
              {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
          </div>
        )}
      </motion.div>

      {/* Greeting + name */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.1}
        className="space-y-3"
      >
        <p className="eyebrow">
          Hello, I&apos;m
        </p>
        <h1 className="page-title text-slate-900 dark:text-white">
          {name}
        </h1>
        <h2 className="text-xl sm:text-[28px] leading-snug text-slate-600 dark:text-slate-400 font-normal">
          {title}
        </h2>
      </motion.div>

      {/* Bio */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.25}
        className="max-w-xl text-slate-600 dark:text-slate-400 text-[17px] leading-relaxed text-center"
      >
        {bio}
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.4}
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full sm:w-auto"
      >
        <Link
          href="/projects"
          className="focus-ring button-primary group w-full sm:w-auto"
        >
          View My Work
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {cvUrl ? (
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring button-secondary group w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CV
          </a>
        ) : (
          <Link
            href="/contact"
            className="focus-ring button-secondary group w-full sm:w-auto"
          >
            Get in Touch
          </Link>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.55}
        className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 mt-4 border-t border-slate-300 dark:border-slate-600 w-full max-w-sm"
      >
        {[
          { value: "13+", label: "Certifications" },
          { value: "3",   label: "Languages" },
          { value: "20+", label: "Tools" },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-white">{value}</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        custom={0.9}
        className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>
  );
}
