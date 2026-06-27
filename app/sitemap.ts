import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nghiaha.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/",           priority: 1.0,  changeFrequency: "monthly" as const },
    { path: "/about",      priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/experience", priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/education",  priority: 0.7,  changeFrequency: "monthly" as const },
    { path: "/projects",   priority: 0.9,  changeFrequency: "weekly"  as const },
    { path: "/contact",    priority: 0.6,  changeFrequency: "yearly"  as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
