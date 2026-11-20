"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { bg, enUS } from "date-fns/locale";
import { format } from "date-fns";

import { createClient } from "../../../lib/supabase/client";

import styles from "./reservation.module.css";

type Locale = "bg" | "en";
type Seating = "inside" | "outside" | "none";

type ReservationClientProps = {
  embedded?: boolean;
};

const MAX_STANDARD_GUESTS = 10;

const times = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

const translations = {
  bg: {
    home: "Начало",
    eyebrow: "Резервация",
    title: "Запази маса",
    subtitle: "Избери дата, час и предпочитана зона.",

    date: "Дата",
    guests: "Брой гости",
    time: "Час",
    seating: "Предпочитана зона",

    inside: "Вътре",
    outside: "Вън",
    noPreference: "Без предпочитание",

    seatingNote: "Зоната е предпочитание и зависи от наличността.",

    details: "Контактни данни",
    name: "Име",
    phone: "Телефон",
    email: "Имейл",
    note: "Бележка",
    notePlaceholder: "Например повод, детско столче или друго изискване",

    continue: "Продължи",
    back: "Назад",
    review: "Преглед",
    confirm: "Потвърди",
    confirming: "Запазване...",

    selectedDate: "Избрана дата",

    guest: "гост",
    guestsPlural: "гости",

    summary: "Преглед на резервацията",

    required: "Моля, попълни всички задължителни полета.",

    confirmed: "Резервацията е изпратена",
    confirmedText:
      "Заявката ти е записана успешно и вече можеш да я видиш в своя профил.",

    account: "Виж моите резервации",

    authLoading: "Проверяваме профила ти...",

    reservationError:
      "Възникна проблем при записването на резервацията. Опитай отново.",

    moreThanTen: "Повече от 10 гости?",
    standardReservation: "До 10 гости",

    groupEyebrow: "11+ гости",
    groupTitle: "Групово запитване",
    groupDescription:
      "За по-големи компании уточняваме детайлите индивидуално, за да подготвим най-подходящото настаняване.",

    approximateGuests: "Ориентировъчен брой гости",
    preferredTime: "Предпочитан час",
    groupNote: "Допълнителна информация",
    groupNotePlaceholder: "Повод, специални изисквания или друга информация",

    sendInquiry: "Изпрати запитване",
    sendingInquiry: "Изпращане...",

    inquirySent: "Запитването е изпратено",
    inquirySentText:
      "Получихме заявката ти за групово посещение. След преглед ресторантът може да потвърди детайлите с теб.",
  },

  en: {
    home: "Home",
    eyebrow: "Reservation",
    title: "Reserve a table",
    subtitle: "Choose your date, time and preferred seating.",

    date: "Date",
    guests: "Number of guests",
    time: "Time",
    seating: "Preferred seating",

    inside: "Inside",
    outside: "Outside",
    noPreference: "No preference",

    seatingNote:
      "Your seating choice is a preference and depends on availability.",

    details: "Contact details",
    name: "Name",
    phone: "Phone",
    email: "Email",
    note: "Note",
    notePlaceholder: "For example occasion, high chair or another request",

    continue: "Continue",
    back: "Back",
    review: "Review",
    confirm: "Confirm",
    confirming: "Saving...",

    selectedDate: "Selected date",

    guest: "guest",
    guestsPlural: "guests",

    summary: "Reservation summary",

    required: "Please complete all required fields.",

    confirmed: "Reservation submitted",
    confirmedText:
      "Your request has been saved successfully and is now available in your account.",

    account: "View my reservations",

    authLoading: "Checking your account...",

    reservationError:
      "Something went wrong while saving your reservation. Please try again.",

    moreThanTen: "More than 10 guests?",
    standardReservation: "Up to 10 guests",

    groupEyebrow: "11+ guests",
    groupTitle: "Group enquiry",
    groupDescription:
      "For larger groups, we arrange the details individually so we can prepare the most suitable seating for your visit.",

    approximateGuests: "Approximate number of guests",
    preferredTime: "Preferred time",
    groupNote: "Additional information",
    groupNotePlaceholder:
      "Occasion, special requirements or any other information",

    sendInquiry: "Send enquiry",
    sendingInquiry: "Sending...",

    inquirySent: "Enquiry submitted",
    inquirySentText:
      "We have received your group enquiry. The restaurant can review the request and confirm the details with you.",
  },
};

