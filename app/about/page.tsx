export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Profile, Skill } from "@/types/database";
import SkillsGrid from "@/components/about/SkillsGrid";
import LanguagesSection from "@/components/about/LanguagesSection";

export const metadata: Metadata = {
  title: "About",
  description: "About Nghia Ha — background, skills, and languages.",
};

async function getData() {
  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase.from("profile").select("*").order("updated_at", { ascending: false }).limit(1).single(),
    supabase.from("skills").select("*").order("order", { ascending: true }),
  ]);
  return {
    profile: profile as Profile | null,
    skills: (skills ?? []) as Skill[],
  };
}

export default async function AboutPage() {
  const { profile, skills } = await getData();

  return (
    <div className="section-container py-20 space-y-20">

      {/* Bio */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
            Who I am
          </p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {profile?.bio ??
              "Data Science graduate (QUT Brisbane) with a background in IoT engineering from FPT University. " +
              "Passionate about turning raw data into actionable insights using Python, SQL, Power BI, and Tableau."}
          </p>
          {profile?.location && (
            <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {profile.location}
            </p>
          )}
        </div>

        {/* Quick-fact cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🎓", label: "Degree",       value: "Master of IT (Data Science)" },
            { icon: "🏫", label: "University",   value: "QUT Brisbane" },
            { icon: "📜", label: "Certificates", value: "13 professional certs" },
            { icon: "💼", label: "Available",    value: "Open to opportunities" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="card p-4 space-y-1">
              <span className="text-xl" aria-hidden="true">{icon}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
              Technical toolkit
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Skills &amp; Technologies
            </h2>
          </div>
          <SkillsGrid skills={skills} />
        </section>
      )}

      {/* Languages */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
            Communication
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Languages
          </h2>
        </div>
        <LanguagesSection />
      </section>

    </div>
  );
}
