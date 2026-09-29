import Link from "next/link";

import styles from "./state.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.content}>
        <span className={styles.brand}>RESTAURANT</span>

        <span className={styles.code}>404</span>

        <p className={styles.eyebrow}>Страницата не е намерена</p>

        <h1 className={styles.title}>
          Изглежда, че тази
          <span> страница липсва.</span>
        </h1>

        <p className={styles.description}>
          Адресът може да е променен или страницата вече да не съществува. Можеш
          да се върнеш към началната страница и да продължиш оттам.
        </p>

        <div className={styles.actions}>
          <Link href="/bg" className={styles.primaryButton}>
            <span>Към началото</span>

            <span className={styles.buttonArrow}>↗</span>
          </Link>

          <Link href="/en" className={styles.secondaryButton}>
            English version
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
