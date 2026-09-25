import { notFound } from "next/navigation";

import MenuClient from "./MenuClient";

type Locale = "bg" | "en";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <MenuClient locale={locale as Locale} />;
}
