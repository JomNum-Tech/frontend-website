"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomSignUp() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [signUpId, setSignUpId] = useState<string | null>(null);

  useEffect(() => {
    // Clear any previous errors when verification state changes
    if (verifying) {
      setError(null);
    }
  }, [verifying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      setError("Registration system not ready");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });
      setSignUpId(signUp.id ?? null); // <-- Save the signUp id
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Registration failed. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) {
      setError("Verification system not ready");
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      // Update metadata BEFORE attempting verification
      await signUp.update({
        unsafeMetadata: { signup_method: "email" },
      });
      
      // Now attempt email verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
  
      if (completeSignUp.status === "complete") {
        // Set the session as active
        await setActive({ session: completeSignUp.createdSessionId });
  
        // Clear any errors and redirect immediately
        setError(null);
        setLoading(false);
        router.push("/");
        return; // Stop further execution
      } else {
        // Handle different incomplete statuses
        switch (completeSignUp.status) {
          case "missing_requirements":
            setError("Additional verification required. Please check your email or complete any pending steps.");
            break;
          case "abandoned":
            setError("Sign up session expired. Please start over.");
            setVerifying(false);
            break;
          default:
            setError("Verification incomplete. Please try again or contact support.");
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.errors?.[0]?.message || "Verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;
    
    try {
      setError(null);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // You might want to show a success message here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/90 shadow-xl rounded-2xl p-8 border border-blue-100 relative">
        {/* Verification Modal Overlay */}
        {verifying && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-2xl flex flex-col justify-center p-8 z-10">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
              <p className="text-gray-500 text-sm">Enter the verification code sent to {email}</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 transition"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="one-time-code"
                  maxLength={6}
                />
              </div>

              {/* Clerk captcha container */}
              <div id="clerk-captcha"></div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 rounded-lg font-bold text-lg shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!isLoaded || loading || !code.trim()}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 font-semibold hover:underline"
                  disabled={loading}
                >
                  Resend code
                </button>
              </div>
            </form>

            <button
              onClick={() => {
                setVerifying(false);
                setCode("");
                setError(null);
              }}
              className="mt-6 text-sm text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to sign up
            </button>
          </div>
        )}

        {/* Main Sign Up Form */}
        <div className={verifying ? "opacity-30 pointer-events-none" : ""}>
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-100 rounded-full p-3 mb-2">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-blue-700 mb-1">JomNum-Tech</h2>
            <p className="text-gray-500 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 transition"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 transition"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 pr-12 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                disabled={loading}
                tabIndex={-1}
                style={{ accentColor: "#2563eb" }}
                required
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-500 select-none">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 rounded-lg font-bold text-lg shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isLoaded || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            
            {/* Clerk captcha container for main form */}
            <div id="clerk-captcha"></div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}