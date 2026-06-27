import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import ContactForm from "@/components/contact/ContactForm";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Nghia Ha — Data Analyst based in Brisbane, Australia. Open to data analyst, data science, and analytics engineering roles.",
  keywords: ["contact", "hire", "Data Analyst", "Brisbane", "Nghia Ha", "open to work"],
  openGraph: {
    title: "Contact | Nghia Ha",
    description: "Get in touch with Nghia Ha — Data Analyst based in Brisbane, open to opportunities.",
    url: "/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Contact | Nghia Ha",
    description: "Get in touch with Nghia Ha — Data Analyst based in Brisbane.",
  },
  alternates: { canonical: "/contact" },
};

async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase
    .from("profile")
    .select("email, linkedin_url, github_url, location")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  return data as Profile | null;
}

export default async function ContactPage() {
  const profile = await getProfile();

  const contactLinks = [
    profile?.email && {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.linkedin_url && {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: profile.linkedin_url,
    },
    profile?.github_url && {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      label: "GitHub",
      value: "View my projects",
      href: profile.github_url,
    },
    profile?.location && {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Location",
      value: profile.location,
      href: null,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[];

  return (
    <div className="relative section-container py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal-500/5 to-transparent dark:from-teal-400/5" />
      <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl">

        {/* Left — info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-teal-600 dark:text-teal-400 text-xs font-medium tracking-[0.2em] uppercase">
              Let&apos;s talk
            </p>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              I&apos;m open to data analyst and data science opportunities. Drop me a
              message and I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {contactLinks.length > 0 && (
            <div className="space-y-4">
              {contactLinks.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — form */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Send a message</h2>
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
