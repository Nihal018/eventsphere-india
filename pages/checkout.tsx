// pages/checkout.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

export function CheckoutPage() {
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
      router.push("/login");
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

    // Simulate payment processing
    try {
      // In a real app, this would integrate with a payment gateway like Razorpay, Stripe, etc.
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we prepare your checkout.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const isFree = bookingDetails.price === 0;

  return (
    <Layout title="Checkout - EventSphere India">
      <div className="min-h-screen bg-gray-50 py-8">
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
            <div>
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
                    <div className="flex justify-between items-center">
                      <span>Convenience Fee</span>
                      <span className="font-semibold">
                        {isFree ? "FREE" : formatPrice(0)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">
                        {isFree ? "FREE" : formatPrice(bookingDetails.price)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Details */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {isFree ? (
                      <>
                        <User className="h-5 w-5 mr-2" />
                        Contact Information
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Details
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Billing Information
                    </h4>

                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={billingInfo.fullName}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="Enter your email"
                          value={billingInfo.email}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91-XXXXXXXXXX"
                          value={billingInfo.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method (only for paid events) */}
                  {!isFree && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Payment Method
                      </h4>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>Credit/Debit Card</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === "upi"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-2" />
                            <span>UPI</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="netbanking"
                            checked={paymentMethod === "netbanking"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            <span>Net Banking</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800 font-medium">
                        Your information is secure and encrypted
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
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

                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
