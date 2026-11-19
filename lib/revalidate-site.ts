import toast from "react-hot-toast";

/**
 * Ask the server to refresh the cached public pages after an admin save.
 * Fire-and-forget: the save itself already succeeded.
 */
export async function revalidateSite() {
  try {
    const res = await fetch("/api/revalidate", { method: "POST" });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    toast("Saved - the public site will update within an hour.", { icon: "⏳" });
  }
}
