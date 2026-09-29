"use client";

import { useEffect } from "react";

import ReservationClient from "./reservations/ReservationClient";

import styles from "./reservation-modal.module.css";

type Locale = "bg" | "en";

type ReservationModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReservationModal({
  locale,
  isOpen,
  onClose,
}: ReservationModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={locale === "bg" ? "Запази маса" : "Reserve a table"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={locale === "bg" ? "Затвори" : "Close"}
        >
          ×
        </button>

        <ReservationClient embedded />
      </div>
    </div>
  );
}
