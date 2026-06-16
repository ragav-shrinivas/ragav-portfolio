"use client";

import { cn } from "@/lib/cn";

/**
 * Per-character "electric strike" reveal. Each character animates in with the
 * char-strike keyframe (see globals.css), staggered left→right.
 */
export function LightningHeadline({
  text,
  className,
  stagger = 0.045,
  start = 0.2,
}: {
  text: string;
  className?: string;
  stagger?: number;
  start?: number;
}) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <h1
      className={cn("font-display leading-[0.9]", className)}
      aria-label={text}
    >
      {words.map((word, w) => (
        <span
          key={w}
          className="mr-[0.25em] inline-block whitespace-nowrap"
          style={{
            // Relay the gradient to the char spans without painting a rectangle.
            backgroundImage: "inherit",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {word.split("").map((ch) => {
            const delay = start + charIndex * stagger;
            charIndex += 1;
            return (
              <span
                key={charIndex}
                aria-hidden
                className="inline-block"
                style={{
                  // Re-apply the parent's gradient per character: WebKit does not
                  // extend background-clip:text to inline-block descendants, so each
                  // animated char must carry its own clipped gradient to stay visible.
                  backgroundImage: "inherit",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `char-strike 0.8s ${delay}s both cubic-bezier(0.16,1,0.3,1)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
