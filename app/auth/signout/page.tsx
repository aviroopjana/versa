"use client";

import { useEffect, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VersaLogo from "@/app/components/VersaLogo";

function SignOutContent() {
  const router = useRouter();
  
  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ redirect: false });
      router.push('/');
    };
    
    const timer = setTimeout(() => {
      handleSignOut();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea]">
      <motion.div 
        className="fixed left-[5vw] sm:left-[12vw] top-[10vh] sm:top-[15vh] w-[35vw] sm:w-[30vw] h-[35vw] sm:h-[30vw] rounded-full bg-gradient-to-br from-[#b8a1ff]/70 via-[#b8a1ff]/20 to-transparent dark:from-[#b8a1ff]/50 dark:via-[#b8a1ff]/15 dark:to-transparent opacity-50 blur-xl pointer-events-none z-[-1]"
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
        className="fixed right-[5vw] sm:right-[10vw] bottom-[5vh] sm:bottom-[10vh] w-[30vw] sm:w-[25vw] h-[30vw] sm:h-[25vw] rounded-full bg-gradient-to-tr from-[#00ffe0]/70 via-[#00ffe0]/20 to-transparent dark:from-[#00ffe0]/50 dark:via-[#00ffe0]/15 dark:to-transparent opacity-50 blur-xl pointer-events-none z-[-1]"
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
      
      {/* Card */}
      <motion.div 
        className="w-full max-w-md p-8 bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/60 dark:border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <VersaLogo size="lg" className="mx-auto mb-6" />
          <h1 className="font-playfair text-2xl font-bold text-[#0f0f0f] dark:text-white">Signing Out...</h1>
          <p className="text-[#0f0f0f]/70 dark:text-white/70 font-playfair italic mt-2">Thank you for using Versa</p>
        </div>

        <div className="flex justify-center my-8">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12"
          >
            <svg className="w-full h-full text-[#b8a1ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </motion.div>
        </div>

        <motion.button
          onClick={() => router.push('/')}
          className="w-full py-3 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] dark:text-[#0f0f0f] font-bold text-sm rounded-md transition-all duration-300 backdrop-blur-sm shadow-md border border-white/20 dark:border-white/10 hover:shadow-lg cursor-pointer"
          whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          Return to Home
        </motion.button>
      </motion.div>

      <motion.p 
        className="mt-10 text-sm text-[#0f0f0f]/60 dark:text-white/60 font-playfair italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Built for the ones who read between the lines
      </motion.p>
    </div>
  );
}

export default function SignOut() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea] dark:from-[#1a1a1a] dark:via-[#161616]/90 dark:to-[#131313]">
        <div className="p-8 rounded-xl shadow-lg bg-white/90 dark:bg-white/10 backdrop-blur-lg">
          <div className="text-center">
            <VersaLogo size="lg" className="mx-auto mb-6" />
            <p className="dark:text-white">Signing out...</p>
          </div>
        </div>
      </div>
    }>
      <SignOutContent />
    </Suspense>
  );
}
