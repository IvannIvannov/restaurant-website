import { notFound } from "next/navigation";
import AdminClient from "./AdminClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AdminPage({
  params,
}: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <AdminClient />;
}