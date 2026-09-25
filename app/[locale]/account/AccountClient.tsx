"use client";

import Link from "next/link";

import { FormEvent, useEffect, useState } from "react";

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

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

type Reservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  seating_preference: "inside" | "outside" | "none";
  status: ReservationStatus;
};

const translations = {
  bg: {
    home: "Начало",
    account: "Акаунт",

    title: "Моят профил",
    subtitle:
      "Управлявай личните си данни и предстоящите резервации на едно място.",

    personalInfo: "Лични данни",

    name: "Име",
    email: "Имейл",
    phone: "Телефон",
    role: "Профил",

    customer: "Клиент",
    admin: "Администратор",

    noPhone: "Не е добавен",

    edit: "Редактирай",
    save: "Запази",
    saving: "Запазване...",
    cancel: "Отказ",

    profileUpdated: "Профилът е обновен успешно.",

    profileUpdateError: "Неуспешно обновяване на профила.",

    reservations: "Моите резервации",

    noReservations: "Все още нямаш предстоящи резервации.",

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

    cancelReservation: "Откажи резервацията",

    cancelling: "Отказване...",

    cancelConfirm: "Сигурна ли си, че искаш да откажеш тази резервация?",

    cancelError: "Резервацията не можа да бъде отказана.",

    logout: "Изход",
    loggingOut: "Излизане...",

    loading: "Зареждане на профила...",

    error: "Възникна проблем при зареждането на профила.",
  },

  en: {
    home: "Home",
    account: "Account",

    title: "My account",
    subtitle:
      "Manage your personal details and upcoming reservations in one place.",

    personalInfo: "Personal information",

    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Account",

    customer: "Customer",
    admin: "Administrator",

    noPhone: "Not added",

    edit: "Edit",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",

    profileUpdated: "Profile updated successfully.",

    profileUpdateError: "Unable to update profile.",

    reservations: "My reservations",

    noReservations: "You don't have any upcoming reservations yet.",

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

    cancelReservation: "Cancel reservation",

    cancelling: "Cancelling...",

    cancelConfirm: "Are you sure you want to cancel this reservation?",

    cancelError: "The reservation could not be cancelled.",

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

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [editing, setEditing] = useState(false);

  const [editName, setEditName] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

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

        setEditName(profileData.full_name ?? "");

        setEditPhone(profileData.phone ?? "");

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

      router.push(`/${locale}`);

      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setSavingProfile(true);

    setError("");

    setMessage("");

    try {
      const supabase = createClient();

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: editName.trim(),
          phone: editPhone.trim() ? editPhone.trim() : null,
        })
        .eq("id", profile.id)
        .select("id, full_name, phone, role")
        .single();

      if (updateError) {
        console.error("Profile update error:", updateError);

        setError(t.profileUpdateError);

        return;
      }

      setProfile(data);

      setEditing(false);

      setMessage(t.profileUpdated);
    } catch (caughtError) {
      console.error("Profile update error:", caughtError);

      setError(t.profileUpdateError);
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelProfileEdit = () => {
    setEditName(profile?.full_name ?? "");

    setEditPhone(profile?.phone ?? "");

    setEditing(false);
  };

  const cancelReservation = async (reservationId: string) => {
    const shouldCancel = window.confirm(t.cancelConfirm);

    if (!shouldCancel) {
      return;
    }

    setCancellingId(reservationId);

    setError("");

    setMessage("");

    try {
      const supabase = createClient();

      const { error: cancelError } = await supabase.rpc(
        "cancel_own_reservation",
        {
          reservation_id: reservationId,
        },
      );

      if (cancelError) {
        console.error("Cancel reservation error:", cancelError);

        setError(t.cancelError);

        return;
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId
            ? {
                ...reservation,
                status: "cancelled",
              }
            : reservation,
        ),
      );
    } catch (caughtError) {
      console.error("Cancel reservation error:", caughtError);

      setError(t.cancelError);
    } finally {
      setCancellingId(null);
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

  const canCancel = (status: ReservationStatus) => {
    return status === "pending" || status === "confirmed";
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.background} />

        <div className={styles.loadingState}>{t.loading}</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.background} />

      <div className={styles.pageShell}>
        <section className={styles.accountPanel}>
          <div className={styles.topBar}>
            <Link href={`/${locale}`} className={styles.homeLink}>
              <span>←</span>

              {t.home}
            </Link>

            <div className={styles.topActions}>
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
          </div>

          <div className={styles.heading}>
            <p className={styles.eyebrow}>{t.account}</p>

            <h1>{t.title}</h1>

            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {message && <p className={styles.successMessage}>{message}</p>}

          {profile && (
            <section className={styles.accountSection}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionNumber}>01</span>

                  <h2>{t.personalInfo}</h2>
                </div>

                {!editing && (
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => setEditing(true)}
                  >
                    {t.edit}
                  </button>
                )}
              </div>

              {editing ? (
                <form
                  className={styles.profileForm}
                  onSubmit={handleProfileSave}
                >
                  <div className={styles.formGrid}>
                    <div className={styles.profileInputGroup}>
                      <label htmlFor="profile-name">{t.name}</label>

                      <input
                        id="profile-name"
                        type="text"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                      />
                    </div>

                    <div className={styles.profileInputGroup}>
                      <label htmlFor="profile-phone">{t.phone}</label>

                      <input
                        id="profile-phone"
                        type="tel"
                        value={editPhone}
                        onChange={(event) => setEditPhone(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.profileActions}>
                    <button
                      type="button"
                      className={styles.profileCancelButton}
                      onClick={cancelProfileEdit}
                    >
                      {t.cancel}
                    </button>

                    <button
                      type="submit"
                      className={styles.profileSaveButton}
                      disabled={savingProfile}
                    >
                      {savingProfile ? t.saving : t.save}
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span>{t.name}</span>

                    <strong>{profile.full_name || "—"}</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span>{t.email}</span>

                    <strong>{email}</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span>{t.phone}</span>

                    <strong>{profile.phone || t.noPhone}</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span>{t.role}</span>

                    <strong>
                      {profile.role === "admin" ? t.admin : t.customer}
                    </strong>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className={styles.accountSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionNumber}>02</span>

                <h2>{t.reservations}</h2>
              </div>

              <Link
                href={`/${locale}/reservations`}
                className={styles.reservationButton}
              >
                {t.createReservation}

                <span>↗</span>
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>+</div>

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

                      <strong>
                        {reservation.reservation_time.slice(0, 5)}
                      </strong>
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

                      <strong
                        className={`${styles.status} ${
                          styles[
                            `status${reservation.status
                              .charAt(0)
                              .toUpperCase()}${reservation.status.slice(1)}`
                          ]
                        }`}
                      >
                        {getStatusLabel(reservation.status)}
                      </strong>
                    </div>

                    {canCancel(reservation.status) && (
                      <div className={styles.reservationActions}>
                        <button
                          type="button"
                          disabled={cancellingId === reservation.id}
                          onClick={() => cancelReservation(reservation.id)}
                        >
                          {cancellingId === reservation.id
                            ? t.cancelling
                            : t.cancelReservation}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
