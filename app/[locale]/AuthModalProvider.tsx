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

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const AuthModal = dynamic(() => import("./AuthModal"), {
  ssr: false,
  loading: () => null,
});

const AccountModal = dynamic(() => import("./AccountModal"), {
  ssr: false,
  loading: () => null,
});

const MenuModal = dynamic(() => import("./MenuModal"), {
  ssr: false,
  loading: () => null,
});

const ReservationModal = dynamic(() => import("./ReservationModal"), {
  ssr: false,
  loading: () => null,
});

type Locale = "bg" | "en";

type AuthMode = "login" | "register";

type AuthModalContextValue = {
  openLogin: (returnTo?: string) => void;
  openRegister: (returnTo?: string) => void;
  openAccount: () => void;
  openMenu: () => void;
  openReservation: () => void;
  closeAuth: () => void;
  closeAccount: () => void;
  closeMenu: () => void;
  closeReservation: () => void;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const [hasLoadedAuthModal, setHasLoadedAuthModal] = useState(false);
  const [hasLoadedAccountModal, setHasLoadedAccountModal] = useState(false);
  const [hasLoadedMenuModal, setHasLoadedMenuModal] = useState(false);
  const [hasLoadedReservationModal, setHasLoadedReservationModal] =
    useState(false);

  const closeEverything = useCallback(() => {
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    setIsReservationOpen(false);

    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));
  }, []);

  const openLogin = useCallback((returnTo?: string) => {
    setHasLoadedAuthModal(true);

    setIsAccountOpen(false);
    setIsMenuOpen(false);
    setIsReservationOpen(false);

    setAuthState({
      isOpen: true,
      mode: "login",
      returnTo: returnTo ?? null,
    });
  }, []);

  const openRegister = useCallback((returnTo?: string) => {
    setHasLoadedAuthModal(true);

    setIsAccountOpen(false);
    setIsMenuOpen(false);
    setIsReservationOpen(false);

    setAuthState({
      isOpen: true,
      mode: "register",
      returnTo: returnTo ?? null,
    });
  }, []);

  const openAccount = useCallback(() => {
    closeEverything();

    setHasLoadedAccountModal(true);
    setIsAccountOpen(true);
  }, [closeEverything]);

  const openMenu = useCallback(() => {
    closeEverything();

    setHasLoadedMenuModal(true);
    setIsMenuOpen(true);
  }, [closeEverything]);

  const openReservation = useCallback(() => {
    closeEverything();

    setHasLoadedReservationModal(true);
    setIsReservationOpen(true);
  }, [closeEverything]);

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

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const closeReservation = useCallback(() => {
    setIsReservationOpen(false);
  }, []);

  const handleAuthenticated = useCallback(() => {
    const destination = authState.returnTo;

    const accountPath = `/${locale}/account`;
    const reservationPath = `/${locale}/reservations`;

    setAuthState((current) => ({
      ...current,
      isOpen: false,
      returnTo: null,
    }));

    if (destination && destination.replace(/\/+$/, "") === accountPath) {
      setHasLoadedAccountModal(true);
      setIsAccountOpen(true);

      router.refresh();
      return;
    }

    if (destination && destination.replace(/\/+$/, "") === reservationPath) {
      setHasLoadedReservationModal(true);
      setIsReservationOpen(true);

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

      const menuPath = `/${locale}/menu`;
      const loginPath = `/${locale}/login`;
      const registerPath = `/${locale}/register`;
      const accountPath = `/${locale}/account`;
      const reservationPath = `/${locale}/reservations`;
      const adminPath = `/${locale}/admin`;

      if (normalizedPath === menuPath) {
        event.preventDefault();

        openMenu();
        return;
      }

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

      if (
        normalizedPath === reservationPath ||
        normalizedPath.startsWith(`${reservationPath}/`)
      ) {
        event.preventDefault();

        if (isLoggedIn) {
          openReservation();
        } else {
          openLogin(`${url.pathname}${url.search}${url.hash}`);
        }

        return;
      }

      if (
        !isLoggedIn &&
        (normalizedPath === adminPath ||
          normalizedPath.startsWith(`${adminPath}/`))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        openLogin(`${url.pathname}${url.search}${url.hash}`);
      }
    };

    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [
    isLoggedIn,
    locale,
    openAccount,
    openLogin,
    openMenu,
    openRegister,
    openReservation,
  ]);

  const value = useMemo(
    () => ({
      openLogin,
      openRegister,
      openAccount,
      openMenu,
      openReservation,
      closeAuth,
      closeAccount,
      closeMenu,
      closeReservation,
    }),
    [
      openLogin,
      openRegister,
      openAccount,
      openMenu,
      openReservation,
      closeAuth,
      closeAccount,
      closeMenu,
      closeReservation,
    ],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      {hasLoadedAuthModal && (
        <AuthModal
          key={`${locale}-${authState.mode}`}
          locale={locale}
          isOpen={authState.isOpen}
          initialMode={authState.mode}
          onClose={closeAuth}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {hasLoadedAccountModal && (
        <AccountModal
          locale={locale}
          isOpen={isAccountOpen}
          onClose={closeAccount}
          onLoggedOut={handleLoggedOut}
        />
      )}

      {hasLoadedMenuModal && (
        <MenuModal locale={locale} isOpen={isMenuOpen} onClose={closeMenu} />
      )}

      {hasLoadedReservationModal && (
        <ReservationModal
          locale={locale}
          isOpen={isReservationOpen}
          onClose={closeReservation}
        />
      )}
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