export default function ReservationClient({
  embedded = false,
}: ReservationClientProps) {
  const params = useParams();
  const router = useRouter();

  const locale: Locale = params.locale === "en" ? "en" : "bg";
  const t = translations[locale];

  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [guests, setGuests] = useState(2);

  const [time, setTime] = useState("");

  const [seating, setSeating] = useState<Seating>("none");

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [groupMode, setGroupMode] = useState(false);

  const [groupGuests, setGroupGuests] = useState(12);

  const [groupTime, setGroupTime] = useState("");

  const [groupNote, setGroupNote] = useState("");

  const [groupSubmitting, setGroupSubmitting] = useState(false);

  const [groupSubmitted, setGroupSubmitted] = useState(false);

  const today = useMemo(() => {
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    return currentDate;
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (!embedded) {
          router.replace(`/${locale}/login`);
        }

        return;
      }

      setUserId(user.id);

      if (user.email) {
        setEmail(user.email);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileError && profile) {
        if (profile.full_name) {
          setName(profile.full_name);
        }

        if (profile.phone) {
          setPhone(profile.phone);
        }
      } else {
        const metadataName = user.user_metadata?.full_name;

        if (metadataName) {
          setName(metadataName);
        }
      }

      setCheckingAuth(false);
    };

    void loadUser();
  }, [embedded, locale, router]);

  const formattedDate = selectedDate
    ? format(selectedDate, locale === "bg" ? "d MMMM yyyy" : "MMMM d, yyyy", {
        locale: locale === "bg" ? bg : enUS,
      })
    : "";

  const databaseDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const decreaseGuests = () => {
    setGuests((current) => (current > 1 ? current - 1 : 1));
  };

  const increaseGuests = () => {
    setGuests((current) =>
      current < MAX_STANDARD_GUESTS ? current + 1 : MAX_STANDARD_GUESTS,
    );
  };

  const handleGuestsInput = (value: string) => {
    const number = Number(value);

    if (!value) {
      setGuests(1);
      return;
    }

    if (
      Number.isInteger(number) &&
      number >= 1 &&
      number <= MAX_STANDARD_GUESTS
    ) {
      setGuests(number);
    }
  };

  const getSeatingLabel = () => {
    if (seating === "inside") {
      return t.inside;
    }

    if (seating === "outside") {
      return t.outside;
    }

    return t.noPreference;
  };

  const goToDetails = () => {
    if (!selectedDate || !time) {
      setError(t.required);
      return;
    }

    setError("");
    setStep(2);
  };

  const goToReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(t.required);
      return;
    }

    setError("");
    setStep(3);
  };

  const confirmReservation = async () => {
    if (
      !userId ||
      !selectedDate ||
      !time ||
      guests < 1 ||
      guests > MAX_STANDARD_GUESTS
    ) {
      setError(t.reservationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: reservationError } = await supabase
        .from("reservations")
        .insert({
          user_id: userId,
          reservation_date: databaseDate,
          reservation_time: time,
          guests,
          seating_preference: seating,
          guest_name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          note: note.trim() ? note.trim() : null,
          status: "pending",
        });

      if (reservationError) {
        console.error("Reservation insert error:", reservationError);

        setError(reservationError.message);

        return;
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          phone: phone.trim(),
        })
        .eq("id", userId);

      if (profileUpdateError) {
        console.error("Profile update error:", profileUpdateError);
      }

      setConfirmed(true);
    } catch (caughtError) {
      console.error("Reservation error:", caughtError);

      setError(t.reservationError);
    } finally {
      setSubmitting(false);
    }
  };

  const submitGroupInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !userId ||
      !selectedDate ||
      !groupTime ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      groupGuests <= MAX_STANDARD_GUESTS
    ) {
      setError(t.required);
      return;
    }

    setGroupSubmitting(true);
    setError("");

    try {
      const supabase = createClient();

      const inquiryNote = [
        locale === "bg" ? "ГРУПОВО ЗАПИТВАНЕ" : "GROUP ENQUIRY",
        groupNote.trim() || null,
      ]
        .filter(Boolean)
        .join(" — ");

      const { error: inquiryError } = await supabase
        .from("reservations")
        .insert({
          user_id: userId,
          reservation_date: databaseDate,
          reservation_time: groupTime,
          guests: groupGuests,
          seating_preference: "none",
          guest_name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          note: inquiryNote,
          status: "pending",
        });

      if (inquiryError) {
        console.error("Group enquiry insert error:", inquiryError);

        setError(inquiryError.message);

        return;
      }

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          phone: phone.trim(),
        })
        .eq("id", userId);

      if (profileUpdateError) {
        console.error("Profile update error:", profileUpdateError);
      }

      setGroupSubmitted(true);
    } catch (caughtError) {
      console.error("Group enquiry error:", caughtError);

      setError(t.reservationError);
    } finally {
      setGroupSubmitting(false);
    }
  };

  const groupPanel = (
    <form
      onSubmit={submitGroupInquiry}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "19px",
        border: "1px solid rgba(65, 88, 67, 0.12)",
        borderRadius: "13px",
        background: "rgba(65, 88, 67, 0.045)",
      }}
    >
      <div>
        <span
          style={{
            display: "block",
            marginBottom: "6px",
            color: "var(--color-accent)",
            fontSize: "7px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {t.groupEyebrow}
        </span>

        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {t.groupTitle}
        </h2>

        <p
          style={{
            maxWidth: "520px",
            margin: "9px 0 0",
            color: "rgba(32, 37, 32, 0.5)",
            fontSize: "9px",
            lineHeight: 1.55,
          }}
        >
          {t.groupDescription}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "11px",
        }}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="groupGuests">{t.approximateGuests} *</label>

          <input
            id="groupGuests"
            type="number"
            min={11}
            max={100}
            value={groupGuests}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (Number.isInteger(value)) {
                setGroupGuests(Math.max(11, Math.min(100, value)));
              }
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="groupTime">{t.preferredTime} *</label>

          <select
            id="groupTime"
            value={groupTime}
            onChange={(event) => setGroupTime(event.target.value)}
            style={{
              width: "100%",
              minHeight: "41px",
              border: "1px solid rgba(65, 88, 67, 0.13)",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.62)",
              padding: "10px 13px",
              color: "#202520",
              fontSize: "11px",
              outline: "none",
            }}
          >
            <option value="">
              {locale === "bg" ? "Избери час" : "Choose time"}
            </option>

            {times.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="groupName">{t.name} *</label>

          <input
            id="groupName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="groupPhone">{t.phone} *</label>

          <input
            id="groupPhone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="groupEmail">{t.email} *</label>

          <input
            id="groupEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="groupNote">{t.groupNote}</label>

          <textarea
            id="groupNote"
            rows={2}
            value={groupNote}
            placeholder={t.groupNotePlaceholder}
            onChange={(event) => setGroupNote(event.target.value)}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        disabled={groupSubmitting}
        className={styles.primaryButton}
        style={{
          alignSelf: "flex-end",
          marginTop: "2px",
        }}
      >
        {groupSubmitting ? t.sendingInquiry : t.sendInquiry}

        <span>→</span>
      </button>
    </form>
  );

  const content = (
    <div
      className={`${styles.container} ${
        embedded ? styles.containerEmbedded : ""
      }`}
      style={
        embedded
          ? {
              height: "auto",
              minHeight: "100%",
              justifyContent: "flex-start",
              paddingTop: "42px",
              paddingBottom: "34px",
            }
          : undefined
      }
    >
      <div className={styles.heading}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>

        <h1>{t.title}</h1>

        <p>{t.subtitle}</p>
      </div>

      {!groupMode && (
        <div className={styles.steps}>
          <span className={step >= 1 ? styles.stepActive : ""}>1</span>

          <div />

          <span className={step >= 2 ? styles.stepActive : ""}>2</span>

          <div />

          <span className={step >= 3 ? styles.stepActive : ""}>3</span>
        </div>
      )}

      <section className={styles.formCard}>
        {step === 1 && (
          <div className={`${styles.formContent} ${styles.firstStep}`}>
            <div className={styles.calendarColumn}>
              <div className={styles.field}>
                <label>{t.date}</label>

                <div className={styles.calendarBox}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{
                      before: today,
                    }}
                    locale={locale === "bg" ? bg : enUS}
                    weekStartsOn={1}
                    classNames={{
                      root: styles.calendar,
                      months: styles.calendarMonths,
                      month: styles.calendarMonth,
                      month_caption: styles.calendarCaption,
                      caption_label: styles.calendarCaptionLabel,
                      nav: styles.calendarNav,
                      button_previous: styles.calendarNavButton,
                      button_next: styles.calendarNavButton,
                      month_grid: styles.calendarGrid,
                      weekdays: styles.calendarWeekdays,
                      weekday: styles.calendarWeekday,
                      week: styles.calendarWeek,
                      day: styles.calendarDay,
                      day_button: styles.calendarDayButton,
                      selected: styles.calendarSelected,
                      today: styles.calendarToday,
                      outside: styles.calendarOutside,
                      disabled: styles.calendarDisabled,
                      chevron: styles.calendarChevron,
                    }}
                  />
                </div>

                {formattedDate && (
                  <p className={styles.selectedDate}>
                    {t.selectedDate}: <strong>{formattedDate}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className={styles.optionsColumn}>
              {!groupMode ? (
                <>
                  <div className={styles.field}>
                    <label>{t.guests}</label>

                    <div className={styles.guestControl}>
                      <button type="button" onClick={decreaseGuests}>
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        max={MAX_STANDARD_GUESTS}
                        value={guests}
                        onChange={(event) =>
                          handleGuestsInput(event.target.value)
                        }
                      />

                      <button type="button" onClick={increaseGuests}>
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setGroupMode(true);
                        setError("");
                      }}
                      style={{
                        width: "fit-content",
                        marginTop: "1px",
                        padding: "3px 0",
                        borderBottom: "1px solid rgba(65,88,67,0.22)",
                      }}
                    >
                      {t.moreThanTen}
                    </button>
                  </div>

                  <div className={styles.field}>
                    <label>{t.time}</label>

                    <div className={styles.timeGrid}>
                      {times.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={
                            time === slot
                              ? styles.timeActive
                              : styles.timeButton
                          }
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>{t.seating}</label>

                    <div className={styles.seatingGrid}>
                      <button
                        type="button"
                        onClick={() => setSeating("inside")}
                        className={
                          seating === "inside"
                            ? styles.seatingActive
                            : styles.seatingButton
                        }
                      >
                        {t.inside}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSeating("outside")}
                        className={
                          seating === "outside"
                            ? styles.seatingActive
                            : styles.seatingButton
                        }
                      >
                        {t.outside}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSeating("none")}
                        className={
                          seating === "none"
                            ? styles.seatingActive
                            : styles.seatingButton
                        }
                      >
                        {t.noPreference}
                      </button>
                    </div>

                    <p className={styles.helper}>{t.seatingNote}</p>
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
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setGroupMode(false);
                      setError("");
                    }}
                    style={{
                      width: "fit-content",
                      alignSelf: "flex-start",
                    }}
                  >
                    ← {t.standardReservation}
                  </button>

                  {groupPanel}
                </>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <form
            className={`${styles.formContent} ${styles.detailsStep}`}
            onSubmit={goToReview}
          >
            <h2>{t.details}</h2>

            <div className={styles.detailsGrid}>
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

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="email">{t.email} *</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="note">{t.note}</label>

                <textarea
                  id="note"
                  rows={4}
                  value={note}
                  placeholder={t.notePlaceholder}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setStep(1)}
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
          <div className={`${styles.formContent} ${styles.reviewStep}`}>
            <h2>{t.summary}</h2>

            <div className={styles.summary}>
              <div>
                <span>{t.date}</span>
                <strong>{formattedDate}</strong>
              </div>

              <div>
                <span>{t.time}</span>
                <strong>{time}</strong>
              </div>

              <div>
                <span>{t.guests}</span>

                <strong>
                  {guests} {guests === 1 ? t.guest : t.guestsPlural}
                </strong>
              </div>

              <div>
                <span>{t.seating}</span>
                <strong>{getSeatingLabel()}</strong>
              </div>

              <div>
                <span>{t.name}</span>
                <strong>{name}</strong>
              </div>

              <div>
                <span>{t.phone}</span>
                <strong>{phone}</strong>
              </div>

              <div>
                <span>{t.email}</span>
                <strong>{email}</strong>
              </div>

              {note && (
                <div>
                  <span>{t.note}</span>
                  <strong>{note}</strong>
                </div>
              )}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setStep(2)}
              >
                ← {t.back}
              </button>

              <button
                type="button"
                disabled={submitting}
                className={styles.primaryButton}
                onClick={confirmReservation}
              >
                {submitting ? t.confirming : t.confirm}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  if (checkingAuth) {
    return (
      <div className={embedded ? styles.embeddedState : styles.main}>
        <div className={styles.loadingState}>
          <span className={styles.loadingDot} />

          <p>{t.authLoading}</p>
        </div>
      </div>
    );
  }

  if (groupSubmitted) {
    return (
      <div className={embedded ? styles.embeddedState : styles.main}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>

          <span className={styles.eyebrow}>{t.groupEyebrow}</span>

          <h1>{t.inquirySent}</h1>

          <p>{t.inquirySentText}</p>

          <button
            type="button"
            className={styles.backHome}
            onClick={() => {
              setGroupSubmitted(false);
              setGroupMode(false);
              setGroupGuests(12);
              setGroupTime("");
              setGroupNote("");
              setError("");
            }}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {t.standardReservation}

            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className={embedded ? styles.embeddedState : styles.main}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>

          <span className={styles.eyebrow}>{t.eyebrow}</span>

          <h1>{t.confirmed}</h1>

          <p>{t.confirmedText}</p>

          <Link href={`/${locale}/account`} className={styles.backHome}>
            {t.account}

            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  if (embedded) {
    return (
      <div
        className={styles.embedded}
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {content}
      </div>
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

      {content}
    </main>
  );
}
