import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - EventSphere India",
  description:
    "Sign in or create an account to book amazing events across India.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
