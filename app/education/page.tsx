import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Education, Certification } from "@/types/database";

export const metadata: Metadata = {
  title: "Education",
  description: "Academic background and professional certifications.",
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
    <div className="section-container py-20 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Education &amp; <span className="gradient-text">Certifications</span>
        </h1>
      </div>

      {/* Education */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Academic Background
        </h2>
        {education.length === 0 ? (
          <p className="text-slate-500 italic">Education data coming soon.</p>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="card p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {edu.degree} — {edu.field}
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
                  {edu.start_year} – {edu.end_year ?? "Present"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certifications */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Certifications
        </h2>
        {certifications.length === 0 ? (
          <p className="text-slate-500 italic">Certifications coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="card p-5 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm leading-snug">
                    {cert.name}
                  </h3>
                  <span className="text-xs text-slate-400 shrink-0">{cert.year}</span>
                </div>
                <p className="text-xs text-teal-600 dark:text-teal-400">{cert.issuer}</p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-teal-500 transition-colors underline underline-offset-2"
                  >
                    View credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
