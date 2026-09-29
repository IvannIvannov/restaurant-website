"use client";

import { useEffect, useRef } from "react";

import MenuClient from "./menu/MenuClient";

import styles from "./menu-modal.module.css";

type Locale = "bg" | "en";

type MenuModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
};

const focusableElementsSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function MenuModal({ locale, isOpen, onClose }: MenuModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modal = modalRef.current;

      if (!modal) {
        return;
      }

      const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(focusableElementsSelector),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true",
      );

      if (focusableElements.length === 0) {
        event.preventDefault();

        return;
      }

      const firstElement = focusableElements[0];

      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();

        lastElement.focus();

        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();

        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      window.setTimeout(() => {
        previousFocusRef.current?.focus();
      }, 0);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "bg" ? "Меню на ресторанта" : "Restaurant menu"}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={locale === "bg" ? "Затвори менюто" : "Close menu"}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className={styles.content}>
          <MenuClient locale={locale} embedded />
        </div>
      </div>
    </div>
  );
}
