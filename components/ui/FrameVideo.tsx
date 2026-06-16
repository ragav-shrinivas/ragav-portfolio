"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Auto-playing, looping frame-sequence "video" rendered to a canvas.
 * Used for ambient background footage (hero + works) without shipping a heavy
 * mp4. Frames are decoded once and cycled at `fps`. Cover-fit, GPU-composited,
 * high-quality upscaling. Loop starts as soon as a small batch is ready so
 * there's no long black wait while the full HD sequence streams in.
 */
export function FrameVideo({
  path,
  count,
  pad = 3,
  prefix = "ezgif-frame-",
  ext = "jpg",
  fps = 24,
  className,
  onProgress,
  onReady,
}: {
  path: string;
  count: number;
  pad?: number;
  prefix?: string;
  ext?: string;
  fps?: number;
  className?: string;
  onProgress?: (ratio: number) => void;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressCb = useRef(onProgress);
  const readyCb = useRef(onReady);
  progressCb.current = onProgress;
  readyCb.current = onReady;

  useEffect(() => {
    let raf = 0;
    let frame = 0;
    let last = 0;
    const interval = 1000 / fps;
    let mounted = true;
    let started = false;
    // Begin looping once this many frames are ready (or all, if fewer).
    const startThreshold = Math.min(count, 24);

    const imgs: HTMLImageElement[] = new Array(count);
    let loaded = 0;
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = i < startThreshold ? "high" : "low";
      img.src = `${path}${prefix}${String(i + 1).padStart(pad, "0")}.${ext}`;
      img.onload = img.onerror = () => {
        if (img.naturalWidth) imgs[i] = img;
        loaded++;
        progressCb.current?.(loaded / count);
        imagesRef.current = imgs.filter(Boolean);
        if (!started && imagesRef.current.length >= startThreshold) {
          started = true;
          readyCb.current?.();
          raf = requestAnimationFrame(loop);
        }
      };
    }

    const draw = () => {
      const canvas = canvasRef.current;
      const list = imagesRef.current;
      if (!canvas || !list.length) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      const img = list[frame % list.length];
      if (!img) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = W / H;
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = H;
        dw = H * ir;
        dx = (W - dw) / 2;
        dy = 0;
      } else {
        dw = W;
        dh = W / ir;
        dx = 0;
        dy = (H - dh) / 2;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const loop = (t: number) => {
      if (!mounted) return;
      if (t - last >= interval) {
        last = t;
        frame++;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, [path, count, pad, prefix, ext, fps]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("h-full w-full", className)}
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    />
  );
}
