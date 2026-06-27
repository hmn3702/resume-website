import Link from "next/link";
import type { Profile } from "@/types/database";

export default function CTABanner({ profile }: { profile: Profile | null }) {
  return (
    <section className="relative bg-slate-900 overflow-hidden py-24 px-4">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative text-center space-y-6">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
          Open to opportunities
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">
          Let&apos;s build something{" "}
          <span className="text-teal-400">together</span>
        </h2>

        <p className="text-slate-400 max-w-md mx-auto text-base leading-relaxed">
          Looking for data analyst roles in Brisbane or remote. Always happy to
          connect and talk about opportunities.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-teal-500/25 hover:-translate-y-0.5"
          >
            Get in Touch
          </Link>

          {profile?.cv_url && (
            <a
              href={profile.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-xl border border-white/20 text-slate-200 hover:border-teal-500/50 hover:text-teal-400 font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CV
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
