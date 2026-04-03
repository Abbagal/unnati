'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  completed: boolean;
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
}

function TimelineNode({ position, milestone, index }: { position: [number, number, number], milestone: Milestone, index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  const color = milestone.completed ? '#00ff00' : milestone.category === 'Technical Skills' ? '#00ffff' : '#ff00ff';

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3]} scale={milestone.completed ? 1.2 : 1}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Sphere>
      
      <Text
        position={[1, 0, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        maxWidth={3}
      >
        {milestone.title}
      </Text>
      
      <Text
        position={[1, -0.3, 0]}
        fontSize={0.12}
        color="#cccccc"
        anchorX="left"
        anchorY="middle"
        maxWidth={3}
      >
        {milestone.category}
      </Text>
    </group>
  );
}

function Timeline3D({ milestones }: { milestones: Milestone[] }) {
  const linePoints = milestones.map((_, index) => 
    new THREE.Vector3(0, index * -2, 0)
  );

  return (
    <>
      {/* Timeline line */}
      <Line
        points={linePoints}
        color="#00ffff"
        lineWidth={3}
        transparent
        opacity={0.6}
      />
      
      {/* Milestone nodes */}
      {milestones.map((milestone, index) => (
        <TimelineNode
          key={milestone.id}
          position={[0, index * -2, 0]}
          milestone={milestone}
          index={index}
        />
      ))}
    </>
  );
}

export default function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  return (
    <div className="w-full h-96 bg-gray-900/50 rounded-xl border border-cyan-500/30 overflow-hidden">
      <Canvas camera={{ position: [5, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
        
        <Timeline3D milestones={milestones} />
      </Canvas>
      
      {/* 2D Overlay with milestone details */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Interactive 3D Timeline</h3>
          <p className="text-gray-400 text-sm">Hover and scroll to explore your roadmap</p>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-gray-800/80 backdrop-blur-xl p-3 rounded-lg">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-300">Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-gray-300">Technical</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-gray-300">Other</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}