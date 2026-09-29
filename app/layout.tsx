import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./global.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const siteUrl = "https://restaurant-website-mu-mauve.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "RESTAURANT",
    template: "%s | RESTAURANT",
  },

  description:
    "Modern restaurant experience with interactive menu, events and online reservations.",

  applicationName: "RESTAURANT",

  authors: [
    {
      name: "RESTAURANT",
    },
  ],

  creator: "RESTAURANT",

  publisher: "RESTAURANT",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    siteName: "RESTAURANT",
    title: "RESTAURANT",
    description:
      "Modern restaurant experience with interactive menu, events and online reservations.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RESTAURANT",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "RESTAURANT",
    description:
      "Modern restaurant experience with interactive menu, events and online reservations.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" data-scroll-behavior="smooth">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
