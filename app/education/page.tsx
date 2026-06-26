export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Education, Certification } from "@/types/database";
import EducationCards from "@/components/education/EducationCards";
import CertificationsGrid from "@/components/education/CertificationsGrid";

export const metadata: Metadata = {
  title: "Education",
  description: "Academic background and professional certifications of Ha Minh Nghia.",
};

async function getData() {
  const [{ data: education }, { data: certifications }] = await Promise.all([
    supabase.from("education").select("*").order("end_year", { ascending: false }),
    supabase.from("certifications").select("*").order("year", { ascending: false }),
  ]);
  return {
    education: (education ?? []) as Education[],
    certifications: (certifications ?? []) as Certification[],
  };
}

export default async function EducationPage() {
  const { education, certifications } = await getData();

  return (
    <div className="section-container py-20 space-y-20">

      {/* Page header */}
      <div className="space-y-3 max-w-xl">
        <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
          Academic background
        </p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Education &amp; <span className="gradient-text">Certifications</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {education.length} degrees · {certifications.length} professional certifications
        </p>
      </div>

      {/* Education */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
            Degrees
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Academic History
          </h2>
        </div>
        <EducationCards education={education} />
      </section>

      {/* Certifications */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
            Professional development
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Certifications
          </h2>
        </div>
        <CertificationsGrid certifications={certifications} />
      </section>

    </div>
  );
}
