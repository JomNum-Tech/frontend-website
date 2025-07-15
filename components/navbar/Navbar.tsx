"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 md:px-12 py-3">
                    <nav className="flex items-center justify-between">
                        {/* Logo & Brand */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-white/80 border border-gray-200 transition-all duration-200 group-hover:scale-105">
                                    <Image
                                        src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                                        height={48}
                                        width={48}
                                        alt="Logo"
                                        className="rounded-xl"
                                    />
                                </div>
                                <span className="text-xl md:text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm group-hover:text-blue-900 transition-colors duration-200">
                                    JomNum-Tech
                                </span>
                            </Link>
                        </div>
                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link
                                href="/about"
                                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                            >
                                About
                            </Link>
                            <span className="relative inline-flex items-center">
                                <span
                                    className="text-base font-semibold px-4 py-2 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed select-none flex items-center"
                                    tabIndex={-1}
                                    aria-disabled="true"
                                >
                                    Courses
                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-200 text-yellow-800 border border-yellow-300 uppercase">
                                        ⚒️
                                    </span>
                                </span>
                            </span>
                            <span className="relative inline-flex items-center">
                                <span
                                    className="text-base font-semibold px-4 py-2 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed select-none flex items-center"
                                    tabIndex={-1}
                                    aria-disabled="true"
                                >
                                    Contact
                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-200 text-yellow-800 border border-yellow-300 uppercase">
                                        ⚒️
                                    </span>
                                </span>
                            </span>
                            <div className="relative inline-block">
                                <div className="group relative inline-block">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="ml-2 px-6 py-2 rounded-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                                        disabled
                                        aria-describedby="signin-tooltip"
                                    >
                                        Sign In
                                    </Button>
                                    <div
                                        id="signin-tooltip"
                                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
                                        role="tooltip"
                                    >
                                        Sign in is coming soon!
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Mobile Nav */}
                        <div className="md:hidden flex items-center">
                            <button
                                aria-label="Open menu"
                                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg
                                    className="w-7 h-7 text-blue-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </nav>
                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 bg-white rounded-xl shadow-lg border border-blue-100 py-4 px-6 absolute left-0 right-0 top-[70px] z-40 mx-4">
                            <nav className="flex flex-col space-y-2">

                                <Link
                                    href="/about"
                                    className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <span className="relative inline-flex items-center">
                                    <span
                                        className="text-base font-semibold px-3 py-2 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed select-none flex items-center"
                                        tabIndex={-1}
                                        aria-disabled="true"
                                    >
                                        Courses
                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-200 text-yellow-800 border border-yellow-300 uppercase">
                                            ⚒️
                                        </span>
                                    </span>
                                </span>
                                <span className="relative inline-flex items-center">
                                    <span
                                        className="text-base font-semibold px-3 py-2 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed select-none flex items-center"
                                        tabIndex={-1}
                                        aria-disabled="true"
                                    >
                                        Contact
                                        <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-200 text-yellow-800 border border-yellow-300 uppercase">
                                            ⚒️
                                        </span>
                                    </span>
                                </span>
                                <div className="relative w-full">
                                    <div className="relative group w-full">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="w-full mt-2 px-6 py-2 rounded-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                                            onClick={() => setMobileMenuOpen(false)}
                                            disabled
                                            aria-describedby="signin-tooltip"
                                        >
                                            Sign In
                                        </Button>
                                        <span className="absolute top-1 right-3 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded border border-yellow-300 uppercase shadow-sm">
                                            ⚒️
                                        </span>
                                    
                                        <div
                                            id="signin-tooltip"
                                            className="absolute left-1/2 -translate-x-1/2 -top-10 z-50 w-max px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"
                                        >
                                            Sign in coming soon!
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}