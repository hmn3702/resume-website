export const dynamic = 'force-dynamic';

import { supabase } from "@/lib/supabase";
import type { Profile, Project, Skill } from "@/types/database";
import HeroContent from "@/components/home/HeroContent";
import ToolsMarquee from "@/components/home/ToolsMarquee";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import SkillsSnapshot from "@/components/home/SkillsSnapshot";
import CTABanner from "@/components/home/CTABanner";

async function getHomeData() {
  const [profileRes, projectsRes, skillsRes] = await Promise.all([
    supabase
      .from("profile")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("order")
      .limit(3),
    supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("order"),
  ]);

  return {
    profile: (profileRes.data ?? null) as Profile | null,
    projects: (projectsRes.data ?? []) as Project[],
    skills: (skillsRes.data ?? []) as Skill[],
  };
}

export default async function HomePage() {
  const { profile, projects, skills } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] hero-gradient overflow-hidden flex items-center justify-center py-20 px-4">
        <div aria-hidden="true" className="blob-1 pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl" />
        <div aria-hidden="true" className="blob-2 pointer-events-none absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-teal-600/10 dark:bg-teal-600/5 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl" />
        <HeroContent profile={profile} />
      </section>

      {/* Tools strip */}
      <ToolsMarquee />

      {/* Featured projects */}
      <FeaturedProjects projects={projects} />

      {/* Skills snapshot */}
      <SkillsSnapshot skills={skills} />

      {/* CTA */}
      <CTABanner profile={profile} />
    </>
  );
}
