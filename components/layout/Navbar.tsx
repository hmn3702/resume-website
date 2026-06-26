"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <nav className="section-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          QN<span className="text-teal-500">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  pathname === href
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-sm font-medium py-1 transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                    pathname === href
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
