"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Calendar,
  MapPin,
  IndianRupee,
  CreditCard,
  Shield,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { BookingDetails } from "@/types";
import {
  formatDate,
  formatTime,
  formatPrice,
  isAuthenticated,
} from "@/lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function CheckoutPage() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Get booking details from session storage
    const storedBookingDetails = sessionStorage.getItem("bookingDetails");
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    } else {
      router.push("/events");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = async () => {
    if (!bookingDetails) return;

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store booking confirmation
      const confirmationDetails = {
        ...bookingDetails,
        billingInfo,
        paymentMethod,
        confirmationId: `ES${Date.now()}`,
        paymentStatus: "completed",
        bookedAt: new Date().toISOString(),
      };

      sessionStorage.setItem(
        "bookingConfirmation",
        JSON.stringify(confirmationDetails)
      );
      sessionStorage.removeItem("bookingDetails");

      router.push("/confirmation");
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we prepare your checkout.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = bookingDetails.price === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-gray-600">
              Review your order and {isFree ? "confirm" : "complete payment"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {bookingDetails.eventTitle}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(bookingDetails.date)} at{" "}
                        {formatTime(bookingDetails.time)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{bookingDetails.venueName}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Ticket Price</span>
                    <span className="font-semibold">
                      {isFree ? "FREE" : formatPrice(bookingDetails.price)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">
                      {isFree ? "FREE" : formatPrice(bookingDetails.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={billingInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91-XXXXXXXXXX"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full"
                  size="lg"
                  disabled={
                    loading ||
                    !billingInfo.fullName ||
                    !billingInfo.email ||
                    !billingInfo.phone
                  }
                >
                  {loading
                    ? "Processing..."
                    : isFree
                    ? "Confirm Booking"
                    : `Pay ${formatPrice(bookingDetails.price)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
