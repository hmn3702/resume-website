export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types/database";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work experience and professional history of Ha Minh Nghia.",
};

async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("order", { ascending: true });
  return (data ?? []) as Experience[];
}

export default async function ExperiencePage() {
  const experiences = await getExperience();

  return (
    <div className="relative section-container py-20 space-y-12 overflow-x-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal-500/5 to-transparent dark:from-teal-400/5" />
      {/* Page header */}
      <div className="space-y-3 max-w-xl">
        <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
          Career history
        </p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Work <span className="gradient-text">Experience</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {experiences.length} role{experiences.length !== 1 ? "s" : ""} across hospitality and tech —
          building communication, teamwork, and customer-facing skills alongside my data science studies.
        </p>
      </div>

      <ExperienceTimeline experiences={experiences} />
    </div>
  );
}
