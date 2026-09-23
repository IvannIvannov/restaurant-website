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

    title: "Забравена парола",

    subtitle:
      "Въведи имейла си и ще ти изпратим линк за създаване на нова парола.",

    email: "Имейл",

    placeholder: "name@example.com",

    submit: "Изпрати линк",

    submitting: "Изпращане...",

    success: "Провери имейла си",

    successText:
      "Изпратихме ти линк за възстановяване на паролата. Отвори го, за да зададеш нова парола.",

    error: "Не успяхме да изпратим имейла. Опитай отново след малко.",

    back: "Обратно към вход",
  },

  en: {
    home: "Home",

    title: "Forgot password",

    subtitle:
      "Enter your email and we'll send you a link to create a new password.",

    email: "Email",

    placeholder: "name@example.com",

    submit: "Send reset link",

    submitting: "Sending...",

    success: "Check your email",

    successText:
      "We've sent you a password recovery link. Open it to create a new password.",

    error: "We couldn't send the email. Please try again shortly.",

    back: "Back to login",
  },
};

export default function ForgotPasswordClient() {
  const params = useParams();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const redirectTo =
        `${window.location.origin}` +
        `/auth/callback` +
        `?next=/${locale}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

      if (resetError) {
        console.error("Password reset error:", resetError);

        setError(resetError.message);

        return;
      }

      setSuccess(true);
    } catch (caughtError) {
      console.error("Password reset error:", caughtError);

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
            href="/bg/forgot-password"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/forgot-password"
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

              <Link href={`/${locale}/login`} className={styles.backLink}>
                ← {t.back}
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">{t.email}</label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  placeholder={t.placeholder}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? t.submitting : t.submit}
              </button>

              <Link href={`/${locale}/login`} className={styles.backLink}>
                ← {t.back}
              </Link>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
