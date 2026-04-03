'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Line, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface RoadmapData {
  month1: any;
  month2: any;
  month3: any;
}

interface AnimatedRoadmapTimelineProps {
  roadmapData: RoadmapData;
}

function FloatingMilestone({ position, data, index, isActive, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
    }
  });

  const colors = ['#00ffff', '#9333ea', '#ec4899'];
  const color = colors[index % colors.length];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <group position={position} onClick={onClick}>
        <Sphere ref={meshRef} args={[0.5]} scale={isActive ? 1.5 : 1}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={isActive ? 0.5 : 0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
        
        <Text
          position={[2, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={4}
        >
          {data.title}
        </Text>
        
        <Text
          position={[2, -0.5, 0]}
          fontSize={0.15}
          color="#cccccc"
          anchorX="left"
          anchorY="middle"
          maxWidth={4}
        >
          {data.focus}
        </Text>

        {/* Connecting particles */}
        {[...Array(5)].map((_, i) => (
          <Sphere key={i} args={[0.02]} position={[Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 2 - 1]}>
            <meshBasicMaterial color={color} />
          </Sphere>
        ))}
      </group>
    </Float>
  );
}

function Timeline3D({ roadmapData, activeMonth, setActiveMonth }: any) {
  const months = [roadmapData.month1, roadmapData.month2, roadmapData.month3];
  
  const linePoints = months.map((_, index) => 
    new THREE.Vector3(0, index * -3, 0)
  );

  return (
    <>
      {/* Animated timeline line */}
      <Line
        points={linePoints}
        color="#00ffff"
        lineWidth={5}
        transparent
        opacity={0.8}
      />
      
      {/* Milestone spheres */}
      {months.map((month, index) => (
        <FloatingMilestone
          key={index}
          position={[0, index * -3, 0]}
          data={month}
          index={index}
          isActive={activeMonth === index}
          onClick={() => setActiveMonth(index)}
        />
      ))}
      
      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2}>
          <Sphere 
            args={[0.01]} 
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5
            ]}
          >
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

export default function AnimatedRoadmapTimeline({ roadmapData }: AnimatedRoadmapTimelineProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const months = [roadmapData.month1, roadmapData.month2, roadmapData.month3];
  const currentMonth = months[activeMonth];

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Timeline */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [8, 2, 8], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
          <spotLight position={[0, 10, 0]} color="#ffffff" intensity={0.5} />
          
          <Timeline3D 
            roadmapData={roadmapData} 
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            🚀 AI Career Roadmap Timeline
          </motion.h1>
          <p className="text-gray-400 mt-2">Interactive 3D visualization of your career journey</p>
        </div>

        {/* Month Navigation */}
        <div className="absolute top-6 right-6 pointer-events-auto">
          <div className="flex space-x-2">
            {months.map((month, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveMonth(index)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeMonth === index
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Month {index + 1}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Month Details Panel */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-2">{currentMonth.title}</h2>
                  <p className="text-gray-300 mb-4">{currentMonth.focus}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">🎯 Goals</h3>
                    <ul className="space-y-1">
                      {currentMonth.goals.map((goal: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-gray-300 text-sm flex items-center"
                        >
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                          {goal}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-2">🚀 Projects</h3>
                      <ul className="space-y-1">
                        {currentMonth.projects.map((project: string, index: number) => (
                          <li key={index} className="text-gray-300 text-sm">• {project}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400 mb-2">📚 Courses</h3>
                      <ul className="space-y-1">
                        {currentMonth.courses.map((course: string, index: number) => (
                          <li key={index} className="text-gray-300 text-sm">• {course}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Progress & Stats */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-400 mb-2">⏰ Time Allocation</h3>
                    <p className="text-2xl font-bold text-white">{currentMonth.timeAllocation}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">📈 Progress</h3>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeMonth + 1) / 3) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-gray-300 text-sm mt-2">
                      Month {activeMonth + 1} of 3 ({Math.round(((activeMonth + 1) / 3) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <div className="bg-gray-800/50 backdrop-blur-xl p-3 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs mb-2">Controls:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <div>🖱️ Click spheres to navigate</div>
              <div>🎯 Hover for interactions</div>
              <div>⚡ Real-time 3D timeline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}