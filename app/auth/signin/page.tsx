"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import VersaLogo from "../../components/VersaLogo";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Success
      router.push(callbackUrl);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

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
          <h1 className="font-playfair text-2xl font-bold text-[#0f0f0f]">Sign in to Versa</h1>
          <p className="text-[#0f0f0f]/70 font-playfair italic mt-2">Access the legal translation platform</p>
        </div>

        {registered && (
          <motion.div 
            className="mb-6 p-4 bg-green-50 border border-green-100 text-green-800 rounded-md text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Account created successfully! Please sign in.
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f0f0f] mb-2 font-playfair" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-[#dcdcdc]/50 rounded-md bg-white/90 text-[#0f0f0f] focus:ring-2 focus:ring-[#b8a1ff]/40 focus:border-[#b8a1ff]/40 transition-all"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#0f0f0f] mb-2 font-playfair" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-[#dcdcdc]/50 rounded-md bg-white/90 text-[#0f0f0f] focus:ring-2 focus:ring-[#b8a1ff]/40 focus:border-[#b8a1ff]/40 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 text-right">
              <Link href="/auth/forgot-password" className="text-sm text-[#b8a1ff] hover:underline font-playfair italic cursor-pointer inline-block">
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Forgot password?
                </motion.span>
              </Link>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] font-bold text-sm rounded-md transition-all duration-300 backdrop-blur-sm shadow-md border border-white/20 hover:shadow-lg disabled:opacity-70 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dcdcdc]/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-[#0f0f0f]/60 font-playfair">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => signIn("google", { callbackUrl })}
              className="flex justify-center items-center py-2.5 px-4 border border-[#dcdcdc]/50 rounded-md shadow-sm bg-white text-sm font-medium text-[#0f0f0f]/80 hover:bg-gray-50 cursor-pointer"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(250, 250, 250, 1)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5.22,16.25 5.22,12.27C5.22,8.29 8.36,5.28 12.19,5.28C15.14,5.28 17.09,7.23 17.09,7.23L19.04,5.27C19.04,5.27 16.34,2.72 12.19,2.72C6.92,2.72 2.51,7.06 2.51,12.27C2.51,17.49 6.92,21.82 12.19,21.82C17.34,21.82 21.06,17.84 21.06,12.27C21.06,11.54 21.35,11.1 21.35,11.1Z"
                />
              </svg>
              Google
            </motion.button>
            <motion.button
              onClick={() => signIn("github", { callbackUrl })}
              className="flex justify-center items-center py-2.5 px-4 border border-[#dcdcdc]/50 rounded-md shadow-sm bg-white text-sm font-medium text-[#0f0f0f]/80 hover:bg-gray-50 cursor-pointer"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(250, 250, 250, 1)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                />
              </svg>
              GitHub
            </motion.button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-[#0f0f0f]/70 font-playfair">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#b8a1ff] hover:underline font-medium cursor-pointer inline-block">
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign up
              </motion.span>
            </Link>
          </div>
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

export default function SignIn() {
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
      <SignInContent />
    </Suspense>
  );
}
