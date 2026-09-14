import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { StorySection } from "@/components/sections/StorySection";
import { FounderSection } from "@/components/sections/FounderSection";
import { ProductionProjects } from "@/components/sections/ProductionProjects";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { DepthSection } from "@/components/ui/DepthSection";
import { Reveal } from "@/components/ui/Reveal";
import { Editable } from "@/components/edit/Editable";
import { story } from "@/data/story";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Storytelling sections */}
      <div className="relative z-10 bg-base">
        {story.map((section) => (
          <DepthSection key={section.id}>
            <StorySection data={section} />
          </DepthSection>
        ))}

        {/* Founder journey — EVO9 */}
        <FounderSection />

        {/* Client websites in production */}
        <ProductionProjects />

        {/* Video editing & content creation — coming soon */}
        <ComingSoon />

        {/* Closing CTA */}
        <section className="relative overflow-hidden border-t border-white/5 py-32 text-center md:py-44">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),rgba(255,31,31,0.15)_50%,transparent_70%)] blur-[100px]" />
          <Reveal>
            <Editable id="home.cta.label" as="p" className="text-label text-blue">
              Explore the work
            </Editable>
            <Editable
              id="home.cta.title"
              as="h2"
              className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.95] text-chrome"
            >
              See the systems in motion
            </Editable>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/works"
                className="energy-border rounded-full bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-white/10"
              >
                <Editable id="home.cta.btn1" as="span">View Works</Editable>
              </Link>
              <Link
                href="/connect"
                className="rounded-full border border-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                <Editable id="home.cta.btn2" as="span">Connect</Editable>
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
