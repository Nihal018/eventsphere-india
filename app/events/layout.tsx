import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "../../components/layout/Header";

export const metadata: Metadata = {
  title: "Events - EventSphere India",
  description:
    "Discover amazing events across India. Find concerts, workshops, festivals and more.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
