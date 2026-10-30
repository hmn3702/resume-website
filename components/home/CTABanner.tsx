import Link from "next/link";
import type { Profile } from "@/types/database";

export default function CTABanner({ profile }: { profile: Profile | null }) {
  return (
    <section className="dark-tile py-16 sm:py-20 px-5">
      <div className="section-container relative text-center space-y-6">
        {/* Availability badge */}
        <div className="text-sm text-slate-300">
          Open to opportunities
        </div>

        <h2 className="text-3xl sm:text-[40px] leading-tight font-semibold text-white text-balance">
          Let&apos;s build something{" "}
          <span>together</span>
        </h2>

        <p className="text-slate-400 max-w-md mx-auto text-[17px] leading-relaxed">
          Looking for data analyst roles in Brisbane or remote. Always happy to
          connect and talk about opportunities.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/contact"
            className="focus-ring button-primary"
          >
            Get in Touch
          </Link>

          {profile?.cv_url && (
            <a
              href={profile.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring button-secondary"
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
