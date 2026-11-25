"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useAuthModal } from "./AuthModalProvider";

import styles from "./home-header.module.css";

type Locale = "bg" | "en";

type HomeHeaderProps = {
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

const LOGO_URL =
  "https://res.cloudinary.com/dznyfk4z6/image/upload/c_limit,w_440/q_auto:good/f_auto/v1795081820/MAZU_Bar_Restaurant_Logo_eiqi6g.png";

export default function HomeHeader({
  locale,
  isLoggedIn,
  labels,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleResize = () => {
      if (window.innerWidth > 850) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);

        window.requestAnimationFrame(() => {
          mobileToggleRef.current?.focus();
        });
      }
    };

    window.addEventListener("resize", handleResize);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    closeMobileMenu();
    openLogin();
  };

  const mobileMenuLabel = mobileMenuOpen
    ? locale === "bg"
      ? "Затвори меню"
      : "Close menu"
    : locale === "bg"
      ? "Отвори меню"
      : "Open menu";

  const specialOccasionsLabel =
    locale === "bg" ? "Специални поводи" : "Special occasions";

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <nav
          className={styles.navigation}
          aria-label={locale === "bg" ? "Основна навигация" : "Main navigation"}
        >
          <a href="#upcoming-events">{labels.events}</a>

          <Link href={`/${locale}/menu`} prefetch={false}>
            {labels.menu}
          </Link>

          <a href="#events">{specialOccasionsLabel}</a>

          <a href="#contact">{labels.contact}</a>
        </nav>

        <Link
          href={`/${locale}`}
          className={styles.logo}
          aria-label={
            locale === "bg"
              ? "MAZU Bar Restaurant — начална страница"
              : "MAZU Bar Restaurant — homepage"
          }
        >
          <Image
            src={LOGO_URL}
            alt="MAZU Bar Restaurant"
            width={220}
            height={220}
            className={styles.logoImage}
            unoptimized
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        <div className={styles.actions}>
          <div
            className={styles.languages}
            aria-label={
              locale === "bg" ? "Избор на език" : "Language selection"
            }
          >
            <Link
              href="/bg"
              className={locale === "bg" ? styles.activeLanguage : ""}
              aria-current={locale === "bg" ? "page" : undefined}
              hrefLang="bg"
              prefetch={false}
            >
              BG
            </Link>

            <span aria-hidden="true">/</span>

            <Link
              href="/en"
              className={locale === "en" ? styles.activeLanguage : ""}
              aria-current={locale === "en" ? "page" : undefined}
              hrefLang="en"
              prefetch={false}
            >
              EN
            </Link>
          </div>

          {isLoggedIn ? (
            <Link
              href={`/${locale}/account`}
              className={styles.accountButton}
              prefetch={false}
            >
              {labels.account}
            </Link>
          ) : (
            <button
              type="button"
              className={styles.loginButton}
              onClick={handleLogin}
            >
              {labels.login}
            </button>
          )}

          <Link
            href={`/${locale}/reservations`}
            className={styles.reserveButton}
          >
            <span>{labels.reserve}</span>

            <span className={styles.reserveArrow} aria-hidden="true">
              ↗
            </span>
          </Link>

          <button
            ref={mobileToggleRef}
            type="button"
            className={`${styles.mobileToggle} ${
              mobileMenuOpen ? styles.mobileToggleOpen : ""
            }`}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuOpen ? "mobile-navigation" : undefined}
            aria-label={mobileMenuLabel}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            className={styles.mobileMenu}
            aria-label={
              locale === "bg" ? "Мобилна навигация" : "Mobile navigation"
            }
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -10,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    y: -8,
                  }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,

              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <a href="#upcoming-events" onClick={closeMobileMenu}>
              {labels.events}
            </a>

            <Link
              href={`/${locale}/menu`}
              onClick={closeMobileMenu}
              prefetch={false}
            >
              {labels.menu}
            </Link>

            <a href="#events" onClick={closeMobileMenu}>
              {specialOccasionsLabel}
            </a>

            <a href="#contact" onClick={closeMobileMenu}>
              {labels.contact}
            </a>

            <Link
              href={`/${locale}/reservations`}
              onClick={closeMobileMenu}
              prefetch={false}
            >
              {labels.reserve}
            </Link>

            {isLoggedIn ? (
              <Link
                href={`/${locale}/account`}
                onClick={closeMobileMenu}
                prefetch={false}
              >
                {labels.account}
              </Link>
            ) : (
              <button type="button" onClick={handleLogin}>
                {labels.login}
              </button>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
