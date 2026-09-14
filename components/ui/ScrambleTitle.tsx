"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useEdit } from "@/components/edit/EditProvider";
import { Editable } from "@/components/edit/Editable";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*";

/**
 * Cycles through `titles`, transitioning with a brief character-scramble
 * (decode) effect plus a glow pulse — a Tony-Stark-HUD style rotating role.
 *
 * When `idPrefix` is given, each role becomes live-editable: overrides from the
 * editor feed the scramble, and in edit mode the roles render as an inline
 * editable list so the admin can rewrite each one in place.
 */
export function ScrambleTitle({
  titles,
  idPrefix,
  className,
  hold = 2200,
  scrambleMs = 600,
}: {
  titles: string[];
  idPrefix?: string;
  className?: string;
  hold?: number;
  scrambleMs?: number;
}) {
  const { editMode, isAdmin, get } = useEdit();

  // Apply any saved overrides so the scramble cycles the edited words.
  const effective = useMemo(
    () => (idPrefix ? titles.map((t, i) => get(`${idPrefix}.${i}`, t)) : titles),
    [titles, idPrefix, get]
  );
  const effectiveKey = effective.join("|");

  const [display, setDisplay] = useState(effective[0]);
  const [pulsing, setPulsing] = useState(false);
  const indexRef = useRef(0);
  const displayRef = useRef(display);
  displayRef.current = display;

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
      const prev = displayRef.current;
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
        indexRef.current = (indexRef.current + 1) % effective.length;
        scrambleTo(effective[indexRef.current]);
      }, hold);
    };

    scheduleNext();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveKey, hold, scrambleMs]);

  // Edit mode: expose every role as an inline editable chip.
  if (idPrefix && editMode && isAdmin) {
    return (
      <span
        className={cn(
          "inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono",
          className
        )}
      >
        {titles.map((t, i) => (
          <span key={i} className="inline-flex items-center">
            <Editable id={`${idPrefix}.${i}`} as="span" className="text-blue">
              {t}
            </Editable>
            {i < titles.length - 1 && (
              <span className="ml-1.5 text-white/25">·</span>
            )}
          </span>
        ))}
      </span>
    );
  }

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
