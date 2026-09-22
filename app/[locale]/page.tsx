import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

type Locale = "bg" | "en";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  const currentLocale = locale as Locale;

  const messages =
    currentLocale === "bg"
      ? (await import("../../src/messages/bg.json")).default
      : (await import("../../src/messages/en.json")).default;

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGlow} />

        <header className={styles.header}>
          <div className={styles.logo}>RESTAURANT</div>

          <nav className={styles.navigation}>
            <a href="#experience">{messages.navigation.experience}</a>

            <a href="#menu">{messages.navigation.menu}</a>

            <a href="#events">{messages.navigation.events}</a>

            <a href="#contact">{messages.navigation.contact}</a>
          </nav>

          <div className={styles.headerActions}>
            <div className={styles.languageSwitcher}>
              <Link
                href="/bg"
                className={
                  currentLocale === "bg"
                    ? styles.languageActive
                    : styles.languageInactive
                }
              >
                BG
              </Link>

              <span>/</span>

              <Link
                href="/en"
                className={
                  currentLocale === "en"
                    ? styles.languageActive
                    : styles.languageInactive
                }
              >
                EN
              </Link>
            </div>

            <button className={styles.reserveHeaderButton}>
              {messages.navigation.reserve}
            </button>
          </div>
        </header>

        <div className={styles.sideLabel}>
          <span>EST.</span>
          <span>2026</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{messages.hero.eyebrow}</p>

          <h1 className={styles.heroTitle}>
            <span>{messages.hero.titleLine1}</span>
            <span>{messages.hero.titleLine2}</span>
          </h1>

          <p className={styles.heroDescription}>{messages.hero.description}</p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>
              {messages.hero.reserve}
            </button>

            <button className={styles.secondaryButton}>
              {messages.hero.menu}
            </button>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomLocation}>
            <span className={styles.bottomLine} />
            <span>Restaurant experience</span>
          </div>

          <div className={styles.scrollIndicator}>
            <span>{messages.hero.scroll}</span>

            <div className={styles.scrollLine}>
              <span />
            </div>
          </div>

          <div className={styles.bottomInfo}>
            <span>Food</span>
            <span>Drinks</span>
            <span>Atmosphere</span>
          </div>
        </div>
      </section>
    </main>
  );
}
