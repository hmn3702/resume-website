import Link from "next/link";
import type { Skill } from "@/types/database";

export default function SkillsSnapshot({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 px-5">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-2">
              Expertise
            </p>
            <h2 className="text-3xl sm:text-[40px] leading-tight font-semibold text-slate-900 dark:text-white">
              Skills &amp; Tools
            </h2>
          </div>
          <Link
            href="/about"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 font-normal transition-colors"
          >
            Full list
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {categories.map(([category, categorySkills]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-normal border border-slate-200 dark:border-slate-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
