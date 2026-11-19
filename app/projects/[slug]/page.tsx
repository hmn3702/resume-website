// ISR: same policy as the other public pages (admin saves refresh instantly)
export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";
import { CASE_STUDY_SECTIONS, hasCaseStudy } from "@/lib/case-study";
import RichText from "@/components/projects/RichText";
import ProjectCover from "@/components/projects/ProjectCover";

type Params = { params: { slug: string } };

async function getProject(slug: string): Promise<Project | null> {
  const { data } = await supabase
    .from("projects")
    .select("*").throwOnError()
    .eq("slug", slug)
    .eq("hidden", false)
    .maybeSingle();
  return (data as Project | null) ?? null;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("projects")
    .select("slug").throwOnError()
    .eq("hidden", false);
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project not found" };

  const url = `/projects/${project.slug}`;
  const image = project.image_url
    ? { url: project.image_url, alt: project.title }
    : { url: "/opengraph-image", width: 1200, height: 630, alt: "Nghia Ha | Data Analyst" };

  return {
    title: project.title,
    description: project.description,
    keywords: [...project.tech_stack, "case study", "Nghia Ha"],
    openGraph: { type: "article", title: `${project.title} | Nghia Ha`, description: project.description, url, images: [image] },
    twitter: { title: `${project.title} | Nghia Ha`, description: project.description },
    alternates: { canonical: url },
    // A project without a write-up is a thin page - keep it out of search results
    robots: hasCaseStudy(project) ? undefined : { index: false, follow: true },
  };
}

export default async function ProjectCaseStudyPage({ params }: Params) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const sections = CASE_STUDY_SECTIONS.filter(({ key }) => (project[key] ?? "").trim());
  const gallery = project.gallery ?? [];

  return (
    <article className="section-container py-16 sm:py-24">
      <Link
        href="/projects"
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-sm text-accent-600 dark:text-accent-400 hover:underline"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        All projects
      </Link>

      {/* Header */}
      <header className="mt-8 max-w-3xl space-y-5">
        <p className="eyebrow">Case study</p>
        <h1 className="page-title font-semibold text-slate-900 dark:text-slate-50 break-words">{project.title}</h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed break-words">
          {project.description}
        </p>

        {project.tech_stack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tools used">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="text-xs px-2.5 py-0.5 rounded-full bg-accent-50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300 border border-accent-100 dark:border-accent-900"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.live_url || project.github_url) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="focus-ring button-primary text-sm">
                Live demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="focus-ring button-secondary text-sm">
                View on GitHub
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero image */}
      <div className="card relative mt-12 aspect-[16/9] w-full overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1104px"
            className="object-cover"
          />
        ) : (
          <ProjectCover project={project} />
        )}
      </div>

      {/* Sections */}
      {sections.length > 0 ? (
        <div className="mt-14 max-w-3xl space-y-12">
          {sections.map(({ key, label }) => (
            <section key={key} aria-labelledby={`section-${key}`} className="space-y-4">
              <h2 id={`section-${key}`} className="text-2xl sm:text-[28px] font-semibold text-slate-900 dark:text-slate-50">
                {label}
              </h2>
              <div className="text-[17px] leading-relaxed text-slate-600 dark:text-slate-300 break-words">
                <RichText text={project[key] as string} />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-14 max-w-3xl text-slate-500 dark:text-slate-400">
          A detailed write-up for this project is coming soon.
        </p>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section aria-labelledby="section-gallery" className="mt-16 space-y-6">
          <h2 id="section-gallery" className="text-2xl sm:text-[28px] font-semibold text-slate-900 dark:text-slate-50">
            Gallery
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6">
            {gallery.map((url, i) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring card relative block aspect-[16/10] overflow-hidden"
                  aria-label={`Open screenshot ${i + 1} of ${project.title} in full size`}
                >
                  <Image
                    src={url}
                    alt={`${project.title} - screenshot ${i + 1}`}
                    fill
                    sizes="(max-width: 639px) 100vw, 540px"
                    className="object-contain"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <div className="card mt-16 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">Want to talk about this project?</p>
          <p className="text-slate-600 dark:text-slate-400">I&apos;m open to data analyst roles in Brisbane and remote.</p>
        </div>
        <Link href="/contact" className="focus-ring button-primary shrink-0">Get in touch</Link>
      </div>
    </article>
  );
}
