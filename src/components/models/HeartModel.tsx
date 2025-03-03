import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

// Heart model component
const Heart = ({ heartRate = 75 }) => {
  const group = useRef<THREE.Group>(null);
  const heartMaterial = useRef<THREE.MeshStandardMaterial>(null);
  
  // Calculate pulse frequency based on heart rate (beats per minute)
  const pulseFrequency = heartRate / 60;
  
  // Use a simple heart model
  useFrame((state) => {
    if (group.current) {
      // Pulse effect - scale based on heart rate
      const scale = 1 + Math.sin(state.clock.elapsedTime * Math.PI * 2 * pulseFrequency) * 0.05;
      group.current.scale.set(scale, scale, scale);
      
      // Rotate slowly
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    // Pulse color effect for the heart
    if (heartMaterial.current) {
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * Math.PI * 2 * pulseFrequency) * 0.2;
      heartMaterial.current.emissiveIntensity = intensity;
    }
  });

  // Create a simple heart model with labeled parts
  return (
    <group ref={group}>
      {/* Left Ventricle */}
      <mesh position={[0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          ref={heartMaterial}
          color="#ff4560" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#ff0000"
          emissiveIntensity={0.8}
        />
        <Text
          position={[1, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="left"
        >
          LV
        </Text>
      </mesh>
      
      {/* Right Ventricle */}
      <mesh position={[-0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color="#cc0000" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#cc0000"
          emissiveIntensity={0.8}
        />
        <Text
          position={[-1, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="right"
        >
          RV
        </Text>
      </mesh>
      
      {/* Left Atrium */}
      <mesh position={[0.3, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#4287f5" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#0000ff"
          emissiveIntensity={0.5}
        />
        <Text
          position={[0.3, 1.4, 0]}
          fontSize={0.15}
          color="white"
        >
          LA
        </Text>
      </mesh>
      
      {/* Right Atrium */}
      <mesh position={[-0.3, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color="#1a56cc" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#0000cc"
          emissiveIntensity={0.5}
        />
        <Text
          position={[-0.3, 1.4, 0]}
          fontSize={0.15}
          color="white"
        >
          RA
        </Text>
      </mesh>
      
      {/* Aorta */}
      <mesh position={[0, 1.2, -0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
        <meshStandardMaterial 
          color="#ff6b6b" 
          roughness={0.3} 
          metalness={0.2}
        />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="white"
          rotation={[-Math.PI / 4, 0, 0]}
        >
          Aorta
        </Text>
      </mesh>
    </group>
  );
};

// Main component that sets up the 3D scene
const HeartModel = ({ heartRate = 75 }) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Heart heartRate={heartRate} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
      />
    </Canvas>
  );
};

export default HeartModel;