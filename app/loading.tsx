"use client";

import { usePathname } from "next/navigation";

import styles from "./state.module.css";

export default function Loading() {
  const pathname = usePathname();

  const isEnglish = pathname?.startsWith("/en");

  const loadingLabel = isEnglish ? "Loading" : "Зареждане";

  const loadingText = isEnglish
    ? "Preparing your experience"
    : "Подготвяме преживяването";

  return (
    <main className={`${styles.main} ${styles.loadingMain}`}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.loadingContent}>
        <span className={styles.brand}>RESTAURANT</span>

        <div
          className={styles.loadingMark}
          aria-label={loadingLabel}
          role="status"
        >
          <span />
          <span />
          <span />
        </div>

        <p className={styles.loadingText}>{loadingText}</p>
      </section>
    </main>
  );
}
