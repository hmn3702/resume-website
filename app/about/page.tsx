import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Profile, Skill } from "@/types/database";

export const metadata: Metadata = {
  title: "About",
  description: "About Nghia Ha — background, skills, and languages.",
};

async function getData() {
  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase.from("profile").select("*").single(),
    supabase.from("skills").select("*").order("category"),
  ]);
  return { profile: profile as Profile | null, skills: (skills ?? []) as Skill[] };
}

const SKILL_LEVEL_WIDTH: Record<Skill["level"], string> = {
  beginner: "w-1/4",
  intermediate: "w-1/2",
  advanced: "w-3/4",
  expert: "w-full",
};

export default async function AboutPage() {
  const { profile, skills } = await getData();

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="section-container py-20 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          About <span className="gradient-text">Me</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {profile?.bio ??
            "Data Analyst with a passion for turning raw data into actionable insights. " +
              "Currently pursuing a Master of Data Science at QUT Brisbane."}
        </p>
      </div>

      {/* Skills grid */}
      {categories.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Skills
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <div key={cat} className="card p-6 space-y-4">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400 uppercase text-xs tracking-widest">
                  {cat}
                </h3>
                <ul className="space-y-3">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((skill) => (
                      <li key={skill.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {skill.name}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 capitalize">
                            {skill.level}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-teal-500 rounded-full ${SKILL_LEVEL_WIDTH[skill.level]}`}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Languages
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { lang: "Vietnamese", level: "Native" },
            { lang: "English", level: "Professional" },
          ].map(({ lang, level }) => (
            <div key={lang} className="card px-5 py-3 flex items-center gap-3">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {lang}
              </span>
              <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
                {level}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
