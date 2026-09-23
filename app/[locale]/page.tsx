import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import styles from "./page.module.css";
import sectionStyles from "./home-sections.module.css";

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

          <article className={`${styles.actionCard} ${styles.menuCard}`}>
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

      <section id="events" className={sectionStyles.eventsSection}>
        <div className={sectionStyles.sectionContainer}>
          <div className={sectionStyles.sectionHeading}>
            <div className={sectionStyles.sectionHeadingText}>
              <p className={sectionStyles.eyebrow}>{messages.events.eyebrow}</p>

              <h2>{messages.events.title}</h2>
            </div>

            <p className={sectionStyles.sectionDescription}>
              {messages.events.description}
            </p>
          </div>

          <div className={sectionStyles.eventsGrid}>
            {messages.events.items.map((event, index) => (
              <article key={event.title} className={sectionStyles.eventCard}>
                <div className={sectionStyles.eventCardInner}>
                  <div className={sectionStyles.eventTop}>
                    <span className={sectionStyles.eventNumber}>
                      0{index + 1}
                    </span>

                    <span className={sectionStyles.eventTag}>{event.tag}</span>
                  </div>

                  <div className={sectionStyles.eventContent}>
                    <h3>{event.title}</h3>

                    <p>{event.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={sectionStyles.contactSection}>
        <div className={sectionStyles.contactGrid}>
          <div className={sectionStyles.contactIntro}>
            <p className={sectionStyles.eyebrow}>{messages.contact.eyebrow}</p>

            <h2>{messages.contact.title}</h2>

            <p>{messages.contact.description}</p>

            <div className={sectionStyles.contactActions}>
              <Link
                href={`/${currentLocale}/reservations`}
                className={sectionStyles.primaryContactButton}
              >
                {messages.contact.reserve}
              </Link>

              <a
                href="mailto:contact@restaurant-demo.com"
                className={sectionStyles.secondaryContactButton}
              >
                {messages.contact.emailButton}
              </a>
            </div>
          </div>

          <div className={sectionStyles.contactDetails}>
            <div className={sectionStyles.contactItem}>
              <span className={sectionStyles.contactLabel}>
                {messages.contact.addressLabel}
              </span>

              <span className={sectionStyles.contactValue}>
                {messages.contact.address}
              </span>
            </div>

            <div className={sectionStyles.contactItem}>
              <span className={sectionStyles.contactLabel}>
                {messages.contact.hoursLabel}
              </span>

              <span className={sectionStyles.contactValue}>
                {messages.contact.hours}
              </span>
            </div>

            <div className={sectionStyles.contactItem}>
              <span className={sectionStyles.contactLabel}>
                {messages.contact.phoneLabel}
              </span>

              <a
                href="tel:+359881234567"
                className={sectionStyles.contactValue}
              >
                +359 88 123 4567
              </a>
            </div>

            <div className={sectionStyles.contactItem}>
              <span className={sectionStyles.contactLabel}>
                {messages.contact.emailLabel}
              </span>

              <a
                href="mailto:contact@restaurant-demo.com"
                className={sectionStyles.contactValue}
              >
                contact@restaurant-demo.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={sectionStyles.footer}>
        <div className={sectionStyles.footerInner}>
          <div className={sectionStyles.footerTop}>
            <div className={sectionStyles.footerBrand}>
              <span className={sectionStyles.footerLogo}>RESTAURANT</span>

              <p>{messages.footer.description}</p>
            </div>

            <div className={sectionStyles.footerLinks}>
              <div className={sectionStyles.footerColumn}>
                <span className={sectionStyles.footerColumnTitle}>
                  {messages.footer.navigation}
                </span>

                <Link href={`/${currentLocale}/menu`}>
                  {messages.navigation.menu}
                </Link>

                <Link href={`/${currentLocale}/reservations`}>
                  {messages.navigation.reserve}
                </Link>

                <a href="#events">{messages.navigation.events}</a>

                <a href="#contact">{messages.navigation.contact}</a>
              </div>

              <div className={sectionStyles.footerColumn}>
                <span className={sectionStyles.footerColumnTitle}>
                  {messages.footer.account}
                </span>

                <Link
                  href={
                    user
                      ? `/${currentLocale}/account`
                      : `/${currentLocale}/login`
                  }
                >
                  {user
                    ? messages.navigation.account
                    : messages.navigation.login}
                </Link>

                {!user && (
                  <Link href={`/${currentLocale}/register`}>
                    {messages.footer.register}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className={sectionStyles.footerBottom}>
            <span>© 2026 RESTAURANT · {messages.footer.demo}</span>

            <div className={sectionStyles.footerLanguages}>
              <Link
                href="/bg"
                className={
                  currentLocale === "bg" ? sectionStyles.activeLanguage : ""
                }
              >
                BG
              </Link>

              <span>/</span>

              <Link
                href="/en"
                className={
                  currentLocale === "en" ? sectionStyles.activeLanguage : ""
                }
              >
                EN
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
