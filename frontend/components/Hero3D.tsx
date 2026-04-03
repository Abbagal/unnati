'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';

function FloatingText() {
  const textRef = useRef();
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        ref={textRef}
        fontSize={1.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        CAREER GUIDE
      </Text>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-64">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#00ffff" />
        <FloatingText />
      </Canvas>
    </div>
  );
}