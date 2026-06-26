"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/",           label: "Home"       },
  { href: "/about",      label: "About"      },
  { href: "/experience", label: "Experience" },
  { href: "/education",  label: "Education"  },
  { href: "/projects",   label: "Projects"   },
  { href: "/contact",    label: "Contact"    },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shadow the navbar once the user scrolls past 10px
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-sm shadow-slate-200/60 dark:shadow-slate-900/60" : ""
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="focus-ring text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-md"
        >
          NH<span className="text-teal-500">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`focus-ring relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {label}
                  {/* Active underline indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-teal-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            className="focus-ring md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <motion.svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={menuOpen ? "open" : "closed"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                variants={{
                  closed: { d: "M4 6h16M4 12h16M4 18h16" },
                  open:   { d: "M6 18L18 6M6 6l12 12"    },
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
          >
            <ul className="section-container flex flex-col py-4 gap-1">
              {NAV_LINKS.map(({ href, label }, i) => {
                const active = pathname === href;
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={href}
                      className={`focus-ring flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      )}
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
