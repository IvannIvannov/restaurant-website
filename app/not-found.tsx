"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./state.module.css";

export default function NotFound() {
  const pathname = usePathname();

  const isEnglish = pathname?.startsWith("/en");

  const content = isEnglish
    ? {
        eyebrow: "Page not found",
        title: "It looks like this",
        titleAccent: " page is missing.",
        description:
          "The address may have changed or the page may no longer exist. Return to the home page and continue from there.",
        home: "Back to home",
        homeHref: "/en",
        language: "Българска версия",
        languageHref: "/bg",
      }
    : {
        eyebrow: "Страницата не е намерена",
        title: "Изглежда, че тази",
        titleAccent: " страница липсва.",
        description:
          "Адресът може да е променен или страницата вече да не съществува. Можеш да се върнеш към началната страница и да продължиш оттам.",
        home: "Към началото",
        homeHref: "/bg",
        language: "English version",
        languageHref: "/en",
      };

  return (
    <main className={styles.main}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.content}>
        <span className={styles.brand}>RESTAURANT</span>

        <span className={styles.code}>404</span>

        <p className={styles.eyebrow}>{content.eyebrow}</p>

        <h1 className={styles.title}>
          {content.title}
          <span>{content.titleAccent}</span>
        </h1>

        <p className={styles.description}>{content.description}</p>

        <div className={styles.actions}>
          <Link href={content.homeHref} className={styles.primaryButton}>
            <span>{content.home}</span>

            <span className={styles.buttonArrow}>↗</span>
          </Link>

          <Link href={content.languageHref} className={styles.secondaryButton}>
            {content.language}
          </Link>
        </div>
      </section>

      <div className={styles.footerText}>
        <span>DINING</span>
        <span>·</span>
        <span>MOMENTS</span>
      </div>
    </main>
  );
}
