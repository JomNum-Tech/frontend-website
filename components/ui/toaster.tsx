"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Determine toast color based on variant (success, destructive, etc.)
        let borderColor = "border-blue-500"
        let bgColor = "bg-white"
        let titleColor = "text-blue-900"
        let descColor = "text-gray-700"
        let icon = null

        if (variant === "destructive") {
          borderColor = "border-red-500"
          bgColor = "bg-red-50"
          titleColor = "text-red-800"
          descColor = "text-red-700"
          icon = (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 mr-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )
        } else if (variant === "success") {
          borderColor = "border-green-500"
          bgColor = "bg-green-50"
          titleColor = "text-green-800"
          descColor = "text-green-700"
          icon = (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 mr-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )
          icon = (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 mr-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
              </svg>
            </span>
          )
        } else {
          // default/info
          borderColor = "border-blue-500"
          bgColor = "bg-white"
          titleColor = "text-blue-900"
          descColor = "text-gray-700"
          icon = (
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 mr-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
              </svg>
            </span>
          )
        }

        return (
          <Toast
            key={id}
            {...props}
            className={`
              ${bgColor} ${borderColor} border-l-4 shadow-lg rounded-xl px-5 py-4 mb-4 flex items-start gap-3 max-w-sm
              animate-fade-in
            `}
          >
            {icon}
            <div className="flex-1 grid gap-1">
              {title && <ToastTitle className={`font-semibold text-base ${titleColor}`}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={`text-sm ${descColor}`}>{description}</ToastDescription>
              )}
              {action && <div className="mt-2">{action}</div>}
            </div>
            <ToastClose className="ml-3 mt-1 rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-[360px] max-w-full" />
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </ToastProvider>
  )
}