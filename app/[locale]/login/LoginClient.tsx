"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "../../../lib/supabase/client";

import styles from "../auth.module.css";

type Locale = "bg" | "en";

const translations = {
  bg: {
    home: "Начало",

    title: "Вход",

    subtitle: "Влез в профила си, за да управляваш своите резервации.",

    email: "Имейл",

    password: "Парола",

    show: "Покажи",
    hide: "Скрий",

    forgot: "Забравена парола?",

    submit: "Вход",

    submitting: "Влизане...",

    error: "Невалиден имейл или парола.",

    noAccount: "Все още нямаш профил?",

    register: "Регистрация",
  },

  en: {
    home: "Home",

    title: "Log in",

    subtitle: "Log in to manage your reservations.",

    email: "Email",

    password: "Password",

    show: "Show",
    hide: "Hide",

    forgot: "Forgot password?",

    submit: "Log in",

    submitting: "Logging in...",

    error: "Invalid email or password.",

    noAccount: "Don't have an account yet?",

    register: "Create account",
  },
};

export default function LoginClient() {
  const params = useParams();
  const router = useRouter();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),

        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);

        setError(t.error);

        return;
      }

      router.push(`/${locale}/account`);

      router.refresh();
    } catch (caughtError) {
      console.error("Login error:", caughtError);

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
            href="/bg/login"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/login"
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
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">{t.email}</label>

              <input
                id="email"
                type="email"
                required
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="password">{t.password}</label>

                <Link
                  href={`/${locale}/forgot-password`}
                  className={styles.forgotLink}
                >
                  {t.forgot}
                </Link>
              </div>

              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  autoComplete="current-password"
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

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>

          <p className={styles.bottomText}>
            {t.noAccount} <Link href={`/${locale}/register`}>{t.register}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
