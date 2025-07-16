"use client";

import { SignIn } from "@clerk/nextjs";
import React, { useEffect, useRef } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-2xl p-0 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalIn"
        onClick={e => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.4,0,0.2,1) forwards"
        }}
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <SignIn
          afterSignInUrl="/"
          redirectUrl="/"
          routing="hash"
        />
      </div>
      <style jsx global>{`
        @keyframes modalIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}