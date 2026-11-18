/** Accounts allowed to edit content. Keep in sync with the RLS policies in supabase/04–07. */
export const ADMIN_EMAILS = ["nghia03072002@gmail.com", "nnbq6300@gmail.com"];

export const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());
