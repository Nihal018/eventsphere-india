// lib/constants.ts - Type constants for SQLite enum compatibility

export const USER_ROLES = {
  USER: "USER",
  ORGANIZER: "ORGANIZER",
  ADMIN: "ADMIN",
} as const;

export const EVENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  ATTENDED: "ATTENDED",
} as const;

// Type definitions for TypeScript
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];
export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// Helper functions for validation
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};

export const isValidEventStatus = (status: string): status is EventStatus => {
  return Object.values(EVENT_STATUS).includes(status as EventStatus);
};

export const isValidBookingStatus = (
  status: string
): status is BookingStatus => {
  return Object.values(BOOKING_STATUS).includes(status as BookingStatus);
};

// Arrays for dropdowns/selects
export const USER_ROLE_OPTIONS = Object.values(USER_ROLES);
export const EVENT_STATUS_OPTIONS = Object.values(EVENT_STATUS);
export const BOOKING_STATUS_OPTIONS = Object.values(BOOKING_STATUS);
