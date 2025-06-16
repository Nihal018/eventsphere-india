"use client";
import React, { use, useState } from "react";
import {
  Calendar,
  MapPin,
  Upload,
  Save,
  Eye,
  Clock,
  Users,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";
import Header from "../../../../components/layout/Header";

interface EventFormData {
  title: string;
  description: string;
  shortDesc: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  category: string;
  latitude: string;
  longitude: string;
  price: string;
  isFree: boolean;
  maxAttendees: string;
  status: "DRAFT" | "PUBLISHED";
}

const CreateEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    shortDesc: "",
    date: "",
    time: "",
    venueName: "",
    venueAddress: "",
    city: "",
    state: "",
    category: "",
    latitude: "",
    longitude: "",
    price: "",
    isFree: true,
    maxAttendees: "",
    status: "DRAFT",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Common Indian states
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Puducherry",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  // Popular event categories
  const eventCategories = [
    "Music & Concert",
    "Technology & Innovation",
    "Business & Professional",
    "Health & Wellness",
    "Food & Drink",
    "Sports & Fitness",
    "Arts & Culture",
    "Education & Learning",
    "Community & Social",
    "Entertainment",
    "Fashion & Beauty",
    "Travel & Outdoor",
    "Family & Kids",
    "Charity & Causes",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    saveAs: "DRAFT" | "PUBLISHED"
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please log in to create events");
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      Object.entries({ ...formData, status: saveAs }).forEach(
        ([key, value]) => {
          submitData.append(key, value.toString());
        }
      );

      // Add image file if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        alert(`Event ${saveAs.toLowerCase()} successfully!`);
        // Redirect to organizer dashboard
        window.location.href = "/organizer/dashboard";
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (error) {
      setError("An error occurred while creating the event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <div className="bg-white shadow mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Event
            </h1>
            <p className="mt-2 text-gray-600">
              Fill in the details to create your event
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your event title"
                />
              </div>

              <div>
                <label
                  htmlFor="shortDesc"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Short Description
                </label>
                <input
                  type="text"
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description for event cards (optional)"
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide a detailed description of your event"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {eventCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Date & Time
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Event Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="venueName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  required
                  value={formData.venueName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label
                  htmlFor="venueAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Venue Address *
                </label>
                <textarea
                  id="venueAddress"
                  name="venueAddress"
                  required
                  rows={3}
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete venue address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select state</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 28.6139"
                  />
                </div>

                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 77.2090"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Capacity
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isFree"
                  className="ml-2 block text-sm text-gray-900"
                >
                  This is a free event
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter ticket price"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="maxAttendees"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Maximum Attendees
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Event Image */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Event Image
              </h2>
            </div>
            <div className="p-6">
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => document.getElementById("image")?.click()}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <span className="font-medium ">
                      {imagePreview ? "Change image" : "Upload an image"}
                    </span>
                    <p className="pl-1 font-medium">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "DRAFT")}
                  disabled={loading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save as Draft"}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "PUBLISHED")}
                  disabled={loading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {loading ? "Publishing..." : "Publish Event"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = "/organizer/dashboard")
                  }
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel and go back to dashboard
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
