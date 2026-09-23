import { notFound } from "next/navigation";

import ResetPasswordClient from "./ResetPasswordClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <ResetPasswordClient />;
}
