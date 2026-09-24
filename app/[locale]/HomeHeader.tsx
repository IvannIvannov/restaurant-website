"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

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

export default function HomeHeader({
  locale,
  isLoggedIn,
  labels,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    closeMobileMenu();

    openLogin();
  };

  return (
    <motion.header
      className={styles.header}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: -16,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,

        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={styles.headerInner}>
        <Link href={`/${locale}`} className={styles.logo}>
          RESTAURANT
        </Link>

        <nav
          className={styles.navigation}
          aria-label={locale === "bg" ? "Основна навигация" : "Main navigation"}
        >
          <Link href={`/${locale}/menu`}>{labels.menu}</Link>

          <a href="#events">{labels.events}</a>

          <a href="#contact">{labels.contact}</a>
        </nav>

        <div className={styles.actions}>
          <div className={styles.languages}>
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

          {isLoggedIn ? (
            <Link href={`/${locale}/account`} className={styles.accountButton}>
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
            type="button"
            className={`${styles.mobileToggle} ${
              mobileMenuOpen ? styles.mobileToggleOpen : ""
            }`}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-label={locale === "bg" ? "Отвори меню" : "Open menu"}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
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
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,

              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href={`/${locale}/menu`} onClick={closeMobileMenu}>
              {labels.menu}
            </Link>

            <a href="#events" onClick={closeMobileMenu}>
              {labels.events}
            </a>

            <a href="#contact" onClick={closeMobileMenu}>
              {labels.contact}
            </a>

            <Link href={`/${locale}/reservations`} onClick={closeMobileMenu}>
              {labels.reserve}
            </Link>

            {isLoggedIn ? (
              <Link href={`/${locale}/account`} onClick={closeMobileMenu}>
                {labels.account}
              </Link>
            ) : (
              <button type="button" onClick={handleLogin}>
                {labels.login}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
