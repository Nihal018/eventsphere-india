"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4 animate-fadeIn`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`inline-flex ${getTextColor()} hover:opacity-75`}
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Hook for easier usage
export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: "success" | "error" | "info" }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};
