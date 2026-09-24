"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthModal from "./AuthModal";

type Locale = "bg" | "en";

type AuthMode = "login" | "register";

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalProviderProps = {
  children: ReactNode;
  locale: Locale;
};

export default function AuthModalProvider({
  children,
  locale,
}: AuthModalProviderProps) {
  const [authState, setAuthState] = useState<{
    isOpen: boolean;
    mode: AuthMode;
  }>({
    isOpen: false,
    mode: "login",
  });

  const openLogin = useCallback(() => {
    setAuthState({
      isOpen: true,
      mode: "login",
    });
  }, []);

  const openRegister = useCallback(() => {
    setAuthState({
      isOpen: true,
      mode: "register",
    });
  }, []);

  const closeAuth = useCallback(() => {
    setAuthState((current) => ({
      ...current,
      isOpen: false,
    }));
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href) {
        return;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.pathname === `/${locale}/login`) {
        event.preventDefault();
        event.stopPropagation();

        openLogin();

        return;
      }

      if (url.pathname === `/${locale}/register`) {
        event.preventDefault();
        event.stopPropagation();

        openRegister();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [locale, openLogin, openRegister]);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      closeAuth,
    }),
    [openLogin, openRegister, closeAuth],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      <AuthModal
        key={`${locale}-${authState.mode}`}
        locale={locale}
        isOpen={authState.isOpen}
        initialMode={authState.mode}
        onClose={closeAuth}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider.");
  }

  return context;
}
