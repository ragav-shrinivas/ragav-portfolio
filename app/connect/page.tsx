import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/connect/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with H. Ragav Shrinivas — software, AI/ML, full-stack, video & creative work.",
};

const channels = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, accent: "blue" },
  { label: "Phone", value: siteConfig.phone, href: siteConfig.phoneHref, accent: "red" },
  { label: "GitHub", value: "@ragav-shrinivas", href: siteConfig.socials.github, accent: "blue" },
  { label: "LinkedIn", value: "Ragav Shrinivas", href: siteConfig.socials.linkedin, accent: "red" },
];

export default function ConnectPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),rgba(255,31,31,0.15)_50%,transparent_70%)] blur-[110px]" />

      <section className="relative mx-auto max-w-6xl px-6 pt-40 pb-28 md:px-10 md:pt-48">
        <Reveal>
          <p className="text-label text-blue">Connect</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-chrome">
            Let&apos;s build
            <br />
            <span className="text-plasma">something alive</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Whether it&apos;s an AI system, a production website, or a cinematic
            brand experience — I&apos;d love to hear what you&apos;re building.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="flex flex-col gap-5">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="energy-border hover-lift glass group flex items-center justify-between rounded-2xl p-6 md:p-7"
                >
                  <div>
                    <p className="text-label text-white/45">{c.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white md:text-xl">
                      {c.value}
                    </p>
                  </div>
                  <span
                    className={
                      c.accent === "red"
                        ? "text-2xl text-red transition-transform duration-500 group-hover:translate-x-1"
                        : "text-2xl text-blue transition-transform duration-500 group-hover:translate-x-1"
                    }
                  >
                    ↗
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16} from="right">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
