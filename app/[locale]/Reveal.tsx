"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  className?: string;
  scale?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  delay = 0,
  duration = 0.75,
  distance = 24,
  direction = "up",
  className,
  scale = 1,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (shouldReduceMotion || direction === "none") {
      return {
        x: 0,
        y: 0,
      };
    }

    switch (direction) {
      case "down":
        return {
          x: 0,
          y: -distance,
        };

      case "left":
        return {
          x: distance,
          y: 0,
        };

      case "right":
        return {
          x: -distance,
          y: 0,
        };

      case "up":
      default:
        return {
          x: 0,
          y: distance,
        };
    }
  };

  const position = getInitialPosition();

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }
          : {
              opacity: 0,
              x: position.x,
              y: position.y,
              scale,
            }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once,
        amount: 0.16,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
