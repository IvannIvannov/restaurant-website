"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import styles from "./admin.module.css";

type Locale = "bg" | "en";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

type Reservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  seating_preference: "inside" | "outside" | "none";
  guest_name: string;
  phone: string;
  email: string;
  note: string | null;
  status: ReservationStatus;
  created_at: string;
};

type Filter = "all" | ReservationStatus;

const translations = {
  bg: {
    home: "Начало",
    account: "Моят профил",

    title: "Администрация",
    subtitle: "Управление на резервациите.",

    all: "Всички",
    pending: "Чакащи",
    confirmed: "Потвърдени",
    cancelled: "Отказани",
    completed: "Завършени",

    date: "Дата",
    time: "Час",
    guests: "Гости",
    seating: "Зона",
    contact: "Контакт",
    note: "Бележка",
    status: "Статус",

    inside: "Вътре",
    outside: "Вън",
    none: "Без предпочитание",

    confirm: "Потвърди",
    cancel: "Откажи",
    complete: "Завърши",

    empty: "Няма резервации в тази категория.",

    loading: "Зареждане на резервациите...",

    forbidden: "Нямаш достъп до административния панел.",

    error: "Възникна проблем при зареждането на резервациите.",

    updateError: "Неуспешна промяна на статуса.",
  },

  en: {
    home: "Home",
    account: "My account",

    title: "Administration",
    subtitle: "Reservation management.",

    all: "All",
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",

    date: "Date",
    time: "Time",
    guests: "Guests",
    seating: "Seating",
    contact: "Contact",
    note: "Note",
    status: "Status",

    inside: "Inside",
    outside: "Outside",
    none: "No preference",

    confirm: "Confirm",
    cancel: "Cancel",
    complete: "Complete",

    empty: "There are no reservations in this category.",

    loading: "Loading reservations...",

    forbidden: "You do not have access to the admin panel.",

    error: "Something went wrong while loading reservations.",

    updateError: "Unable to update reservation status.",
  },
};

export default function AdminClient() {
  const params = useParams();
  const router = useRouter();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [filter, setFilter] = useState<Filter>("all");

  const [loading, setLoading] = useState(true);

  const [forbidden, setForbidden] = useState(false);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAdmin = async () => {
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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || profile?.role !== "admin") {
          setForbidden(true);
          return;
        }

        const { data, error: reservationsError } = await supabase
          .from("reservations")
          .select(
            `
            id,
            reservation_date,
            reservation_time,
            guests,
            seating_preference,
            guest_name,
            phone,
            email,
            note,
            status,
            created_at
            `,
          )
          .order("reservation_date", {
            ascending: true,
          })
          .order("reservation_time", {
            ascending: true,
          });

        if (reservationsError) {
          console.error(reservationsError);

          setError(t.error);
          return;
        }

        setReservations(data ?? []);
      } catch (caughtError) {
        console.error(caughtError);

        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, [locale, router, t.error]);

  const filteredReservations = useMemo(() => {
    if (filter === "all") {
      return reservations;
    }

    return reservations.filter((reservation) => reservation.status === filter);
  }, [filter, reservations]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    setError("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("reservations")
        .update({
          status,
        })
        .eq("id", id);

      if (updateError) {
        console.error(updateError);

        setError(t.updateError);

        return;
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                status,
              }
            : reservation,
        ),
      );
    } finally {
      setUpdatingId(null);
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

  const getStatusLabel = (status: ReservationStatus) => {
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
        <div className={styles.centerState}>{t.loading}</div>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className={styles.main}>
        <div className={styles.centerState}>
          <p>{t.forbidden}</p>

          <Link href={`/${locale}`}>← {t.home}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.homeLink}>
          ← {t.home}
        </Link>

        <div className={styles.headerRight}>
          <Link href={`/${locale}/account`} className={styles.accountLink}>
            {t.account}
          </Link>

          <div className={styles.languageSwitcher}>
            <Link
              href="/bg/admin"
              className={locale === "bg" ? styles.activeLanguage : ""}
            >
              BG
            </Link>

            <span>/</span>

            <Link
              href="/en/admin"
              className={locale === "en" ? styles.activeLanguage : ""}
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <h1>{t.title}</h1>

            <p>{t.subtitle}</p>
          </div>

          <span className={styles.total}>{reservations.length}</span>
        </div>

        <div className={styles.filters}>
          {[
            {
              value: "all",
              label: t.all,
            },
            {
              value: "pending",
              label: t.pending,
            },
            {
              value: "confirmed",
              label: t.confirmed,
            },
            {
              value: "cancelled",
              label: t.cancelled,
            },
            {
              value: "completed",
              label: t.completed,
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                filter === item.value
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setFilter(item.value as Filter)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {filteredReservations.length === 0 ? (
          <div className={styles.empty}>{t.empty}</div>
        ) : (
          <div className={styles.list}>
            {filteredReservations.map((reservation) => (
              <article key={reservation.id} className={styles.reservation}>
                <div className={styles.reservationTop}>
                  <div>
                    <strong className={styles.guestName}>
                      {reservation.guest_name}
                    </strong>

                    <p className={styles.contact}>
                      {reservation.phone} · {reservation.email}
                    </p>
                  </div>

                  <span
                    className={`${styles.status} ${
                      styles[`status_${reservation.status}`]
                    }`}
                  >
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>

                <div className={styles.details}>
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
                </div>

                {reservation.note && (
                  <div className={styles.note}>
                    <span>{t.note}</span>

                    <p>{reservation.note}</p>
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    type="button"
                    disabled={updatingId === reservation.id}
                    onClick={() => updateStatus(reservation.id, "confirmed")}
                  >
                    {t.confirm}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === reservation.id}
                    onClick={() => updateStatus(reservation.id, "cancelled")}
                  >
                    {t.cancel}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === reservation.id}
                    onClick={() => updateStatus(reservation.id, "completed")}
                  >
                    {t.complete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
