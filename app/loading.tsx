import styles from "./state.module.css";

export default function Loading() {
  return (
    <main className={`${styles.main} ${styles.loadingMain}`}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.frame} />

      <section className={styles.loadingContent}>
        <span className={styles.brand}>RESTAURANT</span>

        <div
          className={styles.loadingMark}
          aria-label="Зареждане"
          role="status"
        >
          <span />
          <span />
          <span />
        </div>

        <p className={styles.loadingText}>Подготвяме преживяването</p>
      </section>
    </main>
  );
}
