"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./reservation.module.css";

type Locale = "bg" | "en";

type Seating = "inside" | "outside" | "none";

const times = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const translations = {
  bg: {
    home: "Начало",
    title: "РЕЗЕРВАЦИЯ",
    subtitle: "Избери кога и как искаш да ни посетиш.",

    date: "Дата",
    guests: "Гости",
    guest: "гост",
    guestsPlural: "гости",

    time: "Час",

    seating: "Предпочитана зона",
    inside: "Вътре",
    outside: "Вън",
    noPreference: "Без предпочитание",

    seatingNote:
      "Ще направим всичко възможно да се съобразим с избраната зона според наличността.",

    details: "Твоите данни",

    name: "Име",
    phone: "Телефон",
    email: "Имейл",
    note: "Бележка",

    notePlaceholder: "Повод, детско столче, специално изискване...",

    continue: "Продължи",
    back: "Назад",

    review: "Провери резервацията",
    confirm: "Потвърди",

    confirmed: "ЗАЯВКАТА Е ГОТОВА",

    confirmedText:
      "Следващата стъпка е да свържем резервацията с профил и реалната база данни.",

    dateLabel: "Дата",
    timeLabel: "Час",
    guestsLabel: "Гости",
    seatingLabel: "Зона",
    contactLabel: "Контакт",

    required: "Моля, попълни всички задължителни полета.",

    change: "Промени",
  },

  en: {
    home: "Home",
    title: "RESERVATION",
    subtitle: "Choose when and how you would like to visit us.",

    date: "Date",
    guests: "Guests",
    guest: "guest",
    guestsPlural: "guests",

    time: "Time",

    seating: "Preferred seating",
    inside: "Inside",
    outside: "Outside",
    noPreference: "No preference",

    seatingNote:
      "We will do our best to accommodate your preferred area depending on availability.",

    details: "Your details",

    name: "Name",
    phone: "Phone",
    email: "Email",
    note: "Note",

    notePlaceholder: "Occasion, high chair, special request...",

    continue: "Continue",
    back: "Back",

    review: "Review reservation",
    confirm: "Confirm",

    confirmed: "REQUEST READY",

    confirmedText:
      "The next step is connecting the reservation to an account and the real database.",

    dateLabel: "Date",
    timeLabel: "Time",
    guestsLabel: "Guests",
    seatingLabel: "Seating",
    contactLabel: "Contact",

    required: "Please complete all required fields.",

    change: "Change",
  },
};

export default function ReservationClient() {
  const params = useParams();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [step, setStep] = useState(1);

  const [date, setDate] = useState("");

  const [guests, setGuests] = useState<number | null>(null);

  const [time, setTime] = useState("");

  const [seating, setSeating] = useState<Seating | null>(null);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState(false);

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const getSeatingLabel = () => {
    if (seating === "inside") {
      return t.inside;
    }

    if (seating === "outside") {
      return t.outside;
    }

    if (seating === "none") {
      return t.noPreference;
    }

    return "";
  };

  const goToDetails = () => {
    if (!date || !guests || !time || !seating) {
      setError(t.required);
      return;
    }

    setError("");
    setStep(2);
  };

  const goToReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !phone || !email) {
      setError(t.required);
      return;
    }

    setError("");
    setStep(3);
  };

  const confirmReservation = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <Link href={`/${locale}`} className={styles.homeLink}>
            ← {t.home}
          </Link>

          <div className={styles.languageSwitcher}>
            <Link
              href="/bg/reservations"
              className={locale === "bg" ? styles.activeLanguage : ""}
            >
              BG
            </Link>

            <span>/</span>

            <Link
              href="/en/reservations"
              className={locale === "en" ? styles.activeLanguage : ""}
            >
              EN
            </Link>
          </div>
        </header>

        <section className={styles.success}>
          <span className={styles.successMark}>✓</span>

          <h1>{t.confirmed}</h1>

          <p>{t.confirmedText}</p>

          <Link href={`/${locale}`} className={styles.homeButton}>
            {t.home}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.homeLink}>
          ← {t.home}
        </Link>

        <div className={styles.languageSwitcher}>
          <Link
            href="/bg/reservations"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/reservations"
            className={locale === "en" ? styles.activeLanguage : ""}
          >
            EN
          </Link>
        </div>
      </header>

      <div className={styles.page}>
        <aside className={styles.intro}>
          <p className={styles.stepLabel}>0{step} / 03</p>

          <h1>{t.title}</h1>

          <p className={styles.subtitle}>{t.subtitle}</p>
        </aside>

        <section className={styles.formArea}>
          {step === 1 && (
            <div className={styles.step}>
              <div className={styles.fieldGroup}>
                <label htmlFor="date">{t.date}</label>

                <input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>{t.guests}</span>

                <div className={styles.optionGrid}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={
                        guests === number
                          ? styles.optionActive
                          : styles.optionButton
                      }
                      onClick={() => setGuests(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>{t.time}</span>

                <div className={styles.timeGrid}>
                  {times.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={
                        time === slot
                          ? styles.optionActive
                          : styles.optionButton
                      }
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <span className={styles.label}>{t.seating}</span>

                <div className={styles.seatingGrid}>
                  <button
                    type="button"
                    className={
                      seating === "inside"
                        ? styles.seatingActive
                        : styles.seatingButton
                    }
                    onClick={() => setSeating("inside")}
                  >
                    {t.inside}
                  </button>

                  <button
                    type="button"
                    className={
                      seating === "outside"
                        ? styles.seatingActive
                        : styles.seatingButton
                    }
                    onClick={() => setSeating("outside")}
                  >
                    {t.outside}
                  </button>

                  <button
                    type="button"
                    className={
                      seating === "none"
                        ? styles.seatingActive
                        : styles.seatingButton
                    }
                    onClick={() => setSeating("none")}
                  >
                    {t.noPreference}
                  </button>
                </div>

                <p className={styles.helperText}>{t.seatingNote}</p>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="button"
                className={styles.primaryButton}
                onClick={goToDetails}
              >
                {t.continue}

                <span>→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <form className={styles.step} onSubmit={goToReview}>
              <h2>{t.details}</h2>

              <div className={styles.textFields}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">{t.name} *</label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="phone">{t.phone} *</label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">{t.email} *</label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="note">{t.note}</label>

                  <textarea
                    id="note"
                    value={note}
                    placeholder={t.notePlaceholder}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                >
                  ← {t.back}
                </button>

                <button type="submit" className={styles.primaryButton}>
                  {t.review}

                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className={styles.step}>
              <h2>{t.review}</h2>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>{t.dateLabel}</span>

                  <strong>{date}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t.timeLabel}</span>

                  <strong>{time}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t.guestsLabel}</span>

                  <strong>
                    {guests} {guests === 1 ? t.guest : t.guestsPlural}
                  </strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t.seatingLabel}</span>

                  <strong>{getSeatingLabel()}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t.contactLabel}</span>

                  <strong>
                    {name}
                    <br />
                    {phone}
                    <br />
                    {email}
                  </strong>
                </div>

                {note && (
                  <div className={styles.summaryRow}>
                    <span>{t.note}</span>

                    <strong>{note}</strong>
                  </div>
                )}
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setStep(2)}
                >
                  ← {t.change}
                </button>

                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={confirmReservation}
                >
                  {t.confirm}

                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
