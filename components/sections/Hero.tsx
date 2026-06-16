"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleField } from "@/components/ui/ParticleField";
import { ScrambleTitle } from "@/components/ui/ScrambleTitle";
import { HeroCard, type HeroCardData } from "@/components/sections/HeroCard";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 300;
const FRAME_PATH = "/frames/hero/";
const frameSrc = (i: number) =>
  `${FRAME_PATH}ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

const ROLES = [
  "Software Developer",
  "AI / ML Engineer",
  "Full Stack Developer",
  "SAP Developer",
  "Video Editor",
  "Content Creator",
  "Founder of EVO9",
];

const CARDS: HeroCardData[] = [
  { index: "01", title: "AI & Machine Learning", text: "ML-powered products, automation systems, recommendation engines and intelligent workflows.", accent: "blue" },
  { index: "02", title: "Full Stack Development", text: "Modern web apps with React, Next.js, Node.js, Supabase and cloud infrastructure.", accent: "red" },
  { index: "03", title: "SAP Enterprise Engineering", text: "ABAP Cloud, RAP, CDS Views and enterprise-grade SAP BTP solutions.", accent: "blue" },
  { index: "04", title: "Video Editing & Creative", text: "Cinematic editing, motion graphics, reels, brand storytelling and content production.", accent: "red" },
  { index: "05", title: "Digital Growth & Marketing", text: "Meta Ads, campaign optimization, conversion funnels and brand positioning.", accent: "blue" },
  { index: "06", title: "Founder of EVO9", text: "Building AI products, automation tools and next-generation digital experiences.", accent: "red" },
];

const FRAGMENTS = [
  { t: "01001 / NEURAL.NET", top: "15%", left: "6%", d: "0s" },
  { t: "AI.CORE · v9", top: "26%", left: "82%", d: "1.2s" },
  { t: "SYS.READY", top: "72%", left: "7%", d: "2.1s" },
  { t: "//EVO9", top: "80%", left: "84%", d: "0.6s" },
  { t: "Δ ENTROPY", top: "45%", left: "92%", d: "1.8s" },
  { t: "RENDER · 60FPS", top: "90%", left: "42%", d: "2.6s" },
];

const PHASES: [number, string][] = [
  [0, "01 · IDENTITY"],
  [0.22, "02 · CAPABILITIES"],
  [0.64, "03 · NEURAL CORE"],
  [0.86, "04 · ENTER"],
];

// Focal map (progress → horizontal pan 0=left .. 1=right) so the subject of
// each frame stays visible when the cover-crop is tight (mobile portrait).
// Derived from the footage: opening subject sits left, the driver sits
// center-right, later HUD/laptop frames are centered.
const FOCAL: [number, number][] = [
  [0, 0.17],
  [0.14, 0.22],
  [0.26, 0.56],
  [0.42, 0.52],
  [0.62, 0.5],
  [1, 0.5],
];

// --- math helpers ---
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const band = (p: number, a: number, b: number, c: number, d: number) =>
  Math.min(ramp(p, a, b), 1 - ramp(p, c, d));
/** back-out easing → slight overshoot on entry. */
const backOut = (t: number) => {
  const s = 1.70158;
  const u = t - 1;
  return u * u * ((s + 1) * u + s) + 1;
};
/** narrow pulse peaking at center. */
const pulse = (p: number, center: number, w: number) =>
  Math.max(0, 1 - Math.abs(p - center) / w);
const focal = (p: number) => {
  for (let i = 1; i < FOCAL.length; i++) {
    if (p <= FOCAL[i][0]) {
      const [pa, fa] = FOCAL[i - 1];
      const [pb, fb] = FOCAL[i];
      return fa + (fb - fa) * ((p - pa) / (pb - pa));
    }
  }
  return 0.5;
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const countRef = useRef(FRAME_COUNT);

  const greetRef = useRef<HTMLDivElement>(null);
  const greetInnerRef = useRef<HTMLDivElement>(null);
  const cardsInnerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefsM = useRef<(HTMLDivElement | null)[]>([]);
  const neuralRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // ---- draw a frame (cover-fit with focal-aware horizontal pan) ----
  const draw = useCallback((index: number, fx: number) => {
    const canvas = canvasRef.current;
    const imgs = imagesRef.current;
    if (!canvas || !imgs.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
    const n = imgs.length;
    const img = imgs[Math.min(Math.max(Math.round(index), 0), n - 1)];
    if (!img?.complete) return;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = W / H;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      dh = H;
      dw = H * ir;
      dx = (W - dw) * fx; // fx: 0 shows left, 1 shows right
      dy = 0;
    } else {
      dw = W;
      dh = W / ir;
      dx = 0;
      dy = (H - dh) * 0.4;
    }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ---- overlay timeline for a given scroll progress ----
  const renderScene = useCallback(
    (p: number) => {
      const n = countRef.current;
      draw(p * (n - 1), focal(p));

      const set = (
        el: HTMLElement | null,
        opacity: number,
        x = 0,
        y = 0,
        extra = ""
      ) => {
        if (!el) return;
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) ${extra}`;
      };

      // Greeting — visible at rest, drifts up & out before cards begin
      set(greetRef.current, 1 - ramp(p, 0.16, 0.23), 0, -ramp(p, 0.06, 0.23) * 70);

      // Continuous bob shared by held cards (keeps motion alive during holds)
      const bob = (i: number) => Math.sin(p * 46 + i * 1.1) * 4;

      // DESKTOP cards — staged one-by-one (alternating L/R), hold, exit
      const dc = cardRefs.current;
      for (let i = 0; i < dc.length; i++) {
        const dir = i % 2 === 0 ? -1 : 1; // even from left, odd from right
        const a = 0.24 + i * 0.05;
        const b = a + 0.04;
        const inP = backOut(ramp(p, a, b));
        const outP = ramp(p, 0.64 + i * 0.01, 0.82 + i * 0.01);
        const op = clamp01(inP) * (1 - outP);
        const x = (1 - inP) * dir * 150 - outP * dir * 70;
        const y = (1 - inP) * 26 + bob(i) * inP * (1 - outP) - outP * 150;
        const scale = 0.9 + clamp01(inP) * 0.1 - outP * 0.08;
        const blur = outP * 12;
        set(dc[i], op, x, y, `scale(${scale})`);
        if (dc[i]) {
          dc[i]!.style.filter = blur ? `blur(${blur}px)` : "none";
          dc[i]!.style.setProperty("--burst", String(pulse(p, b, 0.03)));
        }
      }

      // MOBILE cards — carousel: one centered card at a time, in sequence
      const mc = cardRefsM.current;
      for (let i = 0; i < mc.length; i++) {
        const dir = i % 2 === 0 ? -1 : 1;
        const a = 0.22 + i * 0.062;
        const inP = backOut(ramp(p, a, a + 0.022));
        const outP = ramp(p, a + 0.04, a + 0.062);
        const op = clamp01(inP) * (1 - outP);
        const x = (1 - inP) * dir * 130 + outP * -dir * 120;
        const scale = 0.92 + clamp01(inP) * 0.08 - outP * 0.06;
        const blur = outP * 10;
        const el = mc[i];
        if (el) {
          el.style.opacity = String(op);
          el.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, 0) scale(${scale})`;
          el.style.filter = blur ? `blur(${blur}px)` : "none";
          el.style.setProperty("--burst", String(pulse(p, a + 0.022, 0.02)));
        }
      }

      // Neural overlay materializes through the back half
      set(neuralRef.current, band(p, 0.52, 0.7, 1, 1), 0, 0);

      // Closing CTA fills the final stretch (no dead zone at the end)
      set(closingRef.current, band(p, 0.84, 0.92, 1.01, 1.02), 0, (1 - ramp(p, 0.84, 0.94)) * 40);

      // Scroll cue only at the very top
      set(cueRef.current, 1 - ramp(p, 0, 0.04), 0, 0);

      // Footage darkens as content peaks then eases for the final frame
      if (darkenRef.current)
        darkenRef.current.style.opacity = String(0.38 + band(p, 0.2, 0.5, 0.85, 1) * 0.34);

      // Live progress HUD — guarantees visible change on every scroll tick
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
      if (phaseRef.current) {
        let label = PHASES[0][1];
        for (const [t, l] of PHASES) if (p >= t) label = l;
        if (phaseRef.current.textContent !== label)
          phaseRef.current.textContent = label;
      }
    },
    [draw]
  );

  // ---- preload all frames with a loading % ----
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    let done = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = i < 16 ? "high" : "low";
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        if (!mounted) return;
        if (img.complete && img.naturalWidth) imgs[i] = img;
        done++;
        setProgress(done / FRAME_COUNT);
        if (done === FRAME_COUNT) {
          imagesRef.current = imgs.filter(Boolean);
          countRef.current = imagesRef.current.length;
          setReady(true);
        }
      };
    }
    return () => {
      mounted = false;
    };
  }, []);

  // ---- wire the ScrollTrigger scrubber once frames are ready ----
  useEffect(() => {
    if (!ready) return;
    renderScene(0);
    const st = ScrollTrigger.create({
      trigger: sectionRef.current!,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => renderScene(self.progress),
    });
    const onResize = () => renderScene(st.progress);
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();
    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [ready, renderScene]);

  // ---- cursor parallax on decorative + content layers ----
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const apply = () => {
      const { x, y } = mouse.current;
      if (particlesRef.current)
        particlesRef.current.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`;
      if (fragmentsRef.current)
        fragmentsRef.current.style.transform = `translate3d(${x * 46}px, ${y * 46}px, 0)`;
      if (greetInnerRef.current)
        greetInnerRef.current.style.transform = `translate3d(${x * -20}px, ${y * -20}px, 0)`;
      if (cardsInnerRef.current)
        cardsInnerRef.current.style.transform = `translate3d(${x * -28}px, ${y * -28}px, 0)`;
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full bg-base"
      style={{ height: "640vh" }}
    >
      <div className="noise sticky top-0 h-screen w-full overflow-hidden">
        {/* LAYER 1 — scroll-scrubbed footage */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        />

        {/* Darken + duotone wash */}
        <div
          ref={darkenRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/80 via-base/30 to-base"
          style={{ opacity: 0.38 }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,31,31,0.12),transparent_42%),radial-gradient(circle_at_88%_80%,rgba(59,130,246,0.18),transparent_46%)]" />

        {/* LAYER 2 — particle / neural field */}
        <div ref={particlesRef} className="absolute inset-0 will-change-transform">
          <ParticleField className="opacity-60" density={60} />
        </div>

        {/* LAYER 3 — floating data fragments */}
        <div ref={fragmentsRef} className="pointer-events-none absolute inset-0 z-10 will-change-transform">
          {FRAGMENTS.map((f) => (
            <span
              key={f.t}
              className="fragment-drift absolute font-mono text-[9px] uppercase tracking-[0.3em] text-white/25 md:text-[10px]"
              style={{ top: f.top, left: f.left, animationDelay: f.d }}
            >
              {f.t}
            </span>
          ))}
        </div>

        {/* HUD corner brackets */}
        <div className="pointer-events-none absolute inset-4 z-10 md:inset-5">
          <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-white/15 md:h-7 md:w-7" />
          <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-white/15 md:h-7 md:w-7" />
          <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-white/15 md:h-7 md:w-7" />
          <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-white/15 md:h-7 md:w-7" />
        </div>

        {/* Neural transition overlay */}
        <div
          ref={neuralRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(59,130,246,0.2), transparent 55%), radial-gradient(circle at 50% 45%, rgba(255,31,31,0.12), transparent 50%)",
          }}
        >
          <div className="scan-sweep absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue/10 to-transparent" />
        </div>

        {/* GREETING — centered on desktop, lower-third (off the face) on mobile */}
        <div
          ref={greetRef}
          className="absolute inset-0 z-20 flex items-end justify-center px-5 pb-24 text-center md:items-center md:pb-0"
        >
          <div
            ref={greetInnerRef}
            className="flex flex-col items-center rounded-3xl bg-base/25 p-5 backdrop-blur-[3px] will-change-transform md:bg-transparent md:p-0 md:backdrop-blur-0"
          >
            <span className="text-label mb-3 text-blue md:mb-4">
              Welcome to my digital mind
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/55 md:text-sm">
              Hi, I&apos;m
            </p>
            <h1
              className="mask-reveal mt-2 font-display text-[clamp(2.4rem,11vw,8rem)] uppercase leading-[0.9] tracking-[0.04em] text-chrome glow-white"
              style={{ ["--ls" as string]: "0.04em" }}
            >
              H Ragav Shrinivas
            </h1>
            <div className="mt-4 flex items-center gap-3 text-[clamp(0.95rem,4vw,1.7rem)] font-semibold uppercase tracking-[0.1em]">
              <span className="h-px w-5 bg-gradient-to-r from-transparent to-blue-bright md:w-6" />
              <ScrambleTitle titles={ROLES} />
              <span className="h-px w-5 bg-gradient-to-l from-transparent to-red md:w-6" />
            </div>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-white/65 md:mt-6 md:max-w-2xl md:text-base">
              Build intelligent systems, immersive experiences, scalable
              applications and creative digital products — bridging software
              engineering, AI, enterprise technology and cinematic content.
            </p>
          </div>
        </div>

        {/* DESKTOP CARDS — staged grid */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center px-6 md:flex">
          <div ref={cardsInnerRef} className="w-full max-w-5xl will-change-transform">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {CARDS.map((card, i) => (
                <div
                  key={card.index}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="pointer-events-auto relative opacity-0 will-change-transform"
                >
                  <span className="card-burst" />
                  <HeroCard data={card} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE CARDS — carousel (one centered card at a time) */}
        <div className="absolute inset-0 z-20 md:hidden">
          {CARDS.map((card, i) => (
            <div
              key={card.index}
              ref={(el) => {
                cardRefsM.current[i] = el;
              }}
              className="absolute left-1/2 top-[52%] w-[86%] max-w-sm opacity-0 will-change-transform"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <span className="card-burst" />
              <HeroCard data={card} />
            </div>
          ))}
        </div>

        {/* Closing CTA — final stretch */}
        <div
          ref={closingRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0"
        >
          <p className="text-label text-blue">The operating system is live</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,7vw,5rem)] uppercase leading-[0.95] text-chrome">
            Enter the work
          </h2>
          <span className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            Keep scrolling ↓
          </span>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-16 z-30 flex flex-col items-center gap-2 md:bottom-14"
        >
          <span className="text-label text-white/40">Scroll to begin →</span>
          <div className="h-9 w-px overflow-hidden bg-white/15">
            <div className="h-1/2 w-full animate-[scan_1.8s_ease-in-out_infinite] bg-gradient-to-b from-red to-transparent" />
          </div>
        </div>

        {/* Live progress HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-4 md:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <span
              ref={phaseRef}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55"
            >
              01 · IDENTITY
            </span>
            <div className="relative h-px flex-1 bg-white/10">
              <div
                ref={barRef}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-bright to-red"
                style={{ width: "0%" }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
              EVO9
            </span>
          </div>
        </div>

        {/* Loading screen */}
        {!ready && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-base">
            <div className="relative grid place-items-center">
              <div
                className="absolute h-64 w-64 animate-pulse-glow rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,31,31,0.45), rgba(59,130,246,0.3) 45%, transparent 70%)",
                }}
              />
              <span className="relative font-display text-5xl uppercase tracking-[0.1em] text-chrome md:text-6xl">
                RAGAV
              </span>
            </div>
            <div className="text-label text-white/40">
              Initializing · {Math.round(progress * 100)}%
            </div>
            <div className="h-px w-56 overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-bright to-red transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
