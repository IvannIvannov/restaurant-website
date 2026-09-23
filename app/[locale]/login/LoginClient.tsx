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
    subtitle: "Влез в профила си, за да управляваш резервациите си.",

    email: "Имейл",
    password: "Парола",

    show: "Покажи",
    hide: "Скрий",

    submit: "Вход",
    loading: "Влизане...",

    noAccount: "Все още нямаш профил?",
    register: "Регистрация",

    required: "Моля, въведи имейл и парола.",

    invalidCredentials: "Невалиден имейл или парола.",

    genericError: "Възникна проблем при входа. Опитай отново.",
  },

  en: {
    home: "Home",

    title: "Log in",
    subtitle: "Log in to manage your reservations.",

    email: "Email",
    password: "Password",

    show: "Show",
    hide: "Hide",

    submit: "Log in",
    loading: "Logging in...",

    noAccount: "Don't have an account yet?",
    register: "Register",

    required: "Please enter your email and password.",

    invalidCredentials: "Invalid email or password.",

    genericError: "Something went wrong while logging in. Please try again.",
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

    setError("");

    if (!email.trim() || !password) {
      setError(t.required);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(t.invalidCredentials);
        return;
      }

      router.push(`/${locale}`);
      router.refresh();
    } catch {
      setError(t.genericError);
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">{t.password}</label>

              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
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
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? t.loading : t.submit}
            </button>
          </form>
        </section>

        <p className={styles.bottomText}>
          {t.noAccount} <Link href={`/${locale}/register`}>{t.register}</Link>
        </p>
      </div>
    </main>
  );
}
