"use client";

import type { ReactNode } from "react";

import { useAuthModal } from "./AuthModalProvider";

type AuthMode = "login" | "register";

type AuthTriggerProps = {
  mode: AuthMode;
  children: ReactNode;
  className?: string;
};

export default function AuthTrigger({
  mode,
  children,
  className,
}: AuthTriggerProps) {
  const { openLogin, openRegister } = useAuthModal();

  const handleClick = () => {
    if (mode === "login") {
      openLogin();

      return;
    }

    openRegister();
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
