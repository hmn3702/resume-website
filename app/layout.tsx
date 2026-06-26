import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Nghia Ha | Data Analyst",
    template: "%s | Nghia Ha",
  },
  description:
    "Data Analyst & aspiring Data Scientist. Master of Data Science – QUT Brisbane. " +
    "Skilled in Python, R, SQL, Power BI, and Tableau.",
  keywords: [
    "Data Analyst",
    "Data Science",
    "Python",
    "SQL",
    "Power BI",
    "Tableau",
    "QUT",
  ],
  authors: [{ name: "Nghia Ha" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Nghia Ha Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
