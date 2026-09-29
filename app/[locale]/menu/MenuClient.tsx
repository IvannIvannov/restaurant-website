"use client";

import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "@openpageflip/core/styles.css";
import { type Book, FlipBook, Page } from "@openpageflip/react";

import styles from "./menu.module.css";

type Locale = "bg" | "en";

type MenuClientProps = {
  locale: Locale;
};

type FlipEvent = {
  readonly page: number;
};

const rawMenuPages = [
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/1.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/2.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/3.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/4.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334360/5.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/6.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/7.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/8.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334359/9.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/10.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/11.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/12.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334361/13.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334362/14.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334362/15.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334362/16.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334362/17.png",
  "https://res.cloudinary.com/mxjelcos/image/upload/v1790334362/18.png",
];

const getPreviewUrl = (url: string) => {
  return url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto:good,w_1000/",
  );
};

const getZoomUrl = (url: string) => {
  return url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto:best,w_2200/",
  );
};

const cloudinaryLoader = ({ src }: ImageLoaderProps) => {
  return src;
};

const translations = {
  bg: {
    back: "Начало",
    eyebrow: "Ресторантско меню",
    title: "МЕНЮ",
    description:
      "Разлистете нашето меню и открийте селекцията от ястия, напитки и вкусове.",
    previous: "Предишна",
    next: "Следваща",
    page: "Страница",
    of: "от",
    zoomHint: "Натиснете върху страницата, за да я увеличите",
    close: "Затвори",
    reserve: "Запази маса",
  },

  en: {
    back: "Home",
    eyebrow: "Restaurant menu",
    title: "MENU",
    description:
      "Browse our menu and discover a selection of dishes, drinks and flavours.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    zoomHint: "Click a page to enlarge it",
    close: "Close",
    reserve: "Reserve a table",
  },
};

