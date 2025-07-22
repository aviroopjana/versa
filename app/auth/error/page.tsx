"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import VersaLogo from "../../components/VersaLogo";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Callback":
        return "There was a problem with your sign-in. Please try again.";
      case "OAuthSignin":
        return "Could not initiate sign in with this provider.";
      case "OAuthCallback":
        return "There was a problem validating your sign-in.";
      case "OAuthCreateAccount":
        return "Could not create an account with this provider.";
      case "EmailCreateAccount":
        return "Could not create an account with this email.";
      case "EmailSignin":
        return "The sign-in link has expired or is invalid.";
      case "CredentialsSignin":
        return "The email or password you entered is incorrect.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea]">
      {/* Background elements */}
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
      
      {/* Error card */}
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-20 h-20 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-6"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
          
          <h1 className="font-playfair text-2xl font-bold text-[#0f0f0f]">Authentication Error</h1>
        </div>

        <motion.div 
          className="mb-6 p-4 bg-red-50 border border-red-100 text-red-800 rounded-md text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {errorMessage}
        </motion.div>

        <div className="flex gap-4">
          <motion.button
            onClick={() => window.history.back()}
            className="flex-1 py-3 bg-gray-100 text-[#0f0f0f] font-medium text-sm rounded-md transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            Go Back
          </motion.button>
          
          <Link href="/auth/signin" className="flex-1">
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] font-bold text-sm rounded-md transition-all duration-300 backdrop-blur-sm shadow-md border border-white/20 hover:shadow-lg cursor-pointer"
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Try Again
            </motion.button>
          </Link>
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

export default function AuthError() {
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
      <ErrorContent />
    </Suspense>
  );
}
