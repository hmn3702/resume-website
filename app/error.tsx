"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-container flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="text-6xl font-bold text-teal-500">!</div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Something went wrong
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-sm">
        An unexpected error occurred. Try refreshing the page or go back home.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl border border-teal-500 text-teal-500 hover:bg-teal-500/10 font-semibold transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
