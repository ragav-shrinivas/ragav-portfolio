"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const directions = {
  up: { y: 48, x: 0 },
  down: { y: -48, x: 0 },
  left: { x: 64, y: 0 },
  right: { x: -64, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
  amount = 0.3,
}: {
  children: ReactNode;
  from?: keyof typeof directions;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...directions[from] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
