import type { Project } from "@/types/database";

/** Case-study sections in display order. Keys are columns on public.projects. */
export const CASE_STUDY_SECTIONS = [
  { key: "problem",  label: "The problem", hint: "What question or business problem did this project answer? Who needed it?" },
  { key: "data",     label: "The data",    hint: "Sources, size, time range, and how it was cleaned or modelled." },
  { key: "approach", label: "Approach",    hint: "Tools and methods: SQL, Python, DAX, models, dashboard design…" },
  { key: "insights", label: "Key insights", hint: "The 3–5 findings that matter most. Use numbers where you can." },
  { key: "outcome",  label: "Outcome",     hint: "What changed or what you would recommend. What you learned." },
] as const;

export type CaseStudyKey = (typeof CASE_STUDY_SECTIONS)[number]["key"];

/** True when at least one section has content, so the card should link to the detail page. */
export const hasCaseStudy = (p: Partial<Pick<Project, CaseStudyKey>>) =>
  CASE_STUDY_SECTIONS.some(({ key }) => (p[key] ?? "").trim().length > 0);

/** "Coffee Shop Sales – Power BI" -> "coffee-shop-sales-power-bi" (strips Vietnamese diacritics too). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const SLUG_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";
