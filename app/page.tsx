import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import HeroContent from "@/components/home/HeroContent";

async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data;
}

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] hero-gradient overflow-hidden flex items-center justify-center py-20 px-4">

      {/* Decorative blobs — CSS only, no JS */}
      <div
        aria-hidden="true"
        className="blob-1 pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="blob-2 pointer-events-none absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-teal-600/10 dark:bg-teal-600/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl"
      />

      <HeroContent profile={profile} />
    </section>
  );
}
