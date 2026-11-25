"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

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
  "https://res.cloudinary.com/dznyfk4z6/image/upload/c_limit,w_320/q_auto:good/f_auto/v1795081820/MAZU_Bar_Restaurant_Logo_eiqi6g.png";

function LanguageSwitcher({
  locale,
  className,
}: {
  locale: Locale;
  className: string;
}) {
  return (
    <div
      className={className}
      role="group"
      aria-label={locale === "bg" ? "Избор на език" : "Language selection"}
    >
      <Link
        href="/bg"
        className={locale === "bg" ? styles.activeLanguage : ""}
        aria-current={locale === "bg" ? "page" : undefined}
        aria-label="Български"
        hrefLang="bg"
        lang="bg"
        prefetch={false}
      >
        BG
      </Link>

      <span aria-hidden="true">/</span>

      <Link
        href="/en"
        className={locale === "en" ? styles.activeLanguage : ""}
        aria-current={locale === "en" ? "page" : undefined}
        aria-label="English"
        hrefLang="en"
        lang="en"
        prefetch={false}
      >
        EN
      </Link>
    </div>
  );
}

export default function HomeHeader({
  locale,
  isLoggedIn,
  labels,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 851px)");

    const handleViewportChange = () => {
      if (desktopQuery.matches) {
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

    desktopQuery.addEventListener("change", handleViewportChange);

    document.addEventListener("keydown", handleKeyDown);

    handleViewportChange();

    return () => {
      desktopQuery.removeEventListener("change", handleViewportChange);

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

        <LanguageSwitcher
          locale={locale}
          className={`${styles.languages} ${styles.mobileLanguages}`}
        />

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
            width={320}
            height={320}
            className={styles.logoImage}
            unoptimized
            loading="eager"
          />
        </Link>

        <div className={styles.actions}>
          <LanguageSwitcher
            locale={locale}
            className={`${styles.languages} ${styles.desktopLanguages}`}
          />

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
            prefetch={false}
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
            aria-controls="mobile-navigation"
            aria-label={mobileMenuLabel}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-label={locale === "bg" ? "Мобилна навигация" : "Mobile navigation"}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
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
      </nav>
    </header>
  );
}
