// app/confirmation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  Share2,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

interface ConfirmationDetails {
  eventTitle: string;
  date: string;
  time: string;
  venueName: string;
  price: number;
  billingInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  confirmationId: string;
  paymentStatus: string;
  bookedAt: string;
}

export default function ConfirmationPage() {
  const [confirmationDetails, setConfirmationDetails] =
    useState<ConfirmationDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedConfirmation = sessionStorage.getItem("bookingConfirmation");
    if (storedConfirmation) {
      setConfirmationDetails(JSON.parse(storedConfirmation));
    } else {
      router.push("/events");
    }
  }, [router]);

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert(
      "Ticket download functionality would be implemented here with PDF generation"
    );
  };

  const handleShare = async () => {
    if (confirmationDetails && navigator.share) {
      try {
        await navigator.share({
          title: `I'm attending ${confirmationDetails.eventTitle}!`,
          text: `Just booked my ticket for ${confirmationDetails.eventTitle}. See you there!`,
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    }
  };

  if (!confirmationDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we load your confirmation.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = confirmationDetails.price === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your {isFree ? "registration" : "payment"} was successful. We've
              sent you a confirmation email.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-center">
                Booking Confirmation #{confirmationDetails.confirmationId}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Details */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  {confirmationDetails.eventTitle}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDate(confirmationDetails.date)} at{" "}
                      {formatTime(confirmationDetails.time)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{confirmationDetails.venueName}</span>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Billing Information
                </h4>
                <div className="space-y-1 text-gray-600">
                  <p>
                    <strong>Name:</strong>{" "}
                    {confirmationDetails.billingInfo.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {confirmationDetails.billingInfo.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {confirmationDetails.billingInfo.phone}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Amount Paid</span>
                  <span className="font-semibold">
                    {isFree ? "FREE" : formatPrice(confirmationDetails.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Method</span>
                  <span className="font-semibold capitalize">
                    {isFree
                      ? "Free Registration"
                      : confirmationDetails.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <span className="font-semibold text-green-600 capitalize">
                    {confirmationDetails.paymentStatus}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Button
                onClick={handleDownloadTicket}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>

            <Link href="/events">
              <Button className="w-full" size="lg">
                <ArrowRight className="h-4 w-4 mr-2" />
                Discover More Events
              </Button>
            </Link>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-6">
            <h4 className="font-medium text-blue-900 mb-2">
              Important Information
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Please bring a valid ID and this confirmation to the event
              </li>
              <li>• Check your email for detailed event instructions</li>
              <li>• Contact the organizer if you have any questions</li>
              <li>• Refund policy applies as per event terms</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
