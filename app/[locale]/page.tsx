import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import HomeHeader from "./HomeHeader";
import Reveal from "./Reveal";

import styles from "./page.module.css";
import sectionStyles from "./home-sections.module.css";

type Locale = "bg" | "en";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const eventImageClasses = [
  "eventImageOne",
  "eventImageTwo",
  "eventImageThree",
] as const;

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

        <HomeHeader
          locale={currentLocale}
          isLoggedIn={Boolean(user)}
          labels={{
            menu: messages.navigation.menu,
            events: messages.navigation.events,
            contact: messages.navigation.contact,
            reserve: messages.navigation.reserve,
            login: messages.navigation.login,
            account: messages.navigation.account,
          }}
        />

        <div className={styles.sideLabel}>
          <span>Dining</span>
          <span>·</span>
          <span>Moments</span>
        </div>

        <Reveal delay={0.12} distance={22}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{messages.hero.eyebrow}</p>

            <h1 className={styles.heroTitle}>
              <span>{messages.hero.titleLine1}</span>

              <span>{messages.hero.titleLine2}</span>
            </h1>

            <p className={styles.heroDescription}>
              {messages.hero.description}
            </p>

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
        </Reveal>

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
        <Reveal>
          <div className={styles.actionsHeader}>
            <p className={styles.sectionEyebrow}>{messages.actions.eyebrow}</p>

            <h2 className={styles.actionsTitle}>{messages.actions.title}</h2>
          </div>
        </Reveal>

        <div className={styles.actionsGrid}>
          <Reveal>
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
          </Reveal>

          <Reveal delay={0.12}>
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
          </Reveal>
        </div>
      </section>

      <section id="events" className={sectionStyles.eventsSection}>
        <div className={sectionStyles.sectionContainer}>
          <Reveal>
            <div className={sectionStyles.sectionHeading}>
              <div className={sectionStyles.sectionHeadingText}>
                <p className={sectionStyles.eyebrow}>
                  {messages.events.eyebrow}
                </p>

                <h2>{messages.events.title}</h2>
              </div>

              <p className={sectionStyles.sectionDescription}>
                {messages.events.description}
              </p>
            </div>
          </Reveal>

          <div className={sectionStyles.eventsGrid}>
            {messages.events.items.map((event, index) => (
              <Reveal key={event.title} delay={index * 0.1}>
                <article className={sectionStyles.eventCard}>
                  <div
                    className={`${sectionStyles.eventImage} ${
                      sectionStyles[eventImageClasses[index]]
                    }`}
                  />

                  <div className={sectionStyles.eventOverlay} />

                  <div className={sectionStyles.eventTop}>
                    <span className={sectionStyles.eventTag}>{event.tag}</span>
                  </div>

                  <div className={sectionStyles.eventContent}>
                    <div className={sectionStyles.eventText}>
                      <h3>{event.title}</h3>

                      <p>{event.description}</p>
                    </div>

                    <span
                      className={sectionStyles.eventArrow}
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={sectionStyles.contactSection}>
        <div className={sectionStyles.contactGrid}>
          <Reveal>
            <div className={sectionStyles.contactIntro}>
              <p className={sectionStyles.eyebrow}>
                {messages.contact.eyebrow}
              </p>

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
          </Reveal>

          <Reveal delay={0.12} distance={20}>
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
          </Reveal>
        </div>
      </section>

      <section className={sectionStyles.reviewsSection}>
        <div className={sectionStyles.reviewsHeader}>
          <Reveal>
            <div className={sectionStyles.reviewsHeading}>
              <p className={sectionStyles.eyebrow}>
                {messages.reviews.eyebrow}
              </p>

              <h2>{messages.reviews.title}</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1} distance={18}>
            <p className={sectionStyles.reviewsDescription}>
              {messages.reviews.description}
            </p>
          </Reveal>
        </div>

        <div className={sectionStyles.reviewsGrid}>
          {messages.reviews.items.map((review, index) => (
            <Reveal key={review.name} delay={index * 0.1}>
              <article className={sectionStyles.reviewCard}>
                <div>
                  <div className={sectionStyles.reviewTop}>
                    <span
                      className={sectionStyles.stars}
                      aria-label="5 out of 5 stars"
                    >
                      ★★★★★
                    </span>
                  </div>

                  <p className={sectionStyles.reviewText}>“{review.text}”</p>
                </div>

                <div className={sectionStyles.reviewAuthor}>
                  <div className={sectionStyles.reviewAvatar}>
                    {review.initials}
                  </div>

                  <div className={sectionStyles.reviewAuthorInfo}>
                    <strong>{review.name}</strong>

                    <span>★ 5.0</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
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
