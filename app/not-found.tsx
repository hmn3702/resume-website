import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-container flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <h1 className="text-8xl font-semibold text-accent-500">404</h1>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Page not found
      </h2>
      <p className="text-slate-600 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="focus-ring button-primary"
      >
        Go home
      </Link>
    </div>
  );
}
