import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

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
      ? (await import("../../messages/bg.json")).default
      : (await import("../../messages/en.json")).default;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGlow} />

        <header className={styles.header}>
          <div className={styles.logo}>RESTAURANT</div>

          <nav className={styles.navigation}>
            <Link href={`/${currentLocale}/reservations`}>
              {messages.navigation.reserve}
            </Link>

            <Link href={`/${currentLocale}/menu`}>
              {messages.navigation.menu}
            </Link>

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

            <Link
              href={
                user ? `/${currentLocale}/account` : `/${currentLocale}/login`
              }
              className={styles.accountHeaderLink}
            >
              {user ? messages.navigation.account : messages.navigation.login}
            </Link>

            <Link
              href={`/${currentLocale}/reservations`}
              className={styles.reserveHeaderButton}
            >
              {messages.navigation.reserve}
            </Link>
          </div>
        </header>

        <div className={styles.sideLabel}>
          <span>Dining</span>
          <span>·</span>
          <span>Moments</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{messages.hero.eyebrow}</p>

          <h1 className={styles.heroTitle}>
            <span>{messages.hero.titleLine1}</span>

            <span>{messages.hero.titleLine2}</span>
          </h1>

          <p className={styles.heroDescription}>{messages.hero.description}</p>

          <div className={styles.heroButtons}>
            <Link
              href={`/${currentLocale}/reservations`}
              className={styles.primaryButton}
            >
              {messages.hero.reserve}
            </Link>

            <Link
              href={`/${currentLocale}/menu`}
              className={styles.secondaryButton}
            >
              {messages.hero.menu}
            </Link>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomLocation}>
            <span className={styles.bottomLine} />

            <span>{messages.hero.bottomLabel}</span>
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

      <section id="booking" className={styles.actionsSection}>
        <div className={styles.actionsHeader}>
          <p className={styles.sectionEyebrow}>{messages.actions.eyebrow}</p>

          <h2 className={styles.actionsTitle}>{messages.actions.title}</h2>
        </div>

        <div className={styles.actionsGrid}>
          <article className={`${styles.actionCard} ${styles.bookingCard}`}>
            <div className={styles.actionOverlay} />

            <div className={styles.actionContent}>
              <span className={styles.actionNumber}>01</span>

              <div>
                <p className={styles.actionLabel}>
                  {messages.actions.bookingLabel}
                </p>

                <h3>{messages.actions.bookingTitle}</h3>

                <p className={styles.actionDescription}>
                  {messages.actions.bookingDescription}
                </p>

                <Link
                  href={`/${currentLocale}/reservations`}
                  className={styles.actionButton}
                >
                  {messages.actions.bookingButton}

                  <span>↗</span>
                </Link>
              </div>
            </div>
          </article>

          <article
            id="menu"
            className={`${styles.actionCard} ${styles.menuCard}`}
          >
            <div className={styles.actionOverlay} />

            <div className={styles.actionContent}>
              <span className={styles.actionNumber}>02</span>

              <div>
                <p className={styles.actionLabel}>
                  {messages.actions.menuLabel}
                </p>

                <h3>{messages.actions.menuTitle}</h3>

                <p className={styles.actionDescription}>
                  {messages.actions.menuDescription}
                </p>

                <Link
                  href={`/${currentLocale}/menu`}
                  className={styles.actionButton}
                >
                  {messages.actions.menuButton}

                  <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
