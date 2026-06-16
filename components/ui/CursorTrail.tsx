"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive energy trail. A fixed, blend-screen canvas overlay that
 * draws a fading red→blue plasma trail following the pointer — the signature
 * "AI operating system" cue. Disabled for touch / reduced-motion.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts: { x: number; y: number; life: number }[] = [];
    const target = { x: -100, y: -100 };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      pts.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (pts.length > 26) pts.shift();
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const prev = pts[i - 1];
        p.life *= 0.92;
        const t = i / pts.length;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.lineWidth = 2.4 * t * p.life;
        ctx.strokeStyle =
          t > 0.6
            ? `rgba(96,165,250,${0.5 * p.life})`
            : `rgba(255,31,31,${0.45 * p.life})`;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      // leading glow
      const grad = ctx.createRadialGradient(
        target.x, target.y, 0, target.x, target.y, 26
      );
      grad.addColorStop(0, "rgba(120,180,255,0.28)");
      grad.addColorStop(1, "rgba(120,180,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 26, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
    />
  );
}
