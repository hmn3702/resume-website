import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/layout/ThemeProvider";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nghiaha.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nghia Ha | Data Analyst",
    template: "%s | Nghia Ha",
  },
  description:
    "Data Analyst and Data Science graduate based in Brisbane, Australia. " +
    "Skilled in Python, SQL, Power BI, Tableau, and machine learning.",
  keywords: [
    "Data Analyst",
    "Data Science",
    "Brisbane",
    "Python",
    "SQL",
    "Power BI",
    "Tableau",
    "QUT",
    "machine learning",
    "Ha Minh Nghia",
  ],
  authors: [{ name: "Nghia Ha", url: SITE_URL }],
  creator: "Nghia Ha",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Nghia Ha | Data Analyst",
    title: "Nghia Ha | Data Analyst",
    description:
      "Data Analyst and Data Science graduate based in Brisbane, Australia. " +
      "Skilled in Python, SQL, Power BI, Tableau, and machine learning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nghia Ha | Data Analyst",
    description:
      "Data Analyst and Data Science graduate based in Brisbane, Australia.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            {/* Skip to main content — visible only on keyboard focus */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
