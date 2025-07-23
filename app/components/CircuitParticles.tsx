"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CircuitParticlesProps {
  className?: string;
}

interface CircuitNode {
  id: number;
  x: number;
  y: number;
  connections: number[];
  size: number;
  pulse: boolean;
  pulseDelay: number;
}

interface CircuitPath {
  from: number;
  to: number;
  path: { x: number; y: number }[];
  active: boolean;
  progress: number;
  speed: number;
  color: string;
}

const CircuitParticles: React.FC<CircuitParticlesProps> = ({ className = "" }) => {
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [paths, setPaths] = useState<CircuitPath[]>([]);
  
  // Generate circuit network on component mount
  useEffect(() => {
    const generateCircuit = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Create nodes
      const newNodes: CircuitNode[] = [];
      const nodeCount = Math.max(5, Math.floor(windowWidth * windowHeight / 50000));
      
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * windowWidth,
          y: Math.random() * windowHeight,
          connections: [],
          size: Math.random() * 3 + 2,
          pulse: Math.random() > 0.7,
          pulseDelay: Math.random() * 5
        });
      }
      
      // Create connections between nodes
      const newPaths: CircuitPath[] = [];
      
      newNodes.forEach((node, i) => {
        // Each node connects to 1-3 other nodes
        const connectionCount = Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          // Find a node to connect to that isn't already connected
          let targetIndex;
          let attempts = 0;
          
          do {
            targetIndex = Math.floor(Math.random() * newNodes.length);
            attempts++;
          } while ((targetIndex === i || node.connections.includes(targetIndex)) && attempts < 5);
          
          if (attempts < 5 && targetIndex !== i) {
            const targetNode = newNodes[targetIndex];
            node.connections.push(targetIndex);
            targetNode.connections.push(i);
            
            // Create path between nodes
            // For circuit effect, we create paths with right angles
            const path = createCircuitPath(node, targetNode);
            
            newPaths.push({
              from: i,
              to: targetIndex,
              path,
              active: Math.random() > 0.5,
              progress: Math.random(),
              speed: Math.random() * 0.01 + 0.002,
              color: getRandomColor()
            });
          }
        }
      });
      
      setNodes(newNodes);
      setPaths(newPaths);
    };
    
    const createCircuitPath = (from: CircuitNode, to: CircuitNode) => {
      const path = [{ x: from.x, y: from.y }];
      
      // Decide whether to go horizontal first or vertical first (90-degree angles)
      if (Math.random() > 0.5) {
        path.push({ x: to.x, y: from.y });
      } else {
        path.push({ x: from.x, y: to.y });
      }
      
      path.push({ x: to.x, y: to.y });
      return path;
    };
    
    const getRandomColor = () => {
      const colors = [
        "#00ffe0", // Cyan
        "#0078ff", // Blue
        "#b8a1ff", // Purple
        "#ffffff"  // White
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    generateCircuit();
    
    // Regenerate on window resize
    const handleResize = () => {
      generateCircuit();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Animate circuit data flow
  useEffect(() => {
    if (paths.length === 0) return;
    
    const interval = setInterval(() => {
      setPaths(currentPaths => 
        currentPaths.map(path => {
          if (!path.active) {
            // Randomly activate inactive paths
            return { ...path, active: Math.random() > 0.95 };
          }
          
          let newProgress = path.progress + path.speed;
          
          // Reset progress and deactivate some paths when complete
          if (newProgress >= 1) {
            newProgress = 0;
            const shouldDeactivate = Math.random() > 0.7;
            return { ...path, progress: newProgress, active: !shouldDeactivate };
          }
          
          return { ...path, progress: newProgress };
        })
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [paths.length]);
  
  // Function to calculate position along a path based on progress
  const getPositionAlongPath = (path: { x: number; y: number }[], progress: number) => {
    if (path.length < 2) return path[0];
    
    // For simplicity, we'll use linear interpolation between path points
    const totalSegments = path.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const segmentRemainder = segmentProgress - segmentIndex;
    
    // If we're at the last segment or beyond
    if (segmentIndex >= totalSegments) {
      return path[totalSegments];
    }
    
    const start = path[segmentIndex];
    const end = path[segmentIndex + 1];
    
    return {
      x: start.x + (end.x - start.x) * segmentRemainder,
      y: start.y + (end.y - start.y) * segmentRemainder
    };
  };
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Draw base paths */}
        {paths.map((path, idx) => (
          <path
            key={`path-${idx}`}
            d={`M${path.path.map(p => `${p.x},${p.y}`).join(' L')}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity="0.1"
          />
        ))}
        
        {/* Draw active data flows */}
        {paths.filter(p => p.active).map((path, idx) => {
          const position = getPositionAlongPath(path.path, path.progress);
          
          return (
            <g key={`flow-${idx}`}>
              <motion.circle
                cx={position.x}
                cy={position.y}
                r="2"
                fill={path.color}
                opacity="0.8"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Trailing glow effect */}
              <motion.circle
                cx={position.x}
                cy={position.y}
                r="4"
                fill={path.color}
                opacity="0.2"
                animate={{
                  r: [2, 5, 2],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node, idx) => (
          <g key={`node-${idx}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="#ffffff"
              opacity="0.3"
            />
            
            {node.pulse && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#00ffe0"
                opacity="0.5"
                animate={{
                  r: [node.size, node.size * 2, node.size],
                  opacity: [0.5, 0.1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.pulseDelay,
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CircuitParticles;
