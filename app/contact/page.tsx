import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nghia Ha.",
};

export default function ContactPage() {
  return (
    <div className="section-container py-20 space-y-12 max-w-2xl">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          I&apos;m open to data analyst and data science opportunities. Drop me a
          message and I&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
