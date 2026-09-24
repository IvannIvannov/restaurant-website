"use client";

import { FormEvent, useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { createClient } from "../../lib/supabase/client";

import styles from "./auth-modal.module.css";

type Locale = "bg" | "en";

type AuthMode = "login" | "register";

type ModalMode = AuthMode | "forgot";

type AuthModalProps = {
  locale: Locale;
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onAuthenticated: () => void;
};

export default function AuthModal({
  locale,
  isOpen,
  initialMode = "login",
  onClose,
  onAuthenticated,
}: AuthModalProps) {
  const shouldReduceMotion = useReducedMotion();

  const [mode, setMode] = useState<ModalMode>(initialMode);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const isBg = locale === "bg";

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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const changeMode = (nextMode: ModalMode) => {
    setMode(nextMode);

    resetMessages();

    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetMessages();

    if (!email.trim()) {
      setError(
        isBg ? "Моля, въведи имейл адрес." : "Please enter your email address.",
      );

      return;
    }

    if (!password) {
      setError(isBg ? "Моля, въведи парола." : "Please enter your password.");

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
        throw signInError;
      }

      setSuccess(isBg ? "Успешен вход." : "Successfully signed in.");

      window.setTimeout(() => {
        onAuthenticated();
      }, 350);
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "";

      if (message.toLowerCase().includes("invalid login credentials")) {
        setError(
          isBg ? "Невалиден имейл или парола." : "Invalid email or password.",
        );
      } else {
        setError(
          isBg
            ? "Възникна проблем при входа. Опитай отново."
            : "Something went wrong while signing in. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetMessages();

    if (!fullName.trim()) {
      setError(isBg ? "Моля, въведи име." : "Please enter your name.");

      return;
    }

    if (!email.trim()) {
      setError(
        isBg ? "Моля, въведи имейл адрес." : "Please enter your email address.",
      );

      return;
    }

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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),

        password,

        options: {
          data: {
            full_name: fullName.trim(),

            phone: phone.trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        setSuccess(
          isBg
            ? "Профилът е създаден успешно."
            : "Your account was created successfully.",
        );

        window.setTimeout(() => {
          onAuthenticated();
        }, 400);

        return;
      }

      setSuccess(
        isBg
          ? "Регистрацията е успешна. Влез в профила си."
          : "Registration successful. Please sign in.",
      );

      window.setTimeout(() => {
        setMode("login");

        setPassword("");

        setConfirmPassword("");

        setSuccess("");
      }, 900);
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "";

      if (message.toLowerCase().includes("already registered")) {
        setError(
          isBg
            ? "Вече има профил с този имейл."
            : "An account with this email already exists.",
        );
      } else {
        setError(
          isBg
            ? "Възникна проблем при регистрацията. Опитай отново."
            : "Something went wrong while creating your account.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    resetMessages();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        isBg ? "Моля, въведи имейл адрес." : "Please enter your email address.",
      );

      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/${locale}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo,
        },
      );

      if (resetError) {
        throw resetError;
      }

      setSuccess(
        isBg
          ? "Изпратихме ти линк за промяна на паролата. Провери имейла си."
          : "We sent you a password reset link. Check your email.",
      );
    } catch {
      setError(
        isBg
          ? "Не успяхме да изпратим линка. Провери имейла и опитай отново."
          : "We couldn't send the reset link. Check your email and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getEyebrow = () => {
    if (mode === "forgot") {
      return isBg ? "Възстановяване на достъп" : "Recover access";
    }

    if (mode === "register") {
      return isBg ? "Създай профил" : "Create an account";
    }

    return isBg ? "Добре дошли отново" : "Welcome back";
  };

  const getTitle = () => {
    if (mode === "forgot") {
      return isBg ? "Забравена парола" : "Forgot password";
    }

    if (mode === "register") {
      return isBg ? "Регистрация" : "Register";
    }

    return isBg ? "Вход" : "Sign in";
  };

  const getDescription = () => {
    if (mode === "forgot") {
      return isBg
        ? "Въведи имейла, с който си се регистрирал. Ще ти изпратим линк за създаване на нова парола."
        : "Enter the email address you registered with. We'll send you a link to create a new password.";
    }

    if (mode === "register") {
      return isBg
        ? "Създай профил за по-бързи резервации и лесно управление."
        : "Create an account for faster bookings and easy reservation management.";
    }

    return isBg
      ? "Влез в профила си, за да продължиш."
      : "Sign in to continue.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.28,
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                    scale: 0.965,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 14,
              scale: 0.98,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.42,

              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label={isBg ? "Затвори" : "Close"}
            >
              <span />
              <span />
            </button>

            <div className={styles.header}>
              <p className={styles.eyebrow}>{getEyebrow()}</p>

              <h2 id="auth-modal-title">{getTitle()}</h2>

              <p className={styles.description}>{getDescription()}</p>
            </div>

            {mode !== "forgot" && (
              <div className={styles.modeSwitch}>
                <button
                  type="button"
                  className={mode === "login" ? styles.activeMode : ""}
                  onClick={() => changeMode("login")}
                >
                  {isBg ? "Вход" : "Sign in"}
                </button>

                <button
                  type="button"
                  className={mode === "register" ? styles.activeMode : ""}
                  onClick={() => changeMode("register")}
                >
                  {isBg ? "Регистрация" : "Register"}
                </button>

                <motion.span
                  className={styles.modeIndicator}
                  animate={{
                    x: mode === "login" ? "0%" : "100%",
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,

                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              {mode === "login" && (
                <motion.form
                  key="login"
                  className={styles.form}
                  onSubmit={handleLogin}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 12,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.28,
                  }}
                >
                  <label className={styles.field}>
                    <span>Email</span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>{isBg ? "Парола" : "Password"}</span>

                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                  </label>

                  <div className={styles.formMeta}>
                    <button type="button" onClick={() => changeMode("forgot")}>
                      {isBg ? "Забравена парола?" : "Forgot password?"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className={styles.error}
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
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
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                      >
                        {success}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? isBg
                          ? "Влизане..."
                          : "Signing in..."
                        : isBg
                          ? "Вход"
                          : "Sign in"}
                    </span>

                    {!loading && <span className={styles.submitArrow}>↗</span>}
                  </button>

                  <p className={styles.bottomText}>
                    {isBg ? "Нямаш профил?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => changeMode("register")}
                    >
                      {isBg ? "Регистрирай се" : "Create one"}
                    </button>
                  </p>
                </motion.form>
              )}

              {mode === "register" && (
                <motion.form
                  key="register"
                  className={styles.form}
                  onSubmit={handleRegister}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: 12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -12,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.28,
                  }}
                >
                  <div className={styles.twoColumns}>
                    <label className={styles.field}>
                      <span>{isBg ? "Име" : "Name"}</span>

                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        autoComplete="name"
                        placeholder={isBg ? "Твоето име" : "Your name"}
                      />
                    </label>

                    <label className={styles.field}>
                      <span>{isBg ? "Телефон" : "Phone"}</span>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        autoComplete="tel"
                        placeholder="+359..."
                      />
                    </label>
                  </div>

                  <label className={styles.field}>
                    <span>Email</span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </label>

                  <div className={styles.twoColumns}>
                    <label className={styles.field}>
                      <span>{isBg ? "Парола" : "Password"}</span>

                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                    </label>

                    <label className={styles.field}>
                      <span>
                        {isBg ? "Повтори паролата" : "Confirm password"}
                      </span>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                    </label>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className={styles.error}
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
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
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                      >
                        {success}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? isBg
                          ? "Създаване..."
                          : "Creating..."
                        : isBg
                          ? "Създай профил"
                          : "Create account"}
                    </span>

                    {!loading && <span className={styles.submitArrow}>↗</span>}
                  </button>

                  <p className={styles.bottomText}>
                    {isBg ? "Вече имаш профил?" : "Already have an account?"}{" "}
                    <button type="button" onClick={() => changeMode("login")}>
                      {isBg ? "Влез" : "Sign in"}
                    </button>
                  </p>
                </motion.form>
              )}

              {mode === "forgot" && (
                <motion.form
                  key="forgot"
                  className={styles.form}
                  onSubmit={handleForgotPassword}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: 12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -12,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.28,
                  }}
                >
                  <label className={styles.field}>
                    <span>Email</span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </label>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className={styles.error}
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
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
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                      >
                        {success}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? isBg
                          ? "Изпращане..."
                          : "Sending..."
                        : isBg
                          ? "Изпрати линк"
                          : "Send reset link"}
                    </span>

                    {!loading && <span className={styles.submitArrow}>↗</span>}
                  </button>

                  <p className={styles.bottomText}>
                    {isBg ? "Спомни си паролата?" : "Remember your password?"}{" "}
                    <button type="button" onClick={() => changeMode("login")}>
                      {isBg ? "Назад към вход" : "Back to sign in"}
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
