import type { ReactNode } from "react";

import { notFound } from "next/navigation";

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

  return <AuthModalProvider locale={locale}>{children}</AuthModalProvider>;
}
