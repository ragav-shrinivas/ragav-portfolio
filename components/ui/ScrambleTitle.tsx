"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*";

/**
 * Cycles through `titles`, transitioning with a brief character-scramble
 * (decode) effect plus a glow pulse — a Tony-Stark-HUD style rotating role.
 */
export function ScrambleTitle({
  titles,
  className,
  hold = 2200,
  scrambleMs = 600,
}: {
  titles: string[];
  className?: string;
  hold?: number;
  scrambleMs?: number;
}) {
  const [display, setDisplay] = useState(titles[0]);
  const [pulsing, setPulsing] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const scrambleTo = (target: string) => {
      if (reduce) {
        setDisplay(target);
        scheduleNext();
        return;
      }
      setPulsing(true);
      const start = performance.now();
      const prev = display;
      const len = Math.max(target.length, prev.length);

      const tick = (now: number) => {
        const p = Math.min((now - start) / scrambleMs, 1);
        const revealed = Math.floor(p * target.length);
        let out = "";
        for (let i = 0; i < len; i++) {
          if (i < revealed) {
            out += target[i] ?? "";
          } else if (i < target.length) {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(out);
        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
          setPulsing(false);
          scheduleNext();
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const scheduleNext = () => {
      timeout = setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % titles.length;
        scrambleTo(titles[indexRef.current]);
      }, hold);
    };

    scheduleNext();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles, hold, scrambleMs]);

  return (
    <span
      className={cn(
        "inline-block font-mono tabular-nums transition-[text-shadow] duration-300",
        pulsing
          ? "text-blue [text-shadow:0_0_20px_rgba(96,165,250,0.8),0_0_45px_rgba(59,130,246,0.4)]"
          : "text-blue [text-shadow:0_0_14px_rgba(96,165,250,0.5)]",
        className
      )}
    >
      {display}
      <span className="ml-0.5 inline-block w-[0.6ch] animate-pulse text-red">_</span>
    </span>
  );
}
