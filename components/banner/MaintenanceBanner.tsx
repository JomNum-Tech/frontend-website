"use client";

import { AlertTriangle, CheckCircle, Info, X, Wrench } from "lucide-react";
import { useState } from "react";

export function MaintenanceBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const status = "maintenance"; // Can be 'maintenance', 'outage', 'update', or 'operational'
  const message = "This website is still in development. More features and improvements are coming soon!";

  if (!isVisible) return null;

  const statusConfig = {
    maintenance: {
      icon: <Wrench className="w-4 h-4" />,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-900",
      borderColor: "border-yellow-600",
    },
    outage: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bgColor: "bg-red-500",
      textColor: "text-red-900",
      borderColor: "border-red-600",
    },
    update: {
      icon: <Info className="w-4 h-4" />,
      bgColor: "bg-blue-500",
      textColor: "text-blue-900",
      borderColor: "border-blue-600",
    },
    operational: {
      icon: <CheckCircle className="w-4 h-4" />,
      bgColor: "bg-green-500",
      textColor: "text-green-900",
      borderColor: "border-green-600",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.maintenance;

  return (
    <div className={`w-full ${currentStatus.bgColor} ${currentStatus.textColor} border-b ${currentStatus.borderColor} py-2`}>
      <div className="container mx-auto px-12 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="flex-shrink-0">
            {currentStatus.icon}
          </span>
          <span className="font-medium text-sm sm:text-base">
            {message}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}