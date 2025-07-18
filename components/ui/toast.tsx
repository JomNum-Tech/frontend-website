"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Improved: bottom right, less intrusive, better spacing, mobile responsive
      "fixed z-[100] flex flex-col gap-3 p-4 sm:bottom-6 sm:right-6 sm:top-auto sm:left-auto sm:w-auto w-full left-0 bottom-0 top-auto right-0 max-w-full sm:max-w-[400px] pointer-events-none",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  // Improved: softer shadow, more padding, subtle border, rounded, animation, color for success/error
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white/95 dark:bg-gray-900/95 p-5 pr-10 shadow-xl transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border border-gray-200 bg-white/95 text-gray-900 dark:bg-gray-900/95 dark:text-gray-100",
        destructive:
          "border border-red-200 bg-red-50 text-red-900 dark:bg-red-900/90 dark:text-red-100",
        success:
          "border border-green-200 bg-green-50 text-green-900 dark:bg-green-900/90 dark:text-green-100",
        info:
          "border border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-900/90 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // Improved: pill button, color, focus, hover, transition, spacing
      "inline-flex h-8 min-w-[80px] items-center justify-center rounded-full border border-blue-500 bg-blue-600 text-white px-4 text-sm font-semibold shadow-sm ring-offset-background transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-500 group-[.destructive]:bg-red-600 group-[.destructive]:hover:bg-red-700 group-[.destructive]:focus:ring-red-400",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // Improved: always visible, larger click area, subtle hover/focus, color for error
      "absolute right-3 top-3 rounded-full p-2 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-700 group-[.destructive]:focus:ring-red-400",
      className
    )}
    toast-close=""
    aria-label="Close"
    {...props}
  >
    <X className="h-5 w-5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      // Improved: larger, bolder, better spacing
      "text-base font-bold leading-tight mb-1",
      className
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      // Improved: more readable, subtle color, spacing
      "text-sm text-gray-700 dark:text-gray-300 opacity-95",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
