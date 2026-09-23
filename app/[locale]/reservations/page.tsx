import { notFound } from "next/navigation";
import ReservationClient from "./ReservationClient";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ReservationsPage({
  params,
}: PageProps) {
  const { locale } = await params;

  if (locale !== "bg" && locale !== "en") {
    notFound();
  }

  return <ReservationClient />;
}