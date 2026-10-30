const TOOLS = [
  "Python", "SQL", "Power BI", "Tableau", "Excel",
  "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn",
  "PostgreSQL", "dbt", "Azure", "R", "Jupyter", "Git",
  "Google Sheets", "Spark", "Statistics", "Machine Learning",
];

export default function ToolsMarquee() {
  return (
    <div className="bg-white dark:bg-slate-900 py-6 overflow-hidden">
      <div className="flex gap-3 animate-marquee" aria-hidden="true">
        {[...TOOLS, ...TOOLS].map((tool, i) => (
          <span
            key={i}
            className="shrink-0 px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-400 text-sm font-normal bg-slate-100 dark:bg-slate-800 whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
