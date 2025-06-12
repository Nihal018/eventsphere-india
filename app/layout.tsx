import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventSphere India - Discover Amazing Events",
  description:
    "Find and book amazing events across India. Concerts, festivals, workshops, and more.",
  keywords: [
    "events",
    "india",
    "concerts",
    "festivals",
    "workshops",
    "booking",
  ],
  authors: [{ name: "EventSphere India" }],
  creator: "EventSphere India",
  publisher: "EventSphere India",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "EventSphere India - Discover Amazing Events",
    description:
      "Find and book amazing events across India. Concerts, festivals, workshops, and more.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "EventSphere India",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EventSphere India - Discover Amazing Events",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventSphere India - Discover Amazing Events",
    description:
      "Find and book amazing events across India. Concerts, festivals, workshops, and more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
