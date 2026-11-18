import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { SITE_CACHE_TAG } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SITE_CACHE_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
