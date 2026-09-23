"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import styles from "../auth.module.css";

type Locale = "bg" | "en";

const translations = {
  bg: {
    home: "Начало",

    title: "Нова парола",

    subtitle: "Избери нова парола за своя акаунт.",

    password: "Нова парола",

    confirmPassword: "Повтори паролата",

    requirement: "Паролата трябва да съдържа поне 8 символа.",

    mismatch: "Паролите не съвпадат.",

    submit: "Запази новата парола",

    submitting: "Запазване...",

    show: "Покажи",

    hide: "Скрий",

    success: "Паролата е променена успешно.",

    successText: "Вече можеш да влезеш с новата си парола.",

    login: "Вход в профила",

    error: "Паролата не можа да бъде променена. Линкът може да е изтекъл.",
  },

  en: {
    home: "Home",

    title: "New password",

    subtitle: "Choose a new password for your account.",

    password: "New password",

    confirmPassword: "Confirm password",

    requirement: "Your password must contain at least 8 characters.",

    mismatch: "The passwords do not match.",

    submit: "Save new password",

    submitting: "Saving...",

    show: "Show",

    hide: "Hide",

    success: "Your password has been changed successfully.",

    successText: "You can now log in using your new password.",

    login: "Log in",

    error:
      "Your password could not be changed. The recovery link may have expired.",
  },
};

export default function ResetPasswordClient() {
  const params = useParams();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(t.requirement);

      return;
    }

    if (password !== confirmPassword) {
      setError(t.mismatch);

      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);

        setError(updateError.message);

        return;
      }

      await supabase.auth.signOut();

      setSuccess(true);
    } catch (caughtError) {
      console.error("Password update error:", caughtError);

      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.homeLink}>
          ← {t.home}
        </Link>

        <div className={styles.languageSwitcher}>
          <Link
            href="/bg/reset-password"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/reset-password"
            className={locale === "en" ? styles.activeLanguage : ""}
          >
            EN
          </Link>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>
        </div>

        <section className={styles.card}>
          {success ? (
            <div>
              <p className={styles.success}>{t.success}</p>

              <p className={styles.helper}>{t.successText}</p>

              <Link href={`/${locale}/login`} className={styles.submitLink}>
                {t.login}
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="password">{t.password}</label>

                <div className={styles.passwordWrap}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    autoComplete="new-password"
                    onChange={(event) => setPassword(event.target.value)}
                  />

                  <button
                    type="button"
                    className={styles.passwordButton}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? t.hide : t.show}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirm-password">{t.confirmPassword}</label>

                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              <p className={styles.helper}>{t.requirement}</p>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
