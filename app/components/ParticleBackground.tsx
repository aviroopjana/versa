"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    // Particle settings
    const particleCount = Math.floor(window.innerWidth / 10); // Adjust density based on screen size
    const particles: Particle[] = [];
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: "dot" | "line" | "circuit";
      connected: boolean;
      connectionPoints: {x: number, y: number}[];
      growDirection: number;
    }
    
    // Generate particles
    for (let i = 0; i < particleCount; i++) {
      const randomType = Math.random();
      let type: "dot" | "line" | "circuit" = "dot";
      
      if (randomType > 0.7) type = "line";
      if (randomType > 0.9) type = "circuit";
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === "dot" ? Math.random() * 2 + 0.5 : Math.random() * 1 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        type,
        connected: false,
        connectionPoints: type === "circuit" ? generateCircuitPoints(canvas.width, canvas.height) : [],
        growDirection: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    function generateCircuitPoints(maxWidth: number, maxHeight: number) {
      const points = [];
      const centerX = Math.random() * maxWidth;
      const centerY = Math.random() * maxHeight;
      const segments = Math.floor(Math.random() * 3) + 2;
      
      let lastX = centerX;
      let lastY = centerY;
      
      for (let i = 0; i < segments; i++) {
        // Decide if moving horizontally or vertically
        const isHorizontal = Math.random() > 0.5;
        
        if (isHorizontal) {
          const newX = lastX + (Math.random() - 0.5) * 100;
          points.push({ x: newX, y: lastY });
          lastX = newX;
        } else {
          const newY = lastY + (Math.random() - 0.5) * 100;
          points.push({ x: lastX, y: newY });
          lastY = newY;
        }
      }
      
      return points;
    }
    
    // Animation loop
    let animationFrame: number;
    let hue = 0;
    
    function animate() {
      // Clear canvas with a very subtle background
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around screen edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        
        // Draw particles based on type
        switch (p.type) {
          case "dot":
            drawDot(p);
            break;
          case "line":
            drawLine(p);
            break;
          case "circuit":
            drawCircuit(p);
            break;
        }
        
        // Connect some particles with subtle lines
        if (!p.connected && Math.random() < 0.01) {
          connectParticles(p, particles, ctx);
        }
      }
      
      // Slowly change hue for gradient effects
      hue = (hue + 0.1) % 360;
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    function drawDot(p: Particle) {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }
    
    function drawLine(p: Particle) {
      if (!ctx) return;
      
      const length = 10 + Math.random() * 5;
      const angle = Math.atan2(p.speedY, p.speedX);
      
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(
        p.x + Math.cos(angle) * length,
        p.y + Math.sin(angle) * length
      );
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
      ctx.lineWidth = p.size / 2;
      ctx.stroke();
    }
    
    function drawCircuit(p: Particle) {
      if (!ctx || p.connectionPoints.length === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      
      // Draw the circuit path
      for (const point of p.connectionPoints) {
        ctx.lineTo(point.x, point.y);
      }
      
      // Use gradient from cyan to purple
      const startColor = `hsla(${(hue + 180) % 360}, 100%, 70%, ${p.opacity * 0.6})`;
      const endColor = `hsla(${hue}, 100%, 70%, ${p.opacity * 0.6})`;
      
      ctx.strokeStyle = Math.random() > 0.5 ? startColor : endColor;
      ctx.lineWidth = p.size / 3;
      ctx.stroke();
      
      // Add small circuit dots at connection points
      for (const point of p.connectionPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 1.5})`;
        ctx.fill();
      }
    }
    
    function connectParticles(p1: Particle, particles: Particle[], ctx: CanvasRenderingContext2D) {
      // Only connect if not already connected and randomly
      if (p1.connected || Math.random() > 0.3) return;
      
      // Find a nearby particle to connect with
      for (let i = 0; i < particles.length; i++) {
        const p2 = particles[i];
        if (p1 === p2 || p2.connected) continue;
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connect if close enough
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(p1.opacity + p2.opacity) * 0.1})`;
          ctx.lineWidth = 0.2;
          ctx.stroke();
          
          p1.connected = true;
          p2.connected = true;
          break;
        }
      }
    }
    
    animate();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.4 }}
    />
  );
};

export default ParticleBackground;
