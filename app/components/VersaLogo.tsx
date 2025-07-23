"use client";

import { motion } from "framer-motion";

interface VersaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  gradient?: boolean;
}

export default function VersaLogo({ 
  className = "", 
  size = "md", 
  animated = true,
  gradient = false
}: VersaLogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl",
    xl: "text-8xl"
  };

  // Enhanced animation for V dot
  const dotAnimation = animated ? {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8]
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  // Logo hover animation
  const hoverAnimation = {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`${className} flex items-center group relative`}
      initial={animated ? { opacity: 0, y: -5 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...hoverAnimation}
    >
      {/* Subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffe0]/0 via-[#00ffe0]/20 to-[#00ffe0]/0 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} relative flex items-center z-10`}
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={`font-sans font-black tracking-wider ${gradient ? "bg-gradient-to-r from-[#000] to-[#333] bg-clip-text text-transparent" : "text-[#000]"} uppercase mr-[0.06em] relative`}>
            V
            <motion.span 
              className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#00ffe0] to-[#00ffe0] rounded-full shadow-[0_0_10px_rgba(0,255,224,0.7)]"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              } : undefined}
              transition={animated ? {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : undefined}
            ></motion.span>
          </span>
          <motion.span 
            className={`font-sans font-semibold tracking-wide ${gradient ? "bg-gradient-to-r from-[#333] to-[#666] bg-clip-text text-transparent" : "text-[#333]"} uppercase`}
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
  size = "md",
  gradient = false,
  animated = false
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
  animated?: boolean;
}) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl", 
    lg: "text-5xl",
    xl: "text-7xl"
  };

  return (
    <motion.div 
      className={`${sizeClasses[size]} ${className} group`}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative inline-block">
        <div className="flex items-center">
          <motion.span 
            className={`font-sans font-black tracking-wider ${gradient ? 'bg-gradient-to-r from-[#000] to-[#333] bg-clip-text text-transparent' : 'text-[#000] dark:text-white'} uppercase mr-[0.06em] relative`}
            initial={animated ? { opacity: 0, y: -5 } : {}}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            V
            <motion.span 
              className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#00ffe0] to-[#00ffe0] rounded-full shadow-[0_0_8px_rgba(0,255,224,0.5)]"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              } : undefined}
              transition={animated ? {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : undefined}
            ></motion.span>
          </motion.span>
          <motion.span 
            className={`font-sans font-medium tracking-wide ${gradient ? 'bg-gradient-to-r from-[#333] to-[#666] bg-clip-text text-transparent' : 'text-[#333] dark:text-[#f0f0f0]'} uppercase`}
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ersa
          </motion.span>
        </div>
        
        {/* Hover highlight line */}
        <motion.div 
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#00ffe0] to-[#00ffe0]/70 w-0 group-hover:w-full rounded-full shadow-[0_0_5px_rgba(0,255,224,0.5)]"
          transition={{ duration: 0.3 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

// Bold modern icon version
export function VersaIcon({ 
  className = "", 
  size = 36,
  animated = true
}: { 
  className?: string; 
  size?: number;
  animated?: boolean;
}) {
  return (
    <motion.div
      className={`inline-flex items-center justify-center bg-gradient-to-br from-[#000] to-[#222] dark:from-white dark:to-[#f0f0f0] rounded-sm shadow-lg group ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 12px rgba(0, 255, 224, 0.5)"
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Accent dot */}
      <motion.div 
        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00ffe0] rounded-full shadow-[0_0_10px_rgba(0,255,224,0.7)]"
        animate={animated ? {
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        } : {}}
        transition={animated ? {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
      
      <svg 
        width={size * 0.7} 
        height={size * 0.7} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M4 6L12 18L20 6" 
          stroke="white"
          className="dark:stroke-[#000]"
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: animated ? 0 : 1, opacity: animated ? 0 : 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: animated ? 1 : 0, ease: "easeInOut" }}
        />
        
        {/* Accent dot in the middle */}
        <motion.circle 
          cx="16" 
          cy="10" 
          r="2" 
          fill="#00FFE0"
          initial={{ scale: animated ? 0 : 1, opacity: animated ? 0 : 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: animated ? 0.8 : 0, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}
