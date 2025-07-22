"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import VersaLogo from "../../components/VersaLogo";

function VerifyEmailContent() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Handle resending OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) {
        throw new Error("Failed to resend verification code");
      }
      
      // Success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }
      
      // Redirect on success
      router.push(callbackUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea]">
      {/* Background elements - same as in signin/signup pages */}
      <motion.div 
        className="fixed left-[5vw] sm:left-[12vw] top-[10vh] sm:top-[15vh] w-[35vw] sm:w-[30vw] h-[35vw] sm:h-[30vw] rounded-full bg-gradient-to-br from-[#b8a1ff]/70 via-[#b8a1ff]/20 to-transparent opacity-50 blur-xl pointer-events-none z-[-1]"
        animate={{
          y: [0, -60, -30, -80, -40, -60, 0],
          x: [0, 40, 80, 60, 20, -40, 0],
          scale: [1, 1.1, 1.05, 1.15, 0.95, 1.08, 1],
          rotate: [0, 8, 15, 6, 0, -10, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1]
        }}
      />
      
      <motion.div 
        className="fixed right-[5vw] sm:right-[10vw] bottom-[5vh] sm:bottom-[10vh] w-[30vw] sm:w-[25vw] h-[30vw] sm:h-[25vw] rounded-full bg-gradient-to-tr from-[#00ffe0]/70 via-[#00ffe0]/20 to-transparent opacity-50 blur-xl pointer-events-none z-[-1]"
        animate={{
          y: [0, -55, -90, -50, -15, 40, 0],
          x: [0, -50, -40, 20, 70, 40, 0],
          scale: [1, 1.08, 0.94, 1.12, 1.05, 0.92, 1],
          rotate: [0, -8, -5, -12, -6, -3, 0]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.18, 0.36, 0.5, 0.68, 0.84, 1]
        }}
      />
      
      {/* Auth card */}
      <motion.div 
        className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full mb-12">
          <Link href="/">
            <motion.div 
              className="absolute top-0 left-0 flex items-center text-[#0f0f0f]/70 hover:text-[#0f0f0f] transition-all cursor-pointer hover:scale-105"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </motion.div>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <VersaLogo size="lg" className="mx-auto mb-6" />
          <h1 className="font-playfair text-2xl font-bold text-[#0f0f0f]">Verify Your Email</h1>
          <p className="text-[#0f0f0f]/70 font-playfair italic mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        {email && <p className="mb-6 text-center text-[#0f0f0f]/80">
          A verification code has been sent to <strong>{email}</strong>
        </p>}

        {success && (
          <motion.div 
            className="mb-6 p-4 bg-green-50 border border-green-100 text-green-800 rounded-md text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            A new verification code has been sent to your email.
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-800 rounded-md text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#0f0f0f] mb-2 font-playfair" htmlFor="otp">
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              className="w-full p-3 border border-[#dcdcdc]/50 rounded-md bg-white/90 text-[#0f0f0f] focus:ring-2 focus:ring-[#b8a1ff]/40 focus:border-[#b8a1ff]/40 transition-all text-center text-2xl tracking-wider"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim().substring(0, 6))}
              maxLength={6}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-3 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] font-bold text-sm rounded-md transition-all duration-300 backdrop-blur-sm shadow-md border border-white/20 hover:shadow-lg disabled:opacity-70 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#0f0f0f]/70 font-playfair">
            Didn't receive the code?{" "}
            <motion.button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-[#b8a1ff] hover:underline font-medium cursor-pointer inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Resend
            </motion.button>
          </p>
        </div>
      </motion.div>

      <motion.p 
        className="mt-10 text-sm text-[#0f0f0f]/60 font-playfair italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Built for the ones who read between the lines
      </motion.p>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea]">
        <div className="p-8 rounded-xl shadow-lg bg-white/80 backdrop-blur-lg">
          <div className="text-center">
            <VersaLogo size="lg" className="mx-auto mb-6" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
