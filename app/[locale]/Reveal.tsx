"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

import styles from "./reveal.module.css";

type Props = {
  children: ReactNode;
  delay?: number;
  amount?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  amount = 0.12,
  className,
}: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const touchDevice = window.matchMedia("(hover: none), (pointer: coarse)");

    if (
      reducedMotion.matches ||
      touchDevice.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEntered(true);

        observer.disconnect();
      },
      {
        threshold: Math.max(0, Math.min(amount, 1)),
        rootMargin: "0px 0px -20px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [amount]);

  const classes = [
    styles.reveal,
    hasEntered ? styles.entered : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const animationStyle = {
    "--reveal-delay": `${Math.max(0, delay)}s`,
  } as CSSProperties;

  return (
    <div ref={elementRef} className={classes} style={animationStyle}>
      {children}
    </div>
  );
}
