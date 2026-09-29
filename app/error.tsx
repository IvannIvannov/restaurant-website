"use client";

import Link from "next/link";

import styles from "./state.module.css";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className={styles.main}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.content}>
        <span className={styles.brand}>RESTAURANT</span>

        <span className={styles.code}>Oops</span>

        <p className={styles.eyebrow}>Нещо се обърка</p>

        <h1 className={styles.title}>
          Не успяхме да
          <span> заредим страницата.</span>
        </h1>

        <p className={styles.description}>
          Възникна временен проблем. Опитай отново или се върни към началната
          страница.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={reset}
          >
            <span>Опитай отново</span>

            <span className={styles.buttonArrow}>↻</span>
          </button>

          <Link href="/bg" className={styles.secondaryButton}>
            Към началото
          </Link>
        </div>

        {error.digest && (
          <span className={styles.errorReference}>
            Reference: {error.digest}
          </span>
        )}
      </section>

      <div className={styles.footerText}>
        <span>DINING</span>
        <span>·</span>
        <span>MOMENTS</span>
      </div>
    </main>
  );
}
