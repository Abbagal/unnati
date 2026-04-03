'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SkillData {
  skill: string;
  current: number;
  required: number;
  market: number;
}

interface SkillRadarChartProps {
  skills: SkillData[];
  title?: string;
}

export default function SkillRadarChart({ skills, title = "Skill Analysis" }: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    drawGrid(ctx, centerX, centerY, radius);
    
    // Draw skill areas
    drawSkillArea(ctx, centerX, centerY, radius, skills, 'current', '#00ffff', 0.3);
    drawSkillArea(ctx, centerX, centerY, radius, skills, 'required', '#9333ea', 0.2);
    drawSkillArea(ctx, centerX, centerY, radius, skills, 'market', '#ec4899', 0.2);
    
    // Draw skill labels
    drawSkillLabels(ctx, centerX, centerY, radius, skills);
    
    // Draw legend
    drawLegend(ctx);
  }, [skills]);

  const drawGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw radial lines
    const angleStep = (2 * Math.PI) / skills.length;
    for (let i = 0; i < skills.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    }
  };

  const drawSkillArea = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    skills: SkillData[],
    type: 'current' | 'required' | 'market',
    color: string,
    alpha: number
  ) => {
    if (skills.length === 0) return;

    ctx.beginPath();
    const angleStep = (2 * Math.PI) / skills.length;

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = skill[type] / 10; // Normalize to 0-1
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = skill[type] / 10;
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  };

  const drawSkillLabels = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    skills: SkillData[]
  ) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    const angleStep = (2 * Math.PI) / skills.length;
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(skill.skill, x, y);
    });
  };

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    const legends = [
      { color: '#00ffff', label: 'Current Level' },
      { color: '#9333ea', label: 'Required Level' },
      { color: '#ec4899', label: 'Market Demand' }
    ];

    legends.forEach((legend, index) => {
      const y = 30 + index * 25;
      
      // Draw color box
      ctx.fillStyle = legend.color;
      ctx.fillRect(20, y - 8, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(legend.label, 45, y + 4);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
    >
      <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">{title}</h3>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-auto max-w-md mx-auto"
        />
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full animate-pulse" />
      </div>

      {/* Skill breakdown */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.skill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 p-3 rounded-lg"
          >
            <h4 className="font-semibold text-white mb-2">{skill.skill}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-400">Current</span>
                <span className="text-white">{skill.current}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.current / 10) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-purple-400">Required</span>
                <span className="text-white">{skill.required}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.required / 10) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}