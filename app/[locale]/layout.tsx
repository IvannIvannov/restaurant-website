import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import AuthModalProvider from "./AuthModalProvider";

type LocaleLayoutProps = {
  children: ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return [
    {
      locale: "bg",
    },
    {
      locale: "en",
    },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthModalProvider locale={locale} isLoggedIn={Boolean(user)}>
      {children}
    </AuthModalProvider>
  );
}
