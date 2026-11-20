"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import styles from "./upcoming-events.module.css";

type Locale = "bg" | "en";

type UpcomingEventsProps = {
  locale: Locale;
};

const events = {
  bg: [
    {
      date: "10.12",
      reservationDate: "2026-12-10",
      slug: "kris-siyana",
      label: "Музика на живо",
      title: "Крис и Сияна",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795178275/1778273826853817_wftys1.jpg",
      imagePosition: "kris",
    },
    {
      date: "18.12",
      reservationDate: "2026-12-18",
      slug: "aris-zarimis",
      label: "Музика на живо",
      title: "Арис Заримис",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795177646/469755063_122197107638165889_6318541981461741598_n_nnsj5x.webp",
      imagePosition: "default",
    },
    {
      date: "31.12",
      reservationDate: "2026-12-31",
      slug: "new-years-eve",
      label: "Специална вечер",
      title: "Новогодишна вечер",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795178955/ca02825e-0b07-4194-9e89-3df6445c6dbf_mh5b1t.png",
      imagePosition: "default",
    },
  ],

  en: [
    {
      date: "10.12",
      reservationDate: "2026-12-10",
      slug: "kris-siyana",
      label: "Live music",
      title: "Kris & Siyana",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795178275/1778273826853817_wftys1.jpg",
      imagePosition: "kris",
    },
    {
      date: "18.12",
      reservationDate: "2026-12-18",
      slug: "aris-zarimis",
      label: "Live music",
      title: "Aris Zarimis",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795177646/469755063_122197107638165889_6318541981461741598_n_nnsj5x.webp",
      imagePosition: "default",
    },
    {
      date: "31.12",
      reservationDate: "2026-12-31",
      slug: "new-years-eve",
      label: "Special evening",
      title: "New Year's Eve",
      image:
        "https://res.cloudinary.com/dznyfk4z6/image/upload/v1795178955/ca02825e-0b07-4194-9e89-3df6445c6dbf_mh5b1t.png",
      imagePosition: "default",
    },
  ],
};

const copy = {
  bg: {
    eyebrow: "Предстоящи събития",
    title: "Вечери, които си струва да очакваш",
    reserve: "Запази маса",
  },

  en: {
    eyebrow: "Upcoming events",
    title: "Evenings worth looking forward to",
    reserve: "Reserve a table",
  },
};

export default function UpcomingEvents({ locale }: UpcomingEventsProps) {
  const t = copy[locale];
  const currentEvents = events[locale];

  return (
    <section id="upcoming-events" className={styles.section}>
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className={styles.eyebrow}>{t.eyebrow}</p>

          <h2>{t.title}</h2>
        </motion.header>

        <motion.div
          className={styles.gallery}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {currentEvents.map((event, index) => (
            <motion.article
              key={`${event.date}-${event.title}`}
              className={`${styles.event} ${
                index === 1 ? styles.centerEvent : ""
              }`}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                },

                visible: {
                  opacity: 1,
                  y: 0,

                  transition: {
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <Link
                href={`/${locale}/reservations?date=${event.reservationDate}&event=${event.slug}`}
                className={styles.eventLink}
              >
                <div className={styles.visual}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 720px) 82vw, (max-width: 1000px) 33vw, 420px"
                    className={`${styles.image} ${
                      event.imagePosition === "kris" ? styles.krisImage : ""
                    }`}
                  />

                  <div className={styles.overlay} />

                  <div className={styles.hoverContent}>
                    <span>{event.label}</span>

                    <p>{t.reserve}</p>
                  </div>
                </div>

                <div className={styles.meta}>
                  <div className={styles.eventInfo}>
                    <span className={styles.label}>{event.label}</span>

                    <div className={styles.titleRow}>
                      <h3>{event.title}</h3>

                      <span className={styles.eventDate}>{event.date}</span>
                    </div>
                  </div>

                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
