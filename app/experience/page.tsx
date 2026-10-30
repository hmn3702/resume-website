export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types/database";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Work experience and professional history of Nghia Ha — Data Analyst based in Brisbane, Australia. Roles across hospitality and tech building customer-facing and analytical skills.",
  keywords: ["work experience", "Data Analyst", "Brisbane", "career history", "Nghia Ha"],
  openGraph: {
    title: "Experience | Nghia Ha",
    description: "Professional career history of Nghia Ha — Data Analyst based in Brisbane, Australia.",
    url: "/experience",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Experience | Nghia Ha",
    description: "Professional career history of Nghia Ha — Data Analyst based in Brisbane.",
  },
  alternates: { canonical: "/experience" },
};

async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });
  return (data ?? []) as Experience[];
}

export default async function ExperiencePage() {
  const experiences = await getExperience();

  return (
    <div className="relative section-container py-20 space-y-12 overflow-x-hidden">
      {/* Page header */}
      <div className="space-y-3 max-w-xl">
        <p className="eyebrow">
          Career history
        </p>
        <h1 className="page-title font-semibold text-slate-900 dark:text-slate-50">
          Work <span>Experience</span>
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
