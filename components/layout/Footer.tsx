import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} Nghia Ha. Built with{" "}
          <span className="text-teal-500">♥</span> using Next.js &amp; Supabase.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-500 transition-colors"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
