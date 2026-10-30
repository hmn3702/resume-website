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
      <section className="hero-surface relative flex items-center justify-center py-16 sm:py-20 px-5">
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
