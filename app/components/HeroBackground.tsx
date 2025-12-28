'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  Float, 
  Stars, 
  PerspectiveCamera, 
  Sparkles, 
  Environment,
  Text,
  ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const ICON_URLS = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
];

function FloatingIcon({ url, position, speed, rotationSpeed, factor }: { 
  url: string; 
  position: [number, number, number]; 
  speed: number; 
  rotationSpeed: number;
  factor: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, url);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.y += 0.005 * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(t * 0.5 * speed) * 0.2;
      meshRef.current.position.y = position[1] + Math.cos(t * speed) * 0.5;
    }
  });

  return (
    <group>
      <Float speed={speed} rotationIntensity={2} floatIntensity={1.5}>
        <mesh ref={meshRef} position={position}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            side={THREE.DoubleSide}
            opacity={0.9}
          />
        </mesh>
      </Float>
      <Sparkles 
        position={position} 
        count={20} 
        scale={3} 
        size={2} 
        speed={0.4} 
        opacity={0.5} 
        color="#3b82f6" 
      />
    </group>
  );
}

function Rig() {
  return useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.mouse.x * 3), 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.mouse.y * 3 + 5), 0.03);
    state.camera.lookAt(0, 4, 0);
  });
}

export default function HeroBackground() {
  const icons = useMemo(() => {
    return ICON_URLS.map((url, i) => {
      const angle = (i / ICON_URLS.length) * Math.PI * 2;
      const radius = 12 + Math.random() * 4;
      return {
        url,
        position: [
          Math.cos(angle) * radius,
          6 + (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        speed: 0.8 + Math.random() * 0.5,
        rotationSpeed: 0.5 + Math.random(),
        factor: Math.random(),
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0e27] via-[#0f172a] to-[#020617]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 18]} fov={50} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, 5, 5]} intensity={0.5} color="#06b6d4" />
        
        <Stars radius={150} depth={50} count={7000} factor={6} saturation={0.5} fade speed={1.5} />
        
        <group position={[0, -2, 0]}>
          {icons.map((icon, i) => (
            <FloatingIcon key={i} {...icon} />
          ))}
        </group>

        <Sparkles count={100} scale={30} size={1} speed={0.2} opacity={0.2} />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        </EffectComposer>
        
        <Rig />
      </Canvas>
    </div>
  );
}
