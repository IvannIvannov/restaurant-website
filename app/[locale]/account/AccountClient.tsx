"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import styles from "./account.module.css";

type Locale = "bg" | "en";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
};

type Reservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  seating_preference: "inside" | "outside" | "none";
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

const translations = {
  bg: {
    home: "Начало",
    title: "Моят профил",
    subtitle: "Управлявай профила и резервациите си.",

    personalInfo: "Лични данни",

    name: "Име",
    email: "Имейл",
    phone: "Телефон",
    role: "Профил",

    customer: "Клиент",
    admin: "Администратор",

    noPhone: "Не е добавен",

    reservations: "Моите резервации",
    noReservations: "Все още нямаш резервации.",

    createReservation: "Запази маса",

    date: "Дата",
    time: "Час",
    guests: "Гости",
    seating: "Зона",
    status: "Статус",

    inside: "Вътре",
    outside: "Вън",
    none: "Без предпочитание",

    pending: "Очаква потвърждение",
    confirmed: "Потвърдена",
    cancelled: "Отказана",
    completed: "Завършена",

    logout: "Изход",
    loggingOut: "Излизане...",

    loading: "Зареждане на профила...",

    error: "Възникна проблем при зареждането на профила.",
  },

  en: {
    home: "Home",
    title: "My account",
    subtitle: "Manage your profile and reservations.",

    personalInfo: "Personal information",

    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Account",

    customer: "Customer",
    admin: "Administrator",

    noPhone: "Not added",

    reservations: "My reservations",
    noReservations: "You don't have any reservations yet.",

    createReservation: "Reserve a table",

    date: "Date",
    time: "Time",
    guests: "Guests",
    seating: "Seating",
    status: "Status",

    inside: "Inside",
    outside: "Outside",
    none: "No preference",

    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",

    logout: "Log out",
    loggingOut: "Logging out...",

    loading: "Loading account...",

    error: "Something went wrong while loading your account.",
  },
};

export default function AccountClient() {
  const params = useParams();
  const router = useRouter();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [profile, setProfile] = useState<Profile | null>(null);

  const [email, setEmail] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(true);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace(`/${locale}/login`);

          return;
        }

        setEmail(user.email ?? "");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, phone, role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);

          setError(t.error);
          return;
        }

        setProfile(profileData);

        const { data: reservationsData, error: reservationsError } =
          await supabase
            .from("reservations")
            .select(
              `
            id,
            reservation_date,
            reservation_time,
            guests,
            seating_preference,
            status
            `,
            )
            .eq("user_id", user.id)
            .gte("reservation_date", new Date().toISOString().split("T")[0])
            .order("reservation_date", {
              ascending: true,
            })
            .order("reservation_time", {
              ascending: true,
            });

        if (reservationsError) {
          console.error("Reservations error:", reservationsError);
        } else {
          setReservations(reservationsData ?? []);
        }
      } catch (caughtError) {
        console.error("Account load error:", caughtError);

        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [locale, router, t.error]);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      router.push(`/${locale}/login`);
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  const getSeatingLabel = (seating: Reservation["seating_preference"]) => {
    if (seating === "inside") {
      return t.inside;
    }

    if (seating === "outside") {
      return t.outside;
    }

    return t.none;
  };

  const getStatusLabel = (status: Reservation["status"]) => {
    if (status === "confirmed") {
      return t.confirmed;
    }

    if (status === "cancelled") {
      return t.cancelled;
    }

    if (status === "completed") {
      return t.completed;
    }

    return t.pending;
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingState}>{t.loading}</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.homeLink}>
          ← {t.home}
        </Link>

        <div className={styles.headerActions}>
          <div className={styles.languageSwitcher}>
            <Link
              href="/bg/account"
              className={locale === "bg" ? styles.activeLanguage : ""}
            >
              BG
            </Link>

            <span>/</span>

            <Link
              href="/en/account"
              className={locale === "en" ? styles.activeLanguage : ""}
            >
              EN
            </Link>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            disabled={logoutLoading}
            onClick={handleLogout}
          >
            {logoutLoading ? t.loggingOut : t.logout}
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {profile && (
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <h2>{t.personalInfo}</h2>
            </div>

            <div className={styles.infoGrid}>
              <div>
                <span>{t.name}</span>

                <strong>{profile.full_name || "—"}</strong>
              </div>

              <div>
                <span>{t.email}</span>

                <strong>{email}</strong>
              </div>

              <div>
                <span>{t.phone}</span>

                <strong>{profile.phone || t.noPhone}</strong>
              </div>

              <div>
                <span>{t.role}</span>

                <strong>
                  {profile.role === "admin" ? t.admin : t.customer}
                </strong>
              </div>
            </div>
          </section>
        )}

        <section className={styles.card}>
          <div className={styles.reservationsHeader}>
            <div>
              <h2>{t.reservations}</h2>
            </div>

            <Link
              href={`/${locale}/reservations`}
              className={styles.reservationButton}
            >
              {t.createReservation}
            </Link>
          </div>

          {reservations.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t.noReservations}</p>
            </div>
          ) : (
            <div className={styles.reservationsList}>
              {reservations.map((reservation) => (
                <article key={reservation.id} className={styles.reservation}>
                  <div>
                    <span>{t.date}</span>

                    <strong>{reservation.reservation_date}</strong>
                  </div>

                  <div>
                    <span>{t.time}</span>

                    <strong>{reservation.reservation_time.slice(0, 5)}</strong>
                  </div>

                  <div>
                    <span>{t.guests}</span>

                    <strong>{reservation.guests}</strong>
                  </div>

                  <div>
                    <span>{t.seating}</span>

                    <strong>
                      {getSeatingLabel(reservation.seating_preference)}
                    </strong>
                  </div>

                  <div>
                    <span>{t.status}</span>

                    <strong>{getStatusLabel(reservation.status)}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
