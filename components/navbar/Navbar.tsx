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
import { LogOut, User, Shield, FolderOpen, PenLine } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const { isAdmin } = useAdminRole();

  const navLinks = [
    { href: "/courses", label: "Courses", tutorial: "courses" },
    { href: "/contact", label: "Contact" },
    // { href: "/classes", label: "Classes", tutorial: "classes" },
    { href: "/about", label: "About" },
    // { href: "/community", label: "Community", tutorial: "community" },
    // { href: "/blog", label: "Blog", tutorial: "blog" },
  ];

  const userInitial =
    user?.firstName?.[0] ||
    user?.emailAddresses?.[0]?.emailAddress?.[0] ||
    "U";
  const userName =
    user?.fullName || user?.emailAddresses?.[0]?.emailAddress || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <>
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-8 py-2">
          <nav className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              data-tutorial="logo"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center border border-gray-200 transition-transform duration-20">
                <Image
                  src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                  height={32}
                  width={32}
                  alt="JomNum-Tech Logo"
                  className="rounded-md"
                />
              </div>
              <span className="text-md md:text-md text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                JomNum-Tech
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-tutorial={link.tutorial}
                  className="text-xs font-medium text-gray-600 px-2.5 py-1 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {link.label}
                </Link>
              ))}

              <div className="ml-3">
                {isLoaded && isSignedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full">
                        <Avatar className="w-7 h-7 ring-2 ring-gray-100 hover:ring-blue-200 transition-all duration-150">
                          <AvatarImage src={user?.imageUrl} alt={userName} />
                          <AvatarFallback className="bg-blue-50 text-blue-700 text-sm font-semibold">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52 mt-2 rounded-lg mr-8 shadow-lg border border-gray-200 bg-white p-0">
                      {/* User info header */}
                      <DropdownMenuLabel className="px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={user?.imageUrl} alt={userName} />
                            <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-semibold">
                              {userInitial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {userName}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>

                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator className="my-0" />
                          <DropdownMenuItem asChild className="px-3 py-2 hover:bg-purple-50 focus:bg-purple-50 text-xs font-medium text-purple-700">
                            <Link href="/admin/users" className="flex items-center gap-2 w-full">
                              <Shield className="w-3.5 h-3.5 text-purple-500" />
                              Admin
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator className="my-0" />
                      <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 text-xs font-medium text-gray-700">
                        <Link href="/profile?tab=profile" className="flex items-center gap-2 w-full">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 text-xs font-medium text-gray-700">
                        <Link href="/profile?tab=security" className="flex items-center gap-2 w-full">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          Security
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 text-xs font-medium text-gray-700">
                        <Link href="/profile?tab=storage" className="flex items-center gap-2 w-full">
                          <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
                          JomNum Drive
                          <span className="ml-auto px-1 py-0.5 text-[9px] font-semibold rounded bg-emerald-100 text-emerald-700 uppercase">
                            New
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 text-xs font-medium text-gray-700">
                        <Link href="/blog/my-posts" className="flex items-center gap-2 w-full">
                          <PenLine className="w-3.5 h-3.5 text-gray-400" />
                          My Blog Posts
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-0" />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="px-3 py-2 hover:bg-red-50 focus:bg-red-50 rounded-b-lg text-xs font-medium text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" data-tutorial="signin">
                    <Button
                      size="sm"
                      className="px-3 py-1 rounded-md text-[11px] hover:cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-150 h-7"
                    >
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 absolute left-4 right-4 top-[52px] z-40">
              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs font-medium text-gray-600 px-2.5 py-2 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-gray-100 mt-2 pt-2">
                  {isLoaded && isSignedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-gray-50 transition-colors">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user?.imageUrl} alt={userName} />
                            <AvatarFallback className="bg-blue-50 text-blue-700 text-[10px] font-semibold">
                              {userInitial}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-gray-700 truncate">{userName}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 rounded-lg shadow-lg border border-gray-200 bg-white p-0">
                        <DropdownMenuLabel className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
                          <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-0" />
                        <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700">
                          <Link href="/profile?tab=profile" className="flex items-center gap-2 w-full">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700">
                          <Link href="/profile?tab=security" className="flex items-center gap-2 w-full">
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            Security
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700">
                          <Link href="/profile?tab=storage" className="flex items-center gap-2 w-full">
                            <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
                            JomNum Drive
                            <span className="ml-auto px-1 py-0.5 text-[9px] font-semibold rounded bg-emerald-100 text-emerald-700 uppercase">
                              New
                            </span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700">
                          <Link href="/blog/my-posts" className="flex items-center gap-2 w-full">
                            <PenLine className="w-3.5 h-3.5 text-gray-400" />
                            My Blog Posts
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator className="my-0" />
                            <DropdownMenuItem asChild className="px-3 py-2 hover:bg-purple-50 text-xs font-medium text-purple-700">
                              <Link href="/admin/users" className="flex items-center gap-2 w-full">
                                <Shield className="w-3.5 h-3.5 text-purple-500" />
                                Admin Dashboard
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator className="my-0" />
                        <DropdownMenuItem
                          onClick={() => signOut()}
                          className="px-3 py-2 hover:bg-red-50 rounded-b-lg text-xs font-medium text-red-600 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login" passHref>
                      <Button
                        size="sm"
                        className="w-full mt-1 px-4 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-150"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
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
