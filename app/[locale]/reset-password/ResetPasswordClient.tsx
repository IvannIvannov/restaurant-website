"use client";

import Link from "next/link";

import { FormEvent, useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import { useRouter } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import styles from "./reset-password.module.css";

type Locale = "bg" | "en";

type ResetPasswordClientProps = {
  locale: Locale;
};

export default function ResetPasswordClient({
  locale,
}: ResetPasswordClientProps) {
  const router = useRouter();

  const shouldReduceMotion = useReducedMotion();

  const isBg = locale === "bg";

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError(
        isBg
          ? "Паролата трябва да бъде поне 6 символа."
          : "Password must be at least 6 characters.",
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(isBg ? "Паролите не съвпадат." : "Passwords do not match.");

      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        isBg
          ? "Паролата е променена успешно."
          : "Your password has been changed successfully.",
      );

      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        router.push(`/${locale}`);

        router.refresh();
      }, 1200);
    } catch (resetError) {
      const message = resetError instanceof Error ? resetError.message : "";

      if (message.toLowerCase().includes("session")) {
        setError(
          isBg
            ? "Линкът за промяна на паролата е невалиден или е изтекъл. Изпрати нова заявка за възстановяване."
            : "The password reset link is invalid or has expired. Please request a new reset link.",
        );
      } else {
        setError(
          isBg
            ? "Не успяхме да променим паролата. Опитай отново."
            : "We couldn't update your password. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <div className={styles.overlay} />

      <Link href={`/${locale}`} className={styles.logo}>
        RESTAURANT
      </Link>

      <motion.section
        className={styles.card}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 28,
                scale: 0.975,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.7,

          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            {isBg ? "Възстановяване на достъп" : "Recover access"}
          </p>

          <h1>{isBg ? "Нова парола" : "New password"}</h1>

          <p className={styles.description}>
            {isBg
              ? "Създай нова парола за профила си. Избери парола, която не си използвал преди."
              : "Create a new password for your account. Choose one you haven't used before."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>{isBg ? "Нова парола" : "New password"}</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={loading}
            />
          </label>

          <label className={styles.field}>
            <span>{isBg ? "Повтори паролата" : "Confirm password"}</span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={loading}
            />
          </label>

          {error && (
            <motion.p
              className={styles.error}
              initial={{
                opacity: 0,
                y: -6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              className={styles.success}
              initial={{
                opacity: 0,
                y: -6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {success}
            </motion.p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <span>
              {loading
                ? isBg
                  ? "Запазване..."
                  : "Saving..."
                : isBg
                  ? "Запази новата парола"
                  : "Save new password"}
            </span>

            {!loading && <span className={styles.arrow}>↗</span>}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href={`/${locale}`}>
            <span>←</span>

            {isBg ? "Назад към началната страница" : "Back to home"}
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
