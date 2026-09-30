"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./state.module.css";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const pathname = usePathname();

  const isEnglish = pathname?.startsWith("/en");

  const content = isEnglish
    ? {
        eyebrow: "Something went wrong",
        title: "We couldn't",
        titleAccent: " load the page.",
        description:
          "A temporary problem occurred. Try again or return to the home page.",
        retry: "Try again",
        home: "Back to home",
        homeHref: "/en",
      }
    : {
        eyebrow: "Нещо се обърка",
        title: "Не успяхме да",
        titleAccent: " заредим страницата.",
        description:
          "Възникна временен проблем. Опитай отново или се върни към началната страница.",
        retry: "Опитай отново",
        home: "Към началото",
        homeHref: "/bg",
      };

  return (
    <main className={styles.main}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.content}>
        <span className={styles.brand}>RESTAURANT</span>

        <span className={styles.code}>Oops</span>

        <p className={styles.eyebrow}>{content.eyebrow}</p>

        <h1 className={styles.title}>
          {content.title}
          <span>{content.titleAccent}</span>
        </h1>

        <p className={styles.description}>{content.description}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={reset}
          >
            <span>{content.retry}</span>

            <span className={styles.buttonArrow}>↻</span>
          </button>

          <Link href={content.homeHref} className={styles.secondaryButton}>
            {content.home}
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
