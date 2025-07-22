"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import VersaLogo, { VersaWordmark } from "./components/VersaLogo";

export default function Home() {
  const [demoInput, setDemoInput] = useState(
    "The party of the first part shall be entitled to all benefits and subject to all obligations set forth in Schedule A attached hereto and incorporated herein."
  );
  
  const [activeTab, setActiveTab] = useState("summary");
  const [typewriterText, setTypewriterText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const demoOutputs = {
    summary: "One party gets the benefits and responsibilities listed in Schedule A.",
    haiku: `Contract whispers soft—\nSchedule A holds secrets dear,\nBoth blessing and weight.`,
    eli5: "It's like when you make a deal with your friend. You both get some good things, but you also have to do some work. Everything is written on a special paper called Schedule A.",
    json: `{
  "parties": ["Party of the first part"],
  "benefits": "As defined in Schedule A", 
  "obligations": "As defined in Schedule A",
  "attachments": ["Schedule A"]
}`
  };

  useEffect(() => {
    const currentOutput = demoOutputs[activeTab as keyof typeof demoOutputs];
    let i = 0;
    setTypewriterText("");
    const timer = setInterval(() => {
      if (i < currentOutput.length) {
        setTypewriterText(currentOutput.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [activeTab]);

  const FloatingSparkles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => {
        const isCyan = Math.random() > 0.5;
        const color = isCyan ? "#00FFE0" : "#b8a1ff";
        const shadowColor = isCyan ? "rgba(0, 255, 224, 0.4)" : "rgba(184, 161, 255, 0.4)";
        
        // Create more complex movement paths
        const randomPath = Math.floor(Math.random() * 4);
        const animationPaths = [
          { // Curved floating path
            y: [0, -20, -35, -25, -40, -30, -15, 0],
            x: [0, 15, 5, 25, 15, 0, -10, 0]
          },
          { // Zig-zag path
            y: [0, -15, -30, -15, -45, -20, 0],
            x: [0, 15, -10, 20, 0, -15, 0]
          },
          { // Gentle spiral-like
            y: [0, -10, -25, -30, -20, -35, -15, 0],
            x: [0, 10, 25, 10, -5, -15, 5, 0]
          },
          { // Soft bobbing
            y: [0, -20, -10, -30, -15, -25, -5, 0],
            x: [0, 5, 10, 15, 5, -5, -10, 0]
          }
        ];
        
        const movementPath = animationPaths[randomPath];
        const duration = 8 + Math.random() * 12;
        
        return (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-white rounded-full opacity-40`} // Reduced opacity from 0.7 to 0.4 and size from w-2/h-2 to w-1.5/h-1.5
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 6px ${shadowColor}`, // Reduced from 10px to 6px
              background: `radial-gradient(circle at center, white 20%, ${color})`,
            }}
            animate={{
              y: movementPath.y,
              x: movementPath.x,
              opacity: [0.4, 0.6, 0.7, 0.6, 0.4], // Reduced opacity levels
              scale: [1, 1.2, 1.4, 1.2, 1], // Reduced scaling
              boxShadow: [
                `0 0 6px ${shadowColor}`,
                `0 0 10px ${shadowColor}`,
                `0 0 12px ${shadowColor}`,
                `0 0 10px ${shadowColor}`,
                `0 0 6px ${shadowColor}`
              ], // Reduced glow intensity
              rotate: [0, isCyan ? 90 : -90, 0] // Reduced rotation
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 0.9, 1]
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen font-geist relative">
      {/* Premium elegant background with subtle radial gradient - fixed position */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea] pointer-events-none z-[-3]"></div>
      
      {/* Conic gradient overlay with enhanced colors - fixed position */}
      <div className="fixed inset-0 bg-[conic-gradient(at_top_right,_#fdfdfd,_#d7fffb/15,_#b8a1ff/8,_#f3f3f3,_#fdfdfd)] opacity-60 pointer-events-none z-[-2]"></div>
      
      {/* Subtle glowing sparkle dots with reduced brightness and density */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        {/* This creates a field of subtle glowing sparkles that stay fixed while scrolling */}
        <motion.div 
          className="fixed top-[10vh] right-[20vw] w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(0,255,224,0.4)] blur-[1px]"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 8px rgba(0, 255, 224, 0.3)",
              "0 0 12px rgba(0, 255, 224, 0.5)",
              "0 0 8px rgba(0, 255, 224, 0.3)"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="fixed top-[30vh] left-[15vw] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(184,161,255,0.4)] blur-[1px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 0 6px rgba(184, 161, 255, 0.3)",
              "0 0 10px rgba(184, 161, 255, 0.4)",
              "0 0 6px rgba(184, 161, 255, 0.3)"
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="fixed top-[60vh] right-[30vw] w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(184,161,255,0.4)] blur-[1px]"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 0 6px rgba(184, 161, 255, 0.3)",
              "0 0 10px rgba(184, 161, 255, 0.5)",
              "0 0 6px rgba(184, 161, 255, 0.3)"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Enhanced fog effect with more vibrant gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="fixed top-0 left-0 right-0 h-[50vh] bg-[radial-gradient(circle_at_top_left,_#b8a1ff/25,_transparent_70%)] opacity-70"></div>
        <div className="fixed bottom-0 right-0 left-0 h-[50vh] bg-[radial-gradient(circle_at_bottom_right,_#d7fffb/25,_transparent_70%)] opacity-60"></div>
        
        {/* Enhanced complementary color spots - re-adjusted positions */}
        <div className="fixed bottom-[30vh] left-[25vw] w-[20vw] h-[20vw] rounded-full bg-[radial-gradient(circle,_#00ffe0/20,_transparent_80%)] opacity-60 blur-xl"></div>
        <div className="fixed top-[25vh] right-[20vw] w-[20vw] h-[20vw] rounded-full bg-[radial-gradient(circle,_#b8a1ff/20,_transparent_80%)] opacity-50 blur-xl"></div>
      </div>
      
      {/* Subtle texture overlay for premium paper-like feel - enhanced fixed position */}
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjAyIiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48L3N2Zz4=')] opacity-[0.02] mix-blend-soft-light z-[-1]"></div>
      
      {/* Animated purple gradient circles with more dramatic floating motion on top left - smaller size */}
      <motion.div 
        className="fixed left-[5vw] sm:left-[12vw] top-[10vh] sm:top-[15vh] w-[35vw] sm:w-[30vw] h-[35vw] sm:h-[30vw] rounded-full bg-gradient-to-br from-[#b8a1ff]/70 via-[#b8a1ff]/20 to-transparent opacity-50 blur-xl pointer-events-none z-[-3]"
        animate={{
          y: [0, -60, -30, -80, -40, -60, 0],
          x: [0, 40, 80, 60, 20, -40, 0],
          scale: [1, 1.1, 1.05, 1.15, 0.95, 1.08, 1],
          rotate: [0, 8, 15, 6, 0, -10, 0]
        }}
        transition={{
          duration: 25, // Faster animation
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1]
        }}
      />
      <motion.div 
        className="fixed left-[10vw] sm:left-[15vw] top-[20vh] sm:top-[25vh] w-[25vw] sm:w-[20vw] h-[25vw] sm:h-[20vw] rounded-full bg-gradient-to-br from-[#b8a1ff]/60 via-[#b8a1ff]/15 to-transparent opacity-40 blur-xl pointer-events-none z-[-3]"
        animate={{
          y: [0, 50, 90, 40, -30, -60, 0],
          x: [0, -40, -70, -30, 15, 50, 0],
          scale: [1, 0.92, 1.08, 1.12, 0.95, 0.9, 1],
          rotate: [0, -8, -12, -4, 0, 6, 0]
        }}
        transition={{
          duration: 22, // Faster animation
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
          times: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1]
        }}
      />
      
      {/* Animated cyan gradient circles with more dramatic floating motion on bottom right - smaller size */}
      <motion.div 
        className="fixed right-[5vw] sm:right-[10vw] bottom-[5vh] sm:bottom-[10vh] w-[30vw] sm:w-[25vw] h-[30vw] sm:h-[25vw] rounded-full bg-gradient-to-tr from-[#00ffe0]/70 via-[#00ffe0]/20 to-transparent opacity-50 blur-xl pointer-events-none z-[-3]"
        animate={{
          y: [0, -55, -90, -50, -15, 40, 0],
          x: [0, -50, -40, 20, 70, 40, 0],
          scale: [1, 1.08, 0.94, 1.12, 1.05, 0.92, 1],
          rotate: [0, -8, -5, -12, -6, -3, 0]
        }}
        transition={{
          duration: 24, // Faster animation
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.18, 0.36, 0.5, 0.68, 0.84, 1]
        }}
      />
      <motion.div 
        className="fixed right-[15vw] sm:right-[15vw] bottom-[20vh] w-[25vw] sm:w-[18vw] h-[25vw] sm:h-[18vw] rounded-full bg-gradient-to-tr from-[#00ffe0]/60 via-[#00ffe0]/15 to-transparent opacity-40 blur-xl pointer-events-none z-[-3]"
        animate={{
          y: [0, 40, 80, 30, -50, -30, 0],
          x: [0, 30, 60, 70, 45, -15, 0],
          scale: [1, 0.9, 1.06, 0.95, 1.1, 0.93, 1],
          rotate: [0, 6, 12, 3, -4, -9, 0]
        }}
        transition={{
          duration: 20, // Faster animation
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
          times: [0, 0.16, 0.33, 0.5, 0.67, 0.84, 1]
        }}
      />
      
      {/* Navigation - less transparent */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfdfd]/75 backdrop-blur-[5px] border-b border-[#dcdcdc]/15 shadow-sm">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00ffe0]/[0.01] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <VersaLogo size="md" />
            <div className="flex items-center gap-3 sm:gap-6">
              <button className="hidden sm:block text-sm text-[#0f0f0f]/80 hover:text-[#0f0f0f] transition-all font-medium cursor-pointer hover:scale-105">
                About
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#00ffe0] text-[#0f0f0f] text-xs sm:text-sm font-medium rounded-md hover:bg-[#00ffe0]/90 transition-all shadow-[0_0_15px_rgba(0,255,224,0.25)] cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,224,0.35)]">
                Launch
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        <FloatingSparkles />
                
        {/* Adding floating animated elements for this specific section that work with the fixed background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Light sparkle elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Paper-like texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48L3N2Zz4=')]"></div>

        <div className="relative text-center max-w-4xl mx-auto px-6">
          {/* Main headline - one word per line with serif font */}
          <motion.div className="mb-6 sm:mb-12 flex flex-col items-center">
            {["Where", "contracts", "become"].map((word, index) => (
              <motion.div
                key={index}
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.3 }}
              >
                <motion.span
                  className="inline-block font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold text-[#0f0f0f] drop-shadow-md tracking-tight"
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: index * 0.3,
                    ease: "easeOut"
                  }}
                >
                  {word}
                </motion.span>
              </motion.div>
            ))}
            
            <motion.div
              className="overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <motion.div
                className="inline-flex items-center"
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              >
                <span className="font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[#00ffe0] to-[#b8a1ff] bg-clip-text text-transparent">
                  clarity,
                </span>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.div
                className="inline-block"
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
              >
                <span className="font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold text-[#0f0f0f]">
                  verse, and insight
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, repeatDelay: 0.3 }}
                  className="inline-block ml-2 h-12 w-1 bg-[#00ffe0] rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Subtext with elegant serif */}
          <motion.p 
            className="font-playfair italic text-lg sm:text-xl lg:text-2xl text-[#0f0f0f]/80 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            Versa reimagines legal language with AI and artistry. It doesn't summarize. It translates.
          </motion.p>

          <motion.p 
            className="text-base sm:text-lg text-[#0f0f0f]/70 mb-10 sm:mb-20 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0 }}
          >
            From dense legalese to structured beauty — precision meets poetry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.4 }}
          >
            <motion.button
              className="px-6 sm:px-10 py-3 sm:py-5 bg-transparent border border-[#00ffe0]/70 text-[#0f0f0f] font-medium text-base sm:text-lg rounded-lg transition-all duration-500 cursor-pointer"
              whileHover={{ 
                boxShadow: "0 0 30px rgba(0, 255, 224, 0.15)",
                borderColor: "rgba(0, 255, 224, 0.8)",
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/auth/signup?callbackUrl=/dashboard'}
            >
              Launch Playground
            </motion.button>
            <motion.div className="text-sm text-[#0f0f0f]/60 font-playfair italic underline-offset-4 hover:underline">
              Built for the ones who read between the lines
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Modes Section - Minimalist Gallery */}
      <section className="py-20 sm:py-28 md:py-32 max-w-6xl mx-auto px-6 relative z-1">
        <motion.div 
          className="text-center mb-16 sm:mb-20 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl lg:text-5xl font-playfair font-semibold text-[#0f0f0f] mb-8 drop-shadow-sm">
            Explain like you're human
          </h2>
          <p className="text-lg text-[#0f0f0f]/75 font-playfair italic tracking-wide max-w-2xl mx-auto">
            Each clause, translated four ways, each revealing different dimensions of meaning
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              symbol: "✍",
              title: "Poetic Rewrite",
              description: "Legal language, reborn as verse",
              accent: "border-l-[#b8a1ff]/80",
              delay: 0.1
            },
            {
              symbol: "⟢", 
              title: "Plain Summary",
              description: "Distilled essence, complete clarity",
              accent: "border-l-[#00ffe0]/80",
              delay: 0.25
            },
            {
              symbol: "◎",
              title: "Human ELI5", 
              description: "For when complexity needs simplicity",
              accent: "border-l-[#ffb6a2]/80",
              delay: 0.4
            },
            {
              symbol: "⌘",
              title: "Structured Data",
              description: "Parties. Dates. Obligations. As code.",
              accent: "border-l-[#dcdcdc]/80",
              delay: 0.55
            }
          ].map((mode, index) => (
            <motion.div
              key={index}
              className={`bg-white/75 backdrop-blur-lg rounded-lg p-8 border-l-4 ${mode.accent} hover:shadow-lg transition-all duration-500 shadow-md cursor-pointer`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: mode.delay }}
              whileHover={{ 
                x: 4,
                y: -4,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
              }}
            >
              <div className="text-2xl mb-6 opacity-80 font-playfair">{mode.symbol}</div>
              <h3 className="text-xl font-playfair font-semibold text-[#0f0f0f] mb-4">
                {mode.title}
              </h3>
              <p className="text-sm text-[#0f0f0f]/75 font-playfair italic leading-relaxed tracking-wide">
                {mode.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Playground Mock */}
      <section className="py-20 sm:py-24 md:py-36 relative z-1">
        {/* Subtle glass-like background for the playground section */}
        <div className="absolute inset-0 bg-[#fdfdfd]/70 backdrop-blur-[2px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-12 sm:mb-20 relative z-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl lg:text-5xl font-playfair font-semibold text-[#0f0f0f] mb-6 drop-shadow-sm">
              Read contracts with feeling
            </h2>
            <p className="text-lg text-[#0f0f0f]/75 font-playfair italic tracking-wide max-w-2xl mx-auto">
              Generated in real time. Powered by Versa's language engine.
            </p>
          </motion.div>

          {/* Paper-like texture overlay for the playground */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 -m-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48L3N2Zz4=')] opacity-10 rounded-xl pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 relative">
              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="backdrop-blur-2xl bg-white/75 rounded-xl p-8 border border-[#dcdcdc]/50 shadow-xl"
              >
                <label className="block text-sm font-medium text-[#0f0f0f] mb-4 font-playfair">
                  Paste a Clause
                </label>
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full h-48 p-6 border border-[#dcdcdc]/50 rounded-md bg-[#fdfdfd]/90 text-[#0f0f0f] resize-none focus:ring-2 focus:ring-[#b8a1ff]/40 focus:border-[#b8a1ff]/40 transition-all font-playfair text-sm leading-relaxed shadow-inner"
                  placeholder="Paste your legal text here..."
                />
                <div className="mt-4 flex justify-end">
                  <div className="text-xs text-[#0f0f0f]/60 font-playfair italic">
                    *AI processes this text only on your device
                  </div>
                </div>
              </motion.div>

              {/* Output */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="backdrop-blur-2xl bg-white/75 rounded-xl p-8 border border-[#dcdcdc]/50 shadow-xl"
              >
                <div className="flex gap-6 mb-6">
                  {[
                    { key: "summary", label: "Summary" },
                    { key: "haiku", label: "Haiku" },
                    { key: "eli5", label: "ELI5" },
                    { key: "json", label: "Extract" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`transition-all relative cursor-pointer ${
                        activeTab === tab.key
                          ? "text-[#0f0f0f] font-bold"
                          : "text-[#0f0f0f]/60 hover:text-[#0f0f0f]/90"
                      }`}
                    >
                      <span className="text-sm font-playfair hover:scale-105 transition-transform inline-block">{tab.label}</span>
                      {activeTab === tab.key && (
                        <motion.div 
                          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ffe0] to-[#b8a1ff]"
                          layoutId="activeTab"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="h-48 p-6 bg-white/80 rounded-lg border border-white/60 shadow-inner backdrop-blur-sm">
                  <motion.pre
                    key={activeTab}
                    className={`text-sm ${
                      activeTab === "haiku" 
                        ? "font-playfair italic" 
                        : activeTab === "json" 
                          ? "font-mono" 
                          : activeTab === "eli5"
                            ? "font-geist" 
                            : "font-playfair"
                    } text-[#0f0f0f] whitespace-pre-wrap leading-relaxed h-full overflow-auto`}
                  >
                    {typewriterText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="inline-block ml-1 h-4 w-0.5 bg-gradient-to-r from-[#00ffe0] to-[#b8a1ff] rounded-full"
                    />
                  </motion.pre>
                </div>
              </motion.div>
          </div>
        </div>
      </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-20 sm:py-28 md:py-32 lg:py-36 relative z-1">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16 sm:mb-20 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl lg:text-5xl font-playfair font-semibold text-[#0f0f0f] mb-6 drop-shadow-sm">
              From PDF to Poem
            </h2>
            <p className="text-lg text-[#0f0f0f]/75 font-playfair italic tracking-wide max-w-2xl mx-auto">
              Four steps to linguistic transformation
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#dcdcdc]/50"></div>

            <div className="space-y-16 sm:space-y-24">
              {[
                {
                  number: "01",
                  title: "Upload",
                  description: "Drag, drop, or paste your contract. Versa handles PDFs, Word documents, and plain text.",
                  color: "from-[#00ffe0]/20 to-[#00ffe0]/0",
                  glassColor: "bg-[#00ffe0]/5"
                },
                {
                  number: "02", 
                  title: "Parse",
                  description: "Advanced natural language processing breaks down complex legal structures into semantic units.",
                  color: "from-[#b8a1ff]/20 to-[#b8a1ff]/0",
                  glassColor: "bg-[#b8a1ff]/5"
                },
                {
                  number: "03",
                  title: "Transform",
                  description: "Language models trained on legal contexts generate multiple perspectives on your text.",
                  color: "from-[#ffb6a2]/20 to-[#ffb6a2]/0",
                  glassColor: "bg-[#ffb6a2]/5"
                },
                {
                  number: "04",
                  title: "Deliver",
                  description: "Results appear with typographic precision, ready to export or integrate.",
                  color: "from-[#dcdcdc]/30 to-[#dcdcdc]/0",
                  glassColor: "bg-[#dcdcdc]/10"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative pl-12"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 top-0 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 bg-white border border-gray-200 shadow-sm rounded-full" />
                  </div>
                  
                  {/* Background gradient with glassmorphism */}
                  <div className={`absolute left-1 top-0 bottom-0 w-full rounded-lg bg-gradient-to-r ${step.color} backdrop-blur-sm ${step.glassColor} opacity-60 -z-10 shadow-sm`}></div>
                  
                  <div className="text-xs font-mono tracking-widest text-[#0f0f0f]/70 font-semibold mb-2 ml-2">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-playfair text-[#0f0f0f] font-semibold mb-3 ml-2">
                    {step.title}
                  </h3>
                  <p className="text-[#0f0f0f]/85 font-playfair italic leading-relaxed max-w-lg ml-2">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 md:py-32 lg:py-40 relative overflow-visible">
        {/* Elegant background for CTA section with reduced opacity to see fixed gradient balls through it */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfdfd]/30 to-[#f3f3f3]/40 backdrop-blur-[2px] z-[-2]"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Background subtle words */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
              {["meaning", "structure", "language", "clarity", "insight", "poetry"].map((word, index) => (
                <motion.div
                  key={index}
                  className="absolute text-7xl font-playfair font-bold text-[#0f0f0f]"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    opacity: [0.03, 0.05, 0.03],
                  }}
                  transition={{
                    duration: 60 + Math.random() * 40,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
            
            {/* Main CTA content */}
            <div className="relative">
              {/* Subtle glass effect for content */}
              <div className="absolute inset-0 -mx-6 -my-12 bg-white/70 backdrop-blur-md rounded-2xl z-[-1] shadow-lg"></div>
              
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                {["You've", "read", "law."].map((word, index) => (
                  <motion.div
                    key={index}
                    className="overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.3 }}
                  >
                    <motion.span
                      className="inline-block font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f0f0f]"
                      initial={{ y: 60 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 1.2, 
                        delay: index * 0.3,
                        ease: "easeOut"
                      }}
                    >
                      {word}
                    </motion.span>
                  </motion.div>
                ))}
                
                <motion.div
                  className="overflow-hidden mt-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  <motion.div
                    className="inline-block"
                    initial={{ y: 60 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                  >
                    <span className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#00ffe0] to-[#b8a1ff] bg-clip-text text-transparent">
                      Now, speak it better.
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="mt-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <motion.button
                  className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] font-bold text-base sm:text-lg rounded-md transition-all duration-300 backdrop-blur-sm shadow-lg border border-white/20 cursor-pointer"
                  whileHover={{ 
                    boxShadow: "0 0 30px rgba(0, 255, 224, 0.3), 0 0 60px rgba(184, 161, 255, 0.2)",
                    scale: 1.03,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  onClick={() => window.location.href = '/auth/signup?callbackUrl=/dashboard'}
                >
                  Launch Playground
                </motion.button>
                
                <motion.p 
                  className="mt-8 text-sm text-[#0f0f0f]/65 font-playfair italic"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1.8 }}
                >
                  Versa awaits.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 sm:py-16 md:py-20 border-t border-[#dcdcdc]/30"> 
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-10 md:mb-0">
              <VersaLogo size="lg" animated={false} className="mb-3" />
              <p className="text-[#0f0f0f]/50 font-playfair italic text-sm tracking-wide">
                Built for the ones who read between the lines
              </p>
            </div>
            <div className="text-sm text-[#0f0f0f]/40 font-playfair">
              © 2025 Versa
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
