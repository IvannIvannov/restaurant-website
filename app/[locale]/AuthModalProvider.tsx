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

import { useRouter } from "next/navigation";

import AccountModal from "./AccountModal";
import AuthModal from "./AuthModal";

type Locale = "bg" | "en";

type AuthMode = "login" | "register";

type AuthModalContextValue = {
  openLogin: (returnTo?: string) => void;

  openRegister: (returnTo?: string) => void;

  openAccount: () => void;

  closeAuth: () => void;

  closeAccount: () => void;
};

type AuthState = {
  isOpen: boolean;
  mode: AuthMode;
  returnTo: string | null;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalProviderProps = {
  children: ReactNode;
  locale: Locale;
  isLoggedIn: boolean;
};

export default function AuthModalProvider({
  children,
  locale,
  isLoggedIn,
}: AuthModalProviderProps) {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    isOpen: false,
    mode: "login",
    returnTo: null,
  });

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const openLogin = useCallback((returnTo?: string) => {
    setIsAccountOpen(false);

    setAuthState({
      isOpen: true,
      mode: "login",
      returnTo: returnTo ?? null,
    });
  }, []);

  const openRegister = useCallback((returnTo?: string) => {
    setIsAccountOpen(false);

    setAuthState({
      isOpen: true,
      mode: "register",
      returnTo: returnTo ?? null,
    });
  }, []);

  const openAccount = useCallback(() => {
    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));

    setIsAccountOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));
  }, []);

  const closeAccount = useCallback(() => {
    setIsAccountOpen(false);
  }, []);

  const handleAuthenticated = useCallback(() => {
    const destination = authState.returnTo;

    const accountPath = `/${locale}/account`;

    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));

    if (destination && destination.replace(/\/+$/, "") === accountPath) {
      setIsAccountOpen(true);

      router.refresh();

      return;
    }

    if (destination) {
      router.push(destination);
    }

    router.refresh();
  }, [authState.returnTo, locale, router]);

  const handleLoggedOut = useCallback(() => {
    setIsAccountOpen(false);

    router.refresh();
  }, [router]);

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

      if (!(target instanceof Node)) {
        return;
      }

      let element: Element | null = null;

      if (target instanceof Element) {
        element = target;
      } else {
        element = target.parentElement;
      }

      if (!element) {
        return;
      }

      const anchor = element.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target === "_blank") {
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

      const normalizedPath = url.pathname.replace(/\/+$/, "");

      const loginPath = `/${locale}/login`;

      const registerPath = `/${locale}/register`;

      const accountPath = `/${locale}/account`;

      const protectedPaths = [`/${locale}/reservations`, `/${locale}/admin`];

      if (normalizedPath === loginPath) {
        event.preventDefault();

        event.stopImmediatePropagation();

        openLogin();

        return;
      }

      if (normalizedPath === registerPath) {
        event.preventDefault();

        event.stopImmediatePropagation();

        openRegister();

        return;
      }

      if (normalizedPath === accountPath) {
        event.preventDefault();

        event.stopImmediatePropagation();

        if (isLoggedIn) {
          openAccount();
        } else {
          openLogin(accountPath);
        }

        return;
      }

      const isProtectedPath = protectedPaths.some(
        (path) =>
          normalizedPath === path || normalizedPath.startsWith(`${path}/`),
      );

      if (!isLoggedIn && isProtectedPath) {
        event.preventDefault();

        event.stopImmediatePropagation();

        openLogin(`${url.pathname}${url.search}${url.hash}`);
      }
    };

    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [isLoggedIn, locale, openAccount, openLogin, openRegister]);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      openAccount,
      closeAuth,
      closeAccount,
    }),
    [openLogin, openRegister, openAccount, closeAuth, closeAccount],
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
        onAuthenticated={handleAuthenticated}
      />

      <AccountModal
        locale={locale}
        isOpen={isAccountOpen}
        onClose={closeAccount}
        onLoggedOut={handleLoggedOut}
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
