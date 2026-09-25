"use client";

import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import styles from "./menu.module.css";

type Locale = "bg" | "en";

type MenuClientProps = {
  locale: Locale;
};

type FlipDirection = "next" | "previous" | null;

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
    "/image/upload/f_auto,q_auto:good,w_1100/",
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

const subscribeDesktop = (callback: () => void) => {
  const query = window.matchMedia("(min-width: 900px)");

  query.addEventListener("change", callback);

  return () => {
    query.removeEventListener("change", callback);
  };
};

const getDesktopSnapshot = () =>
  window.matchMedia("(min-width: 900px)").matches;

const getDesktopServerSnapshot = () => false;

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
    pages: "Страници",
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
    pages: "Pages",
    of: "of",
    zoomHint: "Click a page to enlarge it",
    close: "Close",
    reserve: "Reserve a table",
  },
};

export default function MenuClient({ locale }: MenuClientProps) {
  const t = translations[locale];

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );

  const menuPages = useMemo(
    () =>
      rawMenuPages.map((url) => ({
        preview: getPreviewUrl(url),
        zoom: getZoomUrl(url),
      })),
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);

  const [zoomedPage, setZoomedPage] = useState<number | null>(null);

  const displayIndex =
    isDesktop && currentIndex > 0 && currentIndex % 2 === 0
      ? currentIndex - 1
      : currentIndex;

  const isCover = isDesktop && displayIndex === 0;

  const leftPageIndex = isCover ? null : displayIndex;

  const rightPageIndex = isDesktop ? (isCover ? 0 : displayIndex + 1) : null;

  const canGoPrevious = displayIndex > 0;

  const canGoNext = isDesktop
    ? isCover
      ? menuPages.length > 1
      : displayIndex + 1 < menuPages.length - 1
    : displayIndex < menuPages.length - 1;

  useEffect(() => {
    const preloadImages = () => {
      menuPages.forEach((page) => {
        const image = new window.Image();

        image.decoding = "async";

        image.src = page.preview;
      });
    };

    const timeoutId = window.setTimeout(preloadImages, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [menuPages]);

  const animateFlip = useCallback(
    (direction: Exclude<FlipDirection, null>, action: () => void) => {
      if (flipDirection !== null) {
        return;
      }

      setFlipDirection(direction);

      window.setTimeout(() => {
        action();
      }, 360);

      window.setTimeout(() => {
        setFlipDirection(null);
      }, 760);
    },
    [flipDirection],
  );

  const goNext = useCallback(() => {
    if (!canGoNext) {
      return;
    }

    animateFlip("next", () => {
      setCurrentIndex((current) => {
        if (!isDesktop) {
          return Math.min(current + 1, menuPages.length - 1);
        }

        const normalized =
          current > 0 && current % 2 === 0 ? current - 1 : current;

        if (normalized === 0) {
          return 1;
        }

        return Math.min(normalized + 2, menuPages.length - 1);
      });
    });
  }, [animateFlip, canGoNext, isDesktop, menuPages.length]);

  const goPrevious = useCallback(() => {
    if (!canGoPrevious) {
      return;
    }

    animateFlip("previous", () => {
      setCurrentIndex((current) => {
        if (!isDesktop) {
          return Math.max(current - 1, 0);
        }

        const normalized =
          current > 0 && current % 2 === 0 ? current - 1 : current;

        if (normalized <= 1) {
          return 0;
        }

        return Math.max(normalized - 2, 1);
      });
    });
  }, [animateFlip, canGoPrevious, isDesktop]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && zoomedPage !== null) {
        setZoomedPage(null);

        return;
      }

      if (zoomedPage !== null) {
        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious, zoomedPage]);

  useEffect(() => {
    if (zoomedPage === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomedPage]);

  const getPageLabel = () => {
    if (!isDesktop) {
      return `${t.page} ${displayIndex + 1} ${t.of} ${menuPages.length}`;
    }

    if (isCover) {
      return `${t.page} 1 ${t.of} ${menuPages.length}`;
    }

    const first = displayIndex + 1;

    const second = Math.min(displayIndex + 2, menuPages.length);

    return `${t.pages} ${first}–${second} ${t.of} ${menuPages.length}`;
  };

  const renderPage = (index: number, side: "left" | "right" | "single") => {
    const page = menuPages[index];

    if (!page) {
      return <div className={`${styles.page} ${styles.emptyPage}`} />;
    }

    return (
      <button
        type="button"
        className={[
          styles.page,
          side === "left" ? styles.leftPage : "",
          side === "right" ? styles.rightPage : "",
          side === "single" ? styles.singlePage : "",
        ].join(" ")}
        onClick={() => setZoomedPage(index)}
        aria-label={`${t.page} ${index + 1}`}
      >
        <Image
          loader={cloudinaryLoader}
          unoptimized
          src={page.preview}
          alt={`${t.page} ${index + 1}`}
          width={1100}
          height={1558}
          priority={index <= 3}
          loading={index <= 3 ? "eager" : "lazy"}
          fetchPriority={index <= 3 ? "high" : "auto"}
          draggable={false}
          sizes={isDesktop ? "(min-width: 900px) 460px, 90vw" : "92vw"}
        />

        <span className={styles.zoomIcon}>⤢</span>
      </button>
    );
  };

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
            onClick={goPrevious}
            disabled={!canGoPrevious}
            aria-label={t.previous}
          >
            ←
          </button>

          <div className={styles.bookShell}>
            <div className={styles.pageStackBack} />

            <div className={styles.pageStackMiddle} />

            <div
              className={[styles.book, isCover ? styles.coverMode : ""].join(
                " ",
              )}
            >
              {isDesktop ? (
                isCover ? (
                  <div className={styles.coverWrapper}>
                    {renderPage(0, "single")}
                  </div>
                ) : (
                  <>
                    {leftPageIndex !== null &&
                      renderPage(leftPageIndex, "left")}

                    {rightPageIndex !== null &&
                    rightPageIndex < menuPages.length ? (
                      renderPage(rightPageIndex, "right")
                    ) : (
                      <div className={`${styles.page} ${styles.emptyPage}`} />
                    )}

                    <div className={styles.bookSpine} />
                  </>
                )
              ) : (
                renderPage(displayIndex, "single")
              )}

              {flipDirection === "next" && (
                <div className={`${styles.flipSheet} ${styles.flipSheetNext}`}>
                  <div className={styles.flipFront} />

                  <div className={styles.flipBack} />

                  <span className={styles.pageCurl} />
                </div>
              )}

              {flipDirection === "previous" && (
                <div
                  className={`${styles.flipSheet} ${styles.flipSheetPrevious}`}
                >
                  <div className={styles.flipFront} />

                  <div className={styles.flipBack} />

                  <span className={styles.pageCurl} />
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.navigationButton} ${styles.nextButton}`}
            onClick={goNext}
            disabled={!canGoNext}
            aria-label={t.next}
          >
            →
          </button>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            onClick={goPrevious}
            disabled={!canGoPrevious}
            className={styles.textControl}
          >
            <span>←</span>

            {t.previous}
          </button>

          <div className={styles.pageIndicator}>
            <span>{getPageLabel()}</span>

            <div className={styles.progress}>
              <span
                style={{
                  width: `${((displayIndex + 1) / menuPages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
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
