"use client";

import { useMemo } from "react";

const TIPS = [
    [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
    ],
    [
        "I told my computer I needed a break, and it said: 'Error 404: Motivation not found.'",
    ],
    [
        "Why did the developer go broke? Because he used up all his cache.",
    ],
    [
        "Debugging: Being the detective in a crime movie where you are also the murderer.",
    ],
];

function getRandomTipSet() {
    // Pick a random tip set for each loading render
    return TIPS[Math.floor(Math.random() * TIPS.length)];
}

export default function Loading() {
    // Memoize so the tip doesn't change on every re-render
    const tips = useMemo(getRandomTipSet, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="relative mb-8">
                {/* Main spinner with book-inspired design */}
                <div className="animate-pulse">
                    <svg className="h-24 w-24 text-blue-600" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 6.5C12 5.11929 13.1193 4 14.5 4H18V18.5C18 19.8807 16.8807 21 15.5 21H12V6.5Z"
                            fill="currentColor"
                            opacity="0.4"
                        />
                        <path
                            d="M12 6.5V21H8.5C7.11929 21 6 19.8807 6 18.5V4H9.5C10.8807 4 12 5.11929 12 6.5Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                {/* Animated circular progress bar around the book */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                        className="h-32 w-32"
                        viewBox="0 0 40 40"
                        style={{ transform: "rotate(-90deg)" }}
                    >
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="#BFDBFE"
                            strokeWidth="3"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 * 0.25}
                            style={{
                                transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
                                strokeLinecap: "round",
                                animation: "circle-spin 1.2s linear infinite",
                            }}
                        />
                    </svg>
                    <style jsx>{`
                        @keyframes circle-spin {
                            0% {
                                stroke-dashoffset: ${2 * Math.PI * 16 * 0.75};
                            }
                            100% {
                                stroke-dashoffset: ${2 * Math.PI * 16 * 0.25};
                            }
                        }
                    `}</style>
                </div>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-blue-800 animate-pulse">
                    Preparing your learning materials...
                </h2>
                <p className="text-blue-700 max-w-md">
                    We are gathering the best content for your learning journey.
                    This will just take a moment.
                </p>

                {/* Animated dots for better perceived wait time */}
                <div className="flex justify-center space-x-1 pt-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>

            {/* Subtle progress indicator */}
            <div className="mt-8 w-64 bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full animate-progress" style={{ width: '65%' }}></div>
            </div>

            {/* Helpful tip while waiting - now dynamic */}
            <div className="mt-6 px-5 py-3 bg-blue-50 bg-opacity-80 rounded-lg text-sm text-blue-800 border border-blue-200 shadow-sm flex flex-col items-start gap-1 max-w-lg">
                <div className="flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <span className="font-semibold">Did you know?</span>
                </div>
                <ul className="list-disc list-inside text-blue-700 pl-2 space-y-1">
                    {tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}