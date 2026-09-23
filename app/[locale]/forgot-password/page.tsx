import { notFound } from "next/navigation";

import ForgotPasswordClient from "./ForgotPasswordClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <ForgotPasswordClient />;
}