export default function MenuClient({ locale }: MenuClientProps) {
  const t = translations[locale];

  const bookRef = useRef<Book>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [zoomedPage, setZoomedPage] = useState<number | null>(null);

  const menuPages = useMemo(
    () =>
      rawMenuPages.map((url) => ({
        preview: getPreviewUrl(url),
        zoom: getZoomUrl(url),
      })),
    [],
  );

  useEffect(() => {
    const firstPages = menuPages.slice(0, 8);

    firstPages.forEach((page) => {
      const image = new window.Image();

      image.decoding = "async";

      image.src = page.preview;
    });

    let cancelled = false;

    const remaining = menuPages.slice(8);

    const preloadRemaining = async () => {
      for (const page of remaining) {
        if (cancelled) {
          return;
        }

        const image = new window.Image();

        image.decoding = "async";

        image.src = page.preview;

        try {
          await image.decode();
        } catch {
          // Изображението пак остава заявено и кеширано.
        }

        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 60);
        });
      }
    };

    const timeoutId = window.setTimeout(() => {
      void preloadRemaining();
    }, 900);

    return () => {
      cancelled = true;

      window.clearTimeout(timeoutId);
    };
  }, [menuPages]);

  useEffect(() => {
    if (zoomedPage === null) {
      return;
    }

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [zoomedPage]);

  const handleNext = useCallback(() => {
    bookRef.current?.flipNext();
  }, []);

  const handlePrevious = useCallback(() => {
    bookRef.current?.flipPrev();
  }, []);

  const handleFlip = useCallback((event: FlipEvent) => {
    setCurrentPage(event.page);
  }, []);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomedPage(null);

        return;
      }

      if (zoomedPage !== null) {
        return;
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleNext, handlePrevious, zoomedPage]);

  const canGoPrevious = currentPage > 0;

  const canGoNext = currentPage < menuPages.length - 1;

  const isCover = currentPage === 0;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.backLink}>
          <span>←</span>

          {t.back}
        </Link>

        <span className={styles.brand}>RESTAURANT</span>

        <div className={styles.languageSwitcher}>
          <Link
            href="/bg/menu"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/menu"
            className={locale === "en" ? styles.activeLanguage : ""}
          >
            EN
          </Link>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>

        <h1>{t.title}</h1>

        <p className={styles.description}>{t.description}</p>
      </section>

      <section className={styles.bookSection}>
        <div className={styles.bookStage}>
          <button
            type="button"
            className={`${styles.navigationButton} ${styles.previousButton}`}
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            aria-label={t.previous}
          >
            ←
          </button>

          <div className={styles.bookFrame}>
            <div
              className={`${styles.bookPositioner} ${
                isCover ? styles.bookPositionerCover : ""
              }`}
            >
              <FlipBook
                ref={bookRef}
                className={styles.flipBook}
                width={460}
                height={650}
                size="stretch"
                cover
                onFlip={handleFlip}
              >
                {menuPages.map((page, index) => {
                  const content = (
                    <div className={styles.menuPage}>
                      <Image
                        loader={cloudinaryLoader}
                        unoptimized
                        src={page.preview}
                        alt={`${t.page} ${index + 1}`}
                        width={1000}
                        height={1416}
                        priority={index <= 5}
                        draggable={false}
                        sizes="(min-width: 900px) 460px, 92vw"
                      />

                      <button
                        type="button"
                        className={styles.zoomButton}
                        onClick={(event) => {
                          event.stopPropagation();

                          setZoomedPage(index);
                        }}
                        aria-label={`${t.page} ${index + 1}`}
                      >
                        ⤢
                      </button>
                    </div>
                  );

                  if (index === 0 || index === menuPages.length - 1) {
                    return (
                      <Page
                        key={index}
                        density="hard"
                        className={styles.flipPage}
                      >
                        {content}
                      </Page>
                    );
                  }

                  return (
                    <Page key={index} className={styles.flipPage}>
                      {content}
                    </Page>
                  );
                })}
              </FlipBook>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.navigationButton} ${styles.nextButton}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label={t.next}
          >
            →
          </button>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={styles.textControl}
          >
            <span>←</span>

            {t.previous}
          </button>

          <div className={styles.pageIndicator}>
            <span>
              {t.page} {currentPage + 1} {t.of} {menuPages.length}
            </span>

            <div className={styles.progress}>
              <span
                style={{
                  width: `${((currentPage + 1) / menuPages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className={styles.textControl}
          >
            {t.next}

            <span>→</span>
          </button>
        </div>

        <p className={styles.zoomHint}>{t.zoomHint}</p>
      </section>

      <section className={styles.reservationSection}>
        <div>
          <span className={styles.reservationEyebrow}>Restaurant</span>

          <h2>
            {locale === "bg"
              ? "Избрахте ли какво ще опитате?"
              : "Found something you would like to try?"}
          </h2>
        </div>

        <Link href={`/${locale}/reservations`} className={styles.reserveButton}>
          {t.reserve}

          <span>↗</span>
        </Link>
      </section>

      {zoomedPage !== null && (
        <div
          className={styles.zoomOverlay}
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setZoomedPage(null);
            }
          }}
        >
          <button
            type="button"
            className={styles.zoomClose}
            onClick={() => setZoomedPage(null)}
          >
            <span>×</span>

            {t.close}
          </button>

          <div className={styles.zoomImageWrapper}>
            <Image
              loader={cloudinaryLoader}
              unoptimized
              src={menuPages[zoomedPage].zoom}
              alt={`${t.page} ${zoomedPage + 1}`}
              width={2200}
              height={3116}
              priority
              draggable={false}
              sizes="95vw"
            />
          </div>

          <div className={styles.zoomNavigation}>
            <button
              type="button"
              disabled={zoomedPage === 0}
              onClick={() =>
                setZoomedPage((current) =>
                  current === null ? null : Math.max(0, current - 1),
                )
              }
            >
              ←
            </button>

            <span>
              {zoomedPage + 1}
              {" / "}
              {menuPages.length}
            </span>

            <button
              type="button"
              disabled={zoomedPage === menuPages.length - 1}
              onClick={() =>
                setZoomedPage((current) =>
                  current === null
                    ? null
                    : Math.min(menuPages.length - 1, current + 1),
                )
              }
            >
              →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
