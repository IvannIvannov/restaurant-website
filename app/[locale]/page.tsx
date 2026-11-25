import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../lib/supabase/server";

import HeroVideo from "./HeroVideo";
import HomeHeader from "./HomeHeader";
import Reveal from "./Reveal";
import UpcomingEvents from "./UpcomingEvents";

import styles from "./page.module.css";
import sectionStyles from "./home-sections.module.css";

type Locale = "bg" | "en";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const FOOTER_LOGO =
  "https://res.cloudinary.com/dznyfk4z6/image/upload/c_limit,w_440/q_auto:good/f_auto/v1795081820/MAZU_Bar_Restaurant_Logo_eiqi6g.png";

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  const currentLocale = locale as Locale;

  const [messages, user] = await Promise.all([
    currentLocale === "bg"
      ? import("../../messages/bg.json").then((module) => module.default)
      : import("../../messages/en.json").then((module) => module.default),

    getCurrentUser(),
  ]);

  return (
    <main className={styles.main}>
      {/* HERO */}

      <section className={styles.hero}>
        <HeroVideo />

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
              prefetch={false}
            >
              {messages.hero.reserve}
            </Link>

            <Link
              href={`/${currentLocale}/menu`}
              className={styles.secondaryButton}
              prefetch={false}
            >
              {messages.hero.menu}
            </Link>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}

      <UpcomingEvents locale={currentLocale} />

      {/* RESERVATION / MENU */}

      <section id="booking" className={styles.actionsSection}>
        <Reveal>
          <div className={styles.actionsHeader}>
            <p className={styles.sectionEyebrow}>{messages.actions.eyebrow}</p>

            <h2 className={styles.actionsTitle}>{messages.actions.title}</h2>
          </div>
        </Reveal>

        <div className={styles.actionsGrid}>
          <Reveal delay={0.04}>
            <article className={`${styles.actionCard} ${styles.bookingCard}`}>
              <div className={styles.actionOverlay} />

              <div className={styles.actionContent}>
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
                    prefetch={false}
                  >
                    {messages.actions.bookingButton}

                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className={`${styles.actionCard} ${styles.menuCard}`}>
              <div className={styles.actionOverlay} />

              <div className={styles.actionContent}>
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
                    prefetch={false}
                  >
                    {messages.actions.menuButton}

                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* SPECIAL OCCASIONS */}

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
              <Reveal key={event.title} delay={index * 0.07}>
                <article className={sectionStyles.eventCard}>
                  <div className={sectionStyles.eventCardInner}>
                    <div className={sectionStyles.eventTop}>
                      <span className={sectionStyles.eventNumber}>
                        0{index + 1}
                      </span>

                      <span className={sectionStyles.eventTag}>
                        {event.tag}
                      </span>
                    </div>

                    <div className={sectionStyles.eventContent}>
                      <h3>{event.title}</h3>

                      <p>{event.description}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}

      <section id="contact" className={sectionStyles.contactSection}>
        <div className={sectionStyles.contactGrid}>
          <Reveal>
            <div className={sectionStyles.contactIntro}>
              <h2>{messages.contact.title}</h2>

              <p>{messages.contact.description}</p>

              <div className={sectionStyles.contactActions}>
                <Link
                  href={`/${currentLocale}/reservations`}
                  className={sectionStyles.primaryContactButton}
                  prefetch={false}
                >
                  {messages.contact.reserve}
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
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

      {/* FOOTER */}

      <footer className={sectionStyles.footer}>
        <div className={sectionStyles.footerInner}>
          <div className={sectionStyles.footerTop}>
            <div className={sectionStyles.footerBrand}>
              <Link
                href={`/${currentLocale}`}
                className={sectionStyles.footerLogoLink}
                aria-label={
                  currentLocale === "bg"
                    ? "MAZU Bar Restaurant — начална страница"
                    : "MAZU Bar Restaurant — homepage"
                }
              >
                <Image
                  src={FOOTER_LOGO}
                  alt="MAZU Bar Restaurant"
                  width={220}
                  height={220}
                  className={sectionStyles.footerLogoImage}
                  unoptimized
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <p>{messages.footer.description}</p>
            </div>

            <nav
              className={sectionStyles.footerNavigation}
              aria-label={
                currentLocale === "bg"
                  ? "Навигация във футъра"
                  : "Footer navigation"
              }
            >
              <a href="#upcoming-events">{messages.navigation.events}</a>

              <Link href={`/${currentLocale}/menu`} prefetch={false}>
                {messages.navigation.menu}
              </Link>

              <a href="#events">{messages.footer.specialOccasions}</a>

              <a href="#contact">{messages.navigation.contact}</a>
            </nav>
          </div>

          <div className={sectionStyles.footerBottom}>
            <span>{messages.footer.copyright}</span>

            <div className={sectionStyles.footerLanguages}>
              <Link
                href="/bg"
                hrefLang="bg"
                prefetch={false}
                aria-current={currentLocale === "bg" ? "page" : undefined}
                className={
                  currentLocale === "bg" ? sectionStyles.activeLanguage : ""
                }
              >
                BG
              </Link>

              <span aria-hidden="true">/</span>

              <Link
                href="/en"
                hrefLang="en"
                prefetch={false}
                aria-current={currentLocale === "en" ? "page" : undefined}
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
