import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { hasCaseStudy } from "@/lib/case-study";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://resume-website-six-mu.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: "/",           priority: 1.0,  changeFrequency: "monthly" as const },
    { path: "/about",      priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/experience", priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/education",  priority: 0.7,  changeFrequency: "monthly" as const },
    { path: "/projects",   priority: 0.9,  changeFrequency: "weekly"  as const },
    { path: "/contact",    priority: 0.6,  changeFrequency: "yearly"  as const },
  ];

  // Case-study pages (only projects that have a write-up; thin pages are noindex)
  const { data } = await supabase
    .from("projects")
    .select("slug, problem, data, approach, insights, outcome").throwOnError()
    .eq("hidden", false);
  const caseStudies = (data ?? []).filter(hasCaseStudy).map(({ slug }) => ({
    path: `/projects/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...routes, ...caseStudies].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
