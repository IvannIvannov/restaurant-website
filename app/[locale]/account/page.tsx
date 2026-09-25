import { notFound } from "next/navigation";

import AccountClient from "./AccountClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <AccountClient />;
}
