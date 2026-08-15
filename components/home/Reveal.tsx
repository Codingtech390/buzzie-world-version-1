"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { durations, easings } from "@/config/animations";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

const viewport = {
  once: true,
  amount: 0.16,
};

const baseVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        delay,
        ease: easings.premium,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants || baseVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewport, once }}
    >
      {children}
    </motion.div>
  );
}
