"use client";

import { motion } from "framer-motion";

interface VersaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export default function VersaLogo({ 
  className = "", 
  size = "md", 
  animated = true 
}: VersaLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl", 
    lg: "text-4xl",
    xl: "text-6xl"
  };

  return (
    <motion.div
      className={`${className} flex items-center`}
      initial={animated ? { opacity: 0, y: -5 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} relative flex items-center`}
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="font-sans font-bold tracking-wider text-[#000] uppercase mr-[0.06em]">V</span>
          <motion.span 
            className="font-sans font-medium tracking-wide text-[#333] uppercase"
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            ersa
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Modern tech-focused wordmark with bold styling
export function VersaWordmark({ 
  className = "", 
  size = "md" 
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg" | "xl" 
}) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-4xl",
    xl: "text-6xl"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative inline-block">
        <div className="flex items-center">
          <span className="font-sans font-bold tracking-wider text-[#000] uppercase mr-[0.06em]">V</span>
          <span className="font-sans font-medium tracking-wide text-[#333] uppercase">ersa</span>
        </div>
      </div>
    </div>
  );
}

// Bold modern icon version
export function VersaIcon({ 
  className = "", 
  size = 32 
}: { 
  className?: string; 
  size?: number 
}) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-[#000] rounded-sm shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size * 0.7} 
        height={size * 0.7} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M4 6L12 18L20 6" 
          stroke="white"
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
