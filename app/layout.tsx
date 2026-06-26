import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/layout/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Quynh Nguyen | Data Analyst",
    template: "%s | Quynh Nguyen",
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
  authors: [{ name: "Quynh Nguyen" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Quynh Nguyen Portfolio",
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
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
