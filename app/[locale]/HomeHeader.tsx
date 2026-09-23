"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./home-header.module.css";

type Locale = "bg" | "en";

type Props = {
  locale: Locale;
  isLoggedIn: boolean;

  labels: {
    menu: string;
    events: string;
    contact: string;
    reserve: string;
    login: string;
    account: string;
  };
};

export default function HomeHeader({ locale, isLoggedIn, labels }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.logo} onClick={closeMenu}>
          RESTAURANT
        </Link>

        <nav className={styles.desktopNavigation}>
          <Link href={`/${locale}/menu`}>{labels.menu}</Link>

          <a href="#events">{labels.events}</a>

          <a href="#contact">{labels.contact}</a>
        </nav>

        <div className={styles.desktopActions}>
          <div className={styles.languageSwitcher}>
            <Link
              href="/bg"
              className={locale === "bg" ? styles.activeLanguage : ""}
            >
              BG
            </Link>

            <span>/</span>

            <Link
              href="/en"
              className={locale === "en" ? styles.activeLanguage : ""}
            >
              EN
            </Link>
          </div>

          <Link
            href={isLoggedIn ? `/${locale}/account` : `/${locale}/login`}
            className={styles.accountLink}
          >
            {isLoggedIn ? labels.account : labels.login}
          </Link>

          <Link
            href={`/${locale}/reservations`}
            className={styles.reserveButton}
          >
            {labels.reserve}
          </Link>
        </div>

        <button
          type="button"
          className={`${styles.menuButton} ${
            menuOpen ? styles.menuButtonOpen : ""
          }`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.mobileMenuContent}>
          <nav className={styles.mobileNavigation}>
            <Link href={`/${locale}/menu`} onClick={closeMenu}>
              <span>01</span>

              {labels.menu}
            </Link>

            <a href="#events" onClick={closeMenu}>
              <span>02</span>

              {labels.events}
            </a>

            <a href="#contact" onClick={closeMenu}>
              <span>03</span>

              {labels.contact}
            </a>

            <Link
              href={isLoggedIn ? `/${locale}/account` : `/${locale}/login`}
              onClick={closeMenu}
            >
              <span>04</span>

              {isLoggedIn ? labels.account : labels.login}
            </Link>
          </nav>

          <div className={styles.mobileMenuBottom}>
            <div className={styles.mobileLanguages}>
              <Link
                href="/bg"
                onClick={closeMenu}
                className={locale === "bg" ? styles.activeLanguage : ""}
              >
                BG
              </Link>

              <span>/</span>

              <Link
                href="/en"
                onClick={closeMenu}
                className={locale === "en" ? styles.activeLanguage : ""}
              >
                EN
              </Link>
            </div>

            <Link
              href={`/${locale}/reservations`}
              className={styles.mobileReserveButton}
              onClick={closeMenu}
            >
              {labels.reserve}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
