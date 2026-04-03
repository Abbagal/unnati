'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '@/components/Scene3D';

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/roadmaps')
      .then(res => res.json())
      .then(data => setRoadmaps(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="absolute top-20 right-0 w-1/4 h-1/4 opacity-10">
        <Scene3D />
      </div>
      
      <div className="container mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-cyan-400 mb-8"
        >
          Career Roadmaps
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {['Frontend', 'Backend', 'DevOps', 'Data Science'].map((track, index) => (
            <motion.div
              key={track}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/30"
            >
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">{track} Engineer</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center">
                      <span className="text-purple-400 text-sm">{step}</span>
                    </div>
                    <span className="text-gray-300">Step {step} - Learning Phase</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}