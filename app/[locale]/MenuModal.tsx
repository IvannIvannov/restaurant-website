"use client";

import { useEffect } from "react";

import MenuClient from "./menu/MenuClient";

import styles from "./menu-modal.module.css";

type Locale = "bg" | "en";

type MenuModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuModal({ locale, isOpen, onClose }: MenuModalProps) {
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
      aria-label={locale === "bg" ? "Меню" : "Menu"}
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
          aria-label={locale === "bg" ? "Затвори менюто" : "Close menu"}
        >
          ×
        </button>

        <div className={styles.content}>
          <MenuClient locale={locale} embedded />
        </div>
      </div>
    </div>
  );
}
