import type { Metadata } from "next";
import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import AuthModalProvider from "./AuthModalProvider";

type Locale = "bg" | "en";

type LocaleLayoutProps = {
  children: ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

const metadataByLocale: Record<
  Locale,
  {
    title: string;
    description: string;
    locale: string;
    alternateLocale: string;
  }
> = {
  bg: {
    title: "Ресторант, меню и резервации",
    description:
      "Разгледайте интерактивното меню, предстоящите събития и направете онлайн резервация.",
    locale: "bg_BG",
    alternateLocale: "en_US",
  },

  en: {
    title: "Restaurant, menu and reservations",
    description:
      "Explore our interactive menu, upcoming events and make your reservation online.",
    locale: "en_US",
    alternateLocale: "bg_BG",
  },
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

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    return {};
  }

  const currentLocale = locale as Locale;
  const metadata = metadataByLocale[currentLocale];

  return {
    title: metadata.title,

    description: metadata.description,

    openGraph: {
      type: "website",

      siteName: "RESTAURANT",

      title: `${metadata.title} | RESTAURANT`,

      description: metadata.description,

      locale: metadata.locale,

      alternateLocale: metadata.alternateLocale,

      images: [
        {
          url: "/opengraph-image",

          width: 1200,

          height: 630,

          alt: "RESTAURANT",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: `${metadata.title} | RESTAURANT`,

      description: metadata.description,

      images: ["/opengraph-image"],
    },
  };
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
