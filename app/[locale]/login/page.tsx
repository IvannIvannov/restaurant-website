import { notFound } from "next/navigation";
import LoginClient from "./LoginClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <LoginClient />;
}
