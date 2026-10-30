"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Skill } from "@/types/database";

interface Props {
  skills: Skill[];
}

// Category icon map — emoji fallback, easy to swap for SVG icons later
const CATEGORY_ICON: Record<string, string> = {
  "Data & Analysis": "📊",
  "Visualisation":   "📈",
  "Databases":       "🗄️",
  "Web & DevOps":    "🌐",
  "Cloud":           "☁️",
  "IoT & Embedded":  "🔌",
};

const LEVEL_DOTS: Record<Skill["level"], number> = {
  beginner:     1,
  intermediate: 2,
  advanced:     3,
  expert:       4,
};

const LEVEL_COLOUR: Record<Skill["level"], string> = {
  beginner:     "bg-accent-300 dark:bg-accent-600",
  intermediate: "bg-accent-400 dark:bg-accent-500",
  advanced:     "bg-accent-500",
  expert:       "bg-accent-600",
};

function LevelDots({ level }: { level: Skill["level"] }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span className="flex items-center gap-0.5" aria-label={`Level: ${level}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < filled ? LEVEL_COLOUR[level] : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      ))}
    </span>
  );
}

export default function SkillsGrid({ skills }: Props) {
  const reduce = useReducedMotion();

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const chipVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-4">
      {/* Legend — sits above the grid, not inside a card */}
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
        {[
          { label: "Beginner",     filled: 1 },
          { label: "Intermediate", filled: 2 },
          { label: "Advanced",     filled: 3 },
          { label: "Expert",       filled: 4 },
        ].map(({ label, filled }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="flex gap-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < filled ? "bg-accent-500" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </span>
            {label}
          </span>
        ))}
      </p>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {categories.map((cat) => {
        const catSkills = skills
          .filter((s) => s.category === cat)
          .sort((a, b) => a.order - b.order);

        return (
          <motion.div
            key={cat}
            variants={cardVariants}
            className="card p-5 space-y-4 transition-shadow"
          >
            {/* Category header */}
            <div className="flex items-center gap-2.5">
              <span className="text-xl" aria-hidden="true">
                {CATEGORY_ICON[cat] ?? "💡"}
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-sm">
                {cat}
              </h3>
            </div>

            {/* Skill chips */}
            <motion.ul
              variants={containerVariants}
              className="flex flex-wrap gap-2"
            >
              {catSkills.map((skill) => (
                <motion.li key={skill.id} variants={chipVariants}>
                  <div className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 transition-colors cursor-default">
                    <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
                      {skill.name}
                    </span>
                    <LevelDots level={skill.level} />
                  </div>
                </motion.li>
              ))}
            </motion.ul>

          </motion.div>
        );
      })}
    </motion.div>
    </div>
  );
}
