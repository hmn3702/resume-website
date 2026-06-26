import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();
  if (error) return null;
  return data;
}

export default async function HomePage() {
  const profile = await getProfile();

  const name = profile?.name ?? "Nghia Ha";
  const title = profile?.title ?? "Data Analyst & Aspiring Data Scientist";
  const bio =
    profile?.bio ??
    "Master of Data Science from QUT Brisbane. I turn messy data into clear decisions using Python, SQL, Power BI, and Tableau.";

  return (
    <section className="section-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-20 text-center gap-8">
      {/* Greeting */}
      <div className="animate-fade-in space-y-4">
        <p className="text-teal-600 dark:text-teal-400 font-medium tracking-widest uppercase text-sm">
          Hello, I&apos;m
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {name}
        </h1>
        <h2 className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 font-medium">
          {title}
        </h2>
      </div>

      {/* Bio */}
      <p className="animate-slide-up max-w-2xl text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-balance">
        {bio}
      </p>

      {/* CTAs */}
      <div className="animate-slide-up flex flex-wrap justify-center gap-4">
        <Link
          href="/projects"
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors shadow-lg shadow-teal-500/20"
        >
          View Projects
        </Link>
        {profile?.cv_url ? (
          <a
            href={profile.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Download CV
          </a>
        ) : (
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Get in Touch
          </Link>
        )}
      </div>

      {/* Quick stats */}
      <div className="animate-fade-in grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800 w-full max-w-md">
        {[
          { label: "Certifications", value: "8+" },
          { label: "Languages", value: "2" },
          { label: "Tools", value: "10+" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-teal-500">{value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
