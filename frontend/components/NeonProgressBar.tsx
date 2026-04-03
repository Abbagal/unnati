'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NeonProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showPercentage?: boolean;
  animated?: boolean;
}

export default function NeonProgressBar({ 
  value, 
  max = 100, 
  label, 
  color = 'cyan',
  showPercentage = true,
  animated = true
}: NeonProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const colorClasses = {
    cyan: {
      bg: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/50',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    purple: {
      bg: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50',
      text: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    pink: {
      bg: 'from-pink-500 to-red-500',
      glow: 'shadow-pink-500/50',
      text: 'text-pink-400',
      border: 'border-pink-500/30'
    },
    green: {
      bg: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50',
      text: 'text-green-400',
      border: 'border-green-500/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-medium">{label}</span>
          {showPercentage && (
            <span className={`font-bold ${colors.text}`}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`relative w-full h-3 bg-gray-800 rounded-full border ${colors.border} overflow-hidden`}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        
        {/* Progress bar */}
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.bg} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0,
            ease: "easeOut"
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          
          {/* Moving highlight */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3"
            animate={{ x: ['-100%', '300%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Neon glow effect */}
        <div className={`absolute inset-0 rounded-full shadow-lg ${colors.glow} opacity-50`} />
      </div>
      
      {/* Particle effects for high values */}
      {displayValue > 80 && (
        <div className="relative">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${colors.bg} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px'
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}