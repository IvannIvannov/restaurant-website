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

import AuthModal from "./AuthModal";

type Locale = "bg" | "en";

type AuthMode = "login" | "register";

type AuthModalContextValue = {
  openLogin: (returnTo?: string) => void;

  openRegister: (returnTo?: string) => void;

  closeAuth: () => void;
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

  const openLogin = useCallback((returnTo?: string) => {
    setAuthState({
      isOpen: true,
      mode: "login",
      returnTo: returnTo ?? null,
    });
  }, []);

  const openRegister = useCallback((returnTo?: string) => {
    setAuthState({
      isOpen: true,
      mode: "register",
      returnTo: returnTo ?? null,
    });
  }, []);

  const closeAuth = useCallback(() => {
    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));
  }, []);

  const handleAuthenticated = useCallback(() => {
    const destination = authState.returnTo;

    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));

    if (destination) {
      router.push(destination);
    }

    router.refresh();
  }, [authState.returnTo, router]);

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

      const protectedPaths = [
        `/${locale}/reservations`,
        `/${locale}/account`,
        `/${locale}/admin`,
      ];

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
  }, [isLoggedIn, locale, openLogin, openRegister]);

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
        onAuthenticated={handleAuthenticated}
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
