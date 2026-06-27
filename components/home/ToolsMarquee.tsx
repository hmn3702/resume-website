const TOOLS = [
  "Python", "SQL", "Power BI", "Tableau", "Excel",
  "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn",
  "PostgreSQL", "dbt", "Azure", "R", "Jupyter", "Git",
  "Google Sheets", "Spark", "Statistics", "Machine Learning",
];

export default function ToolsMarquee() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-800 py-5 overflow-hidden">
      <div className="flex gap-3 animate-marquee" aria-hidden="true">
        {[...TOOLS, ...TOOLS].map((tool, i) => (
          <span
            key={i}
            className="shrink-0 px-4 py-1.5 rounded-full border border-teal-500/40 text-teal-700 dark:text-teal-400 text-sm font-medium bg-teal-50/70 dark:bg-teal-950/30 whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
