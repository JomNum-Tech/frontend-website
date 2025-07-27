"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { SignInModal } from "../auth/SignInModal";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { LogOut, User, Shield } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { TutorialHelpMenu } from "@/components/tutorial/TutorialHelpMenu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const { isAdmin } = useAdminRole();

  return (
    <>
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-12 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-3 group"
                data-tutorial="logo"
              >
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
                href="/courses"
                data-tutorial="courses"
                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Courses
              </Link>

              <Link
                href="/contact"
                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Contact
              </Link>
              <Link
                href="/classes"
                data-tutorial="classes"
                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Classes
              </Link>
              <Link
                href="/about"
                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                About
              </Link>

              <Link
                href="/community"
                data-tutorial="community"
                className="text-base font-semibold px-4 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                Community
              </Link>

              {/* Tutorial Help Menu */}
              <TutorialHelpMenu variant="dropdown" trigger="button" />

              <div className="ml-6 relative inline-block">
                <div className="group relative inline-block">
                  {isLoaded && isSignedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          <Avatar>
                            <AvatarImage
                              src={user?.imageUrl}
                              alt={
                                user?.fullName ||
                                user?.emailAddresses?.[0]?.emailAddress ||
                                "User"
                              }
                            />
                            <AvatarFallback>
                              {user?.firstName?.[0] ||
                                user?.emailAddresses?.[0]?.emailAddress?.[0] ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 mt-4 rounded-xl mr-8 shadow-xl border border-blue-100 bg-white/95 p-0">
                        <DropdownMenuLabel className="flex flex-col items-start gap-2 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={user?.imageUrl}
                                alt={
                                  user?.fullName ||
                                  user?.emailAddresses?.[0]?.emailAddress ||
                                  "User"
                                }
                              />
                              <AvatarFallback>
                                {user?.firstName?.[0] ||
                                  user?.emailAddresses?.[0]
                                    ?.emailAddress?.[0] ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-semibold text-base text-blue-900">
                                {user?.fullName ||
                                  user?.emailAddresses?.[0]?.emailAddress ||
                                  "User"}
                              </span>
                              <div className="text-xs text-gray-500">
                                {user?.emailAddresses?.[0]?.emailAddress}
                              </div>
                            </div>
                          </div>
                        </DropdownMenuLabel>

                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              asChild
                              className="px-4 py-2 hover:bg-purple-50 focus:bg-purple-100 transition-colors rounded-none font-medium text-purple-800"
                            >
                              <Link
                                href="/admin/users"
                                className="flex items-center gap-2 w-full"
                              >
                                <Shield className="w-8 h-8 text-purple-500 mr-2" />
                                Admin
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                        >
                          <Link
                            href="/profile?tab=profile"
                            className="flex items-center gap-2 w-full"
                          >
                            <User className="w-4 h-4 text-blue-500" />
                            Profile
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                        >
                          <Link
                            href="/profile?tab=security"
                            className="flex items-center gap-2 w-full"
                          >
                            <Shield className="w-4 h-4 text-blue-500" />
                            Security
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                        >
                          <Link
                            href="/profile?tab=storage"
                            className="flex items-center gap-2 w-full"
                          >
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                              />
                            </svg>
                            JomNum Drive
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">
                              New
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => signOut()}
                          className="px-4 py-2 hover:bg-red-50 focus:bg-red-100 transition-colors rounded-b-xl font-medium text-red-600 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login" data-tutorial="signin">
                      <Button
                        variant="default"
                        size="sm"
                        className="ml-2 px-6 py-2 rounded-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                        aria-describedby="signin-tooltip"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
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
                  href="/courses"
                  className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/classses"
                  className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Class
                </Link>
                <Link
                  href="/contact"
                  className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/about"
                  className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>

                <Link
                  href="/community"
                  className="text-base font-semibold px-3 py-2 rounded-lg hover:bg-blue-100/60 hover:text-blue-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </Link>

                <div className="ml-6 relative w-full">
                  <div className="relative group w-full">
                    {isLoaded && isSignedIn ? (
                      <div className="flex justify-center w-full mt-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none">
                              <Avatar>
                                <AvatarImage
                                  src={user?.imageUrl}
                                  alt={
                                    user?.fullName ||
                                    user?.emailAddresses?.[0]?.emailAddress ||
                                    "User"
                                  }
                                />
                                <AvatarFallback>
                                  {user?.firstName?.[0] ||
                                    user?.emailAddresses?.[0]
                                      ?.emailAddress?.[0] ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-64 mt-2 rounded-xl shadow-xl border border-blue-100 bg-white/95 p-0">
                            <DropdownMenuLabel className="flex flex-col items-start gap-2 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={user?.imageUrl}
                                    alt={
                                      user?.fullName ||
                                      user?.emailAddresses?.[0]?.emailAddress ||
                                      "User"
                                    }
                                  />
                                  <AvatarFallback>
                                    {user?.firstName?.[0] ||
                                      user?.emailAddresses?.[0]
                                        ?.emailAddress?.[0] ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-semibold text-base text-blue-900">
                                    {user?.fullName ||
                                      user?.emailAddresses?.[0]?.emailAddress ||
                                      "User"}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {user?.emailAddresses?.[0]?.emailAddress}
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              asChild
                              className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                            >
                              <Link
                                href="/profile?tab=profile"
                                className="flex items-center gap-2 w-full"
                              >
                                <User className="w-4 h-4 text-blue-500" />
                                Profile
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              asChild
                              className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                            >
                              <Link
                                href="/profile?tab=security"
                                className="flex items-center gap-2 w-full"
                              >
                                <Shield className="w-4 h-4 text-blue-500" />
                                Security
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              asChild
                              className="px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-none font-medium text-gray-800"
                            >
                              <Link
                                href="/profile?tab=storage"
                                className="flex items-center gap-2 w-full"
                              >
                                <svg
                                  className="w-4 h-4 text-blue-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                  />
                                </svg>
                                JomNum Drive
                                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-300 text-yellow-900 border border-yellow-400 uppercase shadow-sm">
                                  New
                                </span>
                              </Link>
                            </DropdownMenuItem>

                            {isAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  asChild
                                  className="px-4 py-2 hover:bg-purple-50 focus:bg-purple-100 transition-colors rounded-none font-medium text-purple-800"
                                >
                                  <Link
                                    href="/admin"
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <Shield className="w-8 h-8 text-purple-500 mr-2" />
                                    Admin Dashboard
                                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded bg-purple-300 text-purple-900 border border-purple-400 uppercase shadow-sm">
                                      Admin
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                              </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => signOut()}
                              className="px-4 py-2 hover:bg-red-50 focus:bg-red-100 transition-colors rounded-b-xl font-medium text-red-600 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-red-500 text-lg">
                                <LogOut className="w-8 h-8 text-red-500 mr-2" />
                              </span>
                              Logout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <Link href="/login" passHref>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full mt-2 px-6 py-2 rounded-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                          aria-describedby="signin-tooltip"
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
