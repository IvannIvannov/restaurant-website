"use client";

import Link from "next/link";

import { FormEvent, useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { createClient } from "../../lib/supabase/client";

import styles from "./account-modal.module.css";

type Locale = "bg" | "en";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

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
  status: ReservationStatus;
};

type AccountModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  onLoggedOut: () => void;
};

const translations = {
  bg: {
    eyebrow: "Твоят профил",

    title: "Моят акаунт",

    description: "Управлявай личните си данни и резервациите си.",

    personalInfo: "Лични данни",

    reservations: "Моите резервации",

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

    cancelReservation: "Откажи",

    cancelling: "Отказване...",

    cancelConfirm: "Сигурна ли си, че искаш да откажеш тази резервация?",

    cancelError: "Резервацията не можа да бъде отказана.",

    logout: "Изход",

    loggingOut: "Излизане...",

    loading: "Зареждане...",

    error: "Възникна проблем при зареждането на профила.",
  },

  en: {
    eyebrow: "Your profile",

    title: "My account",

    description: "Manage your personal details and reservations.",

    personalInfo: "Personal information",

    reservations: "My reservations",

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

    cancelReservation: "Cancel",

    cancelling: "Cancelling...",

    cancelConfirm: "Are you sure you want to cancel this reservation?",

    cancelError: "The reservation could not be cancelled.",

    logout: "Log out",

    loggingOut: "Logging out...",

    loading: "Loading...",

    error: "Something went wrong while loading your account.",
  },
};

export default function AccountModal({
  locale,
  isOpen,
  onClose,
  onLoggedOut,
}: AccountModalProps) {
  const t = translations[locale];

  const [profile, setProfile] = useState<Profile | null>(null);

  const [email, setEmail] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(false);

  const [editName, setEditName] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let active = true;

    const loadAccount = async () => {
      setLoading(true);

      setError("");

      setMessage("");

      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (active) {
            setError(t.error);
          }

          return;
        }

        if (!active) {
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

          if (active) {
            setError(t.error);
          }

          return;
        }

        if (!active) {
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
        } else if (active) {
          setReservations(reservationsData ?? []);
        }
      } catch (caughtError) {
        console.error("Account load error:", caughtError);

        if (active) {
          setError(t.error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      active = false;
    };
  }, [isOpen, t.error]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
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

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      onClose();

      onLoggedOut();
    } finally {
      setLogoutLoading(false);
    }
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

  const canCancel = (status: ReservationStatus) =>
    status === "pending" || status === "confirmed";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.22,
          }}
          onMouseDown={handleBackdropClick}
        >
          <motion.section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 12,
            }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <span />

              <span />
            </button>

            <header className={styles.header}>
              <p className={styles.eyebrow}>{t.eyebrow}</p>

              <h2 id="account-modal-title">{t.title}</h2>

              <p className={styles.description}>{t.description}</p>
            </header>

            {loading ? (
              <div className={styles.loading}>{t.loading}</div>
            ) : (
              <>
                {error && <p className={styles.error}>{error}</p>}

                {message && <p className={styles.success}>{message}</p>}

                {profile && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>{t.personalInfo}</h3>

                      {!editing && (
                        <button
                          type="button"
                          className={styles.textButton}
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
                        <div className={styles.twoColumns}>
                          <label className={styles.field}>
                            <span>{t.name}</span>

                            <input
                              type="text"
                              value={editName}
                              onChange={(event) =>
                                setEditName(event.target.value)
                              }
                            />
                          </label>

                          <label className={styles.field}>
                            <span>{t.phone}</span>

                            <input
                              type="tel"
                              value={editPhone}
                              onChange={(event) =>
                                setEditPhone(event.target.value)
                              }
                            />
                          </label>
                        </div>

                        <div className={styles.profileActions}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={cancelProfileEdit}
                          >
                            {t.cancel}
                          </button>

                          <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={savingProfile}
                          >
                            {savingProfile ? t.saving : t.save}
                          </button>
                        </div>
                      </form>
                    ) : (
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
                    )}
                  </section>
                )}

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3>{t.reservations}</h3>

                    <Link
                      href={`/${locale}/reservations`}
                      className={styles.reserveButton}
                      onClick={onClose}
                    >
                      {t.createReservation}

                      <span>↗</span>
                    </Link>
                  </div>

                  {reservations.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>{t.noReservations}</p>
                    </div>
                  ) : (
                    <div className={styles.reservations}>
                      {reservations.map((reservation) => (
                        <article
                          key={reservation.id}
                          className={styles.reservation}
                        >
                          <div className={styles.reservationMain}>
                            <div className={styles.reservationDate}>
                              <strong>{reservation.reservation_date}</strong>

                              <span>
                                {reservation.reservation_time.slice(0, 5)}
                              </span>
                            </div>

                            <div className={styles.reservationMeta}>
                              <span>
                                {reservation.guests} {t.guests}
                              </span>

                              <span>
                                {getSeatingLabel(
                                  reservation.seating_preference,
                                )}
                              </span>
                            </div>
                          </div>

                          <div className={styles.reservationSide}>
                            <span
                              className={`${styles.status} ${
                                styles[
                                  `status${reservation.status
                                    .charAt(0)
                                    .toUpperCase()}${reservation.status.slice(
                                    1,
                                  )}`
                                ]
                              }`}
                            >
                              {getStatusLabel(reservation.status)}
                            </span>

                            {canCancel(reservation.status) && (
                              <button
                                type="button"
                                className={styles.cancelReservation}
                                disabled={cancellingId === reservation.id}
                                onClick={() =>
                                  cancelReservation(reservation.id)
                                }
                              >
                                {cancellingId === reservation.id
                                  ? t.cancelling
                                  : t.cancelReservation}
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <div className={styles.footer}>
                  <button
                    type="button"
                    className={styles.logoutButton}
                    disabled={logoutLoading}
                    onClick={handleLogout}
                  >
                    {logoutLoading ? t.loggingOut : t.logout}
                  </button>
                </div>
              </>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
