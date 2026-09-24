import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Locale = "bg" | "en";

type LayoutProps = {
  children: React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
};

const siteUrl = "https://restaurant-website-mu-mauve.vercel.app";

const metadataContent = {
  bg: {
    title: "RESTAURANT | Онлайн резервации и меню",

    description:
      "Модерен ресторантски уебсайт с онлайн резервации, дигитално меню, клиентски профили и управление на резервации.",

    locale: "bg_BG",
  },

  en: {
    title: "RESTAURANT | Reservations & Menu",

    description:
      "A modern restaurant website with online reservations, digital menu, customer accounts and reservation management.",

    locale: "en_US",
  },
};

export async function generateMetadata({
  params,
}: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    return {};
  }

  const currentLocale = locale as Locale;

  const content = metadataContent[currentLocale];

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: content.title,

      template: `%s | RESTAURANT`,
    },

    description: content.description,

    applicationName: "RESTAURANT",

    authors: [
      {
        name: "Restaurant Website",
      },
    ],

    alternates: {
      canonical: `/${currentLocale}`,

      languages: {
        "bg-BG": "/bg",
        "en-US": "/en",
      },
    },

    openGraph: {
      type: "website",

      siteName: "RESTAURANT",

      title: content.title,

      description: content.description,

      url: `/${currentLocale}`,

      locale: content.locale,

      alternateLocale: currentLocale === "bg" ? ["en_US"] : ["bg_BG"],
    },

    twitter: {
      card: "summary_large_image",

      title: content.title,

      description: content.description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return children;
}
