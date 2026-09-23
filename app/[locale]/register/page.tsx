import { notFound } from "next/navigation";
import RegisterClient from "./RegisterClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function RegisterPage({
  params,
}: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <RegisterClient />;
}