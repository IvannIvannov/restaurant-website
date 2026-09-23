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
    title: "Създай профил",
    subtitle: "Регистрирай се, за да управляваш своите резервации.",

    name: "Име",
    email: "Имейл",
    password: "Парола",
    confirmPassword: "Повтори паролата",

    show: "Покажи",
    hide: "Скрий",

    passwordHelp: "Паролата трябва да бъде поне 8 символа.",

    submit: "Регистрация",
    loading: "Създаваме профила...",

    haveAccount: "Вече имаш профил?",
    login: "Вход",

    passwordsDontMatch: "Двете пароли не съвпадат.",

    passwordTooShort: "Паролата трябва да бъде поне 8 символа.",

    required: "Моля, попълни всички задължителни полета.",

    success:
      "Регистрацията е успешна. Провери имейла си, за да потвърдиш профила си.",

    genericError: "Възникна проблем при регистрацията.",
  },

  en: {
    home: "Home",
    title: "Create an account",
    subtitle: "Register to manage your reservations.",

    name: "Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",

    show: "Show",
    hide: "Hide",

    passwordHelp: "Your password must contain at least 8 characters.",

    submit: "Create account",
    loading: "Creating account...",

    haveAccount: "Already have an account?",
    login: "Log in",

    passwordsDontMatch: "The passwords do not match.",

    passwordTooShort: "Your password must contain at least 8 characters.",

    required: "Please complete all required fields.",

    success:
      "Registration successful. Check your email to confirm your account.",

    genericError: "Something went wrong during registration.",
  },
};

export default function RegisterClient() {
  const params = useParams();

  const locale: Locale = params.locale === "en" ? "en" : "bg";

  const t = translations[locale];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError(t.required);
      return;
    }

    if (password.length < 8) {
      setError(t.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordsDontMatch);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      console.log("Supabase signup data:", data);

      if (signUpError) {
        console.error("Supabase signup error:", signUpError);

        setError(signUpError.message);
        return;
      }

      setSuccess(t.success);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (caughtError) {
      console.error("Registration catch error:", caughtError);

      if (caughtError instanceof Error) {
        setError(`${t.genericError} ${caughtError.message}`);
      } else {
        setError(t.genericError);
      }
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
            href="/bg/register"
            className={locale === "bg" ? styles.activeLanguage : ""}
          >
            BG
          </Link>

          <span>/</span>

          <Link
            href="/en/register"
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
              <label htmlFor="name">{t.name}</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>

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
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className={styles.passwordButton}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>

              <p className={styles.helper}>{t.passwordHelp}</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password">{t.confirmPassword}</label>

              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {success && <p className={styles.success}>{success}</p>}

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
          {t.haveAccount} <Link href={`/${locale}/login`}>{t.login}</Link>
        </p>
      </div>
    </main>
  );
}
