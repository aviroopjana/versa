"use client";

import React from "react";
import { motion } from "framer-motion";

interface FuturisticLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  onClick?: () => void;
}

const FuturisticLogo: React.FC<FuturisticLogoProps> = ({
  className = "",
  size = "md",
  animated = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const logoSize = {
    sm: 30,
    md: 40,
    lg: 50,
    xl: 70,
  };

  const actualSize = logoSize[size];
  
  const orbitalAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  return (
    <motion.div 
      className={`relative flex items-center ${className} group cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {/* SVG Logo */}
      <motion.svg 
        width={actualSize * 3} 
        height={actualSize * 1.5} 
        viewBox="0 0 120 60"
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={animated ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
      >
        {/* Glow Filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffe0" />
            <stop offset="50%" stopColor="#5cbfff" />
            <stop offset="100%" stopColor="#b8a1ff" />
          </linearGradient>
          
          <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffe0" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b8a1ff" stopOpacity="0.8" />
          </linearGradient>
          
          <clipPath id="logoClip">
            <path d="M30,10 L60,30 L30,50 L0,30 Z" />
          </clipPath>
        </defs>
        
        {/* Background Hexagon */}
        <motion.path 
          d="M30,10 L60,30 L30,50 L0,30 Z" 
          fill="url(#logoGradient)" 
          stroke="#ffffff" 
          strokeWidth="0.5" 
          filter="url(#glow)"
          animate={pulseAnimation}
        />
        
        {/* Circuit Lines */}
        <motion.g 
          stroke="#ffffff" 
          strokeWidth="0.5" 
          opacity="0.7" 
          fill="none"
        >
          <path d="M30,10 L30,50" />
          <path d="M0,30 L60,30" />
          <path d="M15,20 L45,40" />
          <path d="M15,40 L45,20" />
        </motion.g>
        
        {/* Data points */}
        <motion.g>
          <motion.circle cx="30" cy="10" r="1.5" fill="#ffffff" />
          <motion.circle cx="60" cy="30" r="1.5" fill="#ffffff" />
          <motion.circle cx="30" cy="50" r="1.5" fill="#ffffff" />
          <motion.circle cx="0" cy="30" r="1.5" fill="#ffffff" />
          <motion.circle cx="30" cy="30" r="2" fill="#ffffff" />
        </motion.g>
        
        {/* "V" Letter */}
        <motion.path 
          d="M20,20 L30,40 L40,20" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Orbital Rings */}
        <motion.g animate={orbitalAnimation}>
          <motion.ellipse 
            cx="30" 
            cy="30" 
            rx="25" 
            ry="15" 
            fill="none" 
            stroke="url(#orbitalGradient)" 
            strokeWidth="0.5" 
            opacity="0.6" 
          />
          <motion.ellipse 
            cx="30" 
            cy="30" 
            rx="28" 
            ry="18" 
            fill="none" 
            stroke="url(#orbitalGradient)" 
            strokeWidth="0.3" 
            opacity="0.4" 
            strokeDasharray="2,3"
          />
        </motion.g>
        
        {/* Wordmark */}
        <motion.text 
          x="70" 
          y="35" 
          className={sizeClasses[size]} 
          fontFamily="sans-serif" 
          fontWeight="700" 
          fill="#000000"
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          VERSA
        </motion.text>
      </motion.svg>
      
      {/* Hover Glow Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#00ffe0]/30 to-[#b8a1ff]/30 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        style={{ width: actualSize * 3, height: actualSize * 1.5 }}
      />
    </motion.div>
  );
};

export default FuturisticLogo;
