import { notFound } from "next/navigation";

import ResetPasswordClient from "./ResetPasswordClient";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <ResetPasswordClient locale={locale} />;
}
