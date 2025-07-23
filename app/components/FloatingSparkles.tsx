"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingSparklesProps {
  className?: string;
  count?: number;
}

const FloatingSparkles: React.FC<FloatingSparklesProps> = ({ 
  className = "",
  count = 30
}) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.2
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute bg-white rounded-full"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            opacity: sparkle.opacity,
            boxShadow: `0 0 ${sparkle.size * 2}px rgba(255, 255, 255, 0.8)`
          }}
          animate={{
            y: [`${sparkle.y}%`, `${(sparkle.y + 5) % 100}%`, `${sparkle.y}%`],
            x: [`${sparkle.x}%`, `${(sparkle.x + (Math.random() * 10 - 5)) % 100}%`, `${sparkle.x}%`],
            opacity: [sparkle.opacity, sparkle.opacity * 1.5, sparkle.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
            times: [0, 0.5, 1]
          }}
        />
      ))}
    </div>
  );
};

export default FloatingSparkles;
