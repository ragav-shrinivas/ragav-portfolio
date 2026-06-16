"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

const PROJECT_TYPES = [
  "Website",
  "AI / ML System",
  "Mobile App",
  "Video Editing & Content",
  "Brand & Poster Design",
  "Other",
];

const BUDGETS = ["Under ₹50k", "₹50k – ₹2L", "₹2L – ₹5L", "₹5L+", "Not sure yet"];

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  projectType: "Project Type",
  budget: "Budget",
  message: "Message",
};

type FormState = Record<keyof typeof FIELD_LABELS, string>;

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const lines = (Object.keys(FIELD_LABELS) as Array<keyof FormState>)
      .filter((key) => form[key].trim().length > 0)
      .map((key) => `${FIELD_LABELS[key]}: ${form[key].trim()}`);

    const text =
      lines.length > 0
        ? `Hi H. Ragav, I'd like to get in touch.\n\n${lines.join("\n")}`
        : "Hi H. Ragav, I'd like to get in touch.";

    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="energy-border glass-strong relative rounded-3xl p-7 md:p-10">
      <p className="text-label text-blue">Send a Message</p>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Every field is optional — share whatever's useful. Submitting opens a
        prefilled WhatsApp message straight to me.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            className="field-input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
            className="field-input"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 ..."
            className="field-input"
          />
        </Field>
        <Field label="Company">
          <input
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Optional"
            className="field-input"
          />
        </Field>
        <Field label="Project Type">
          <select value={form.projectType} onChange={set("projectType")} className="field-input">
            <option value="">Select (optional)</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget">
          <select value={form.budget} onChange={set("budget")} className="field-input">
            <option value="">Select (optional)</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Message" className="sm:col-span-2">
          <textarea
            value={form.message}
            onChange={set("message")}
            placeholder="Tell me what you're building..."
            rows={4}
            className="field-input resize-none"
          />
        </Field>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue to-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_40px_rgba(255,31,31,0.25)] transition-shadow hover:shadow-[0_10px_50px_rgba(96,165,250,0.35)]"
      >
        Send Message
        <span aria-hidden>→</span>
      </motion.button>

      {sent && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs uppercase tracking-[0.14em] text-blue"
        >
          WhatsApp opened in a new tab — say hi!
        </motion.p>
      )}
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-label text-white/40">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
