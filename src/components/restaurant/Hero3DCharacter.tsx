"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface CharacterMeshProps {
  isHovered: boolean;
  isClicked: boolean;
}

function CharacterMesh({ isHovered, isClicked }: CharacterMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const clickSpinRef = useRef(0);

  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (isClicked) {
      clickSpinRef.current = Math.PI * 2;
    }
  }, [isClicked]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (clickSpinRef.current > 0) {
      clickSpinRef.current = THREE.MathUtils.damp(clickSpinRef.current, 0, 8, delta);
    }

    if (groupRef.current) {
      const targetBodyRotY =
        mousePos.current.x * 0.45 + (clickSpinRef.current > 0 ? clickSpinRef.current * 4 : 0);
      const targetBodyRotX = -mousePos.current.y * 0.25;

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetBodyRotY,
        5,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetBodyRotX,
        5,
        delta
      );
    }

    if (headRef.current) {
      const targetHeadRotY = mousePos.current.x * 0.65;
      const targetHeadRotX = -mousePos.current.y * 0.45;
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        targetHeadRotY,
        8,
        delta
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        targetHeadRotX,
        8,
        delta
      );
    }

    if (rightArmRef.current) {
      const waveSpeed = isHovered ? 12 : 3;
      const waveAmp = isHovered ? 0.6 : 0.15;
      rightArmRef.current.rotation.z = -0.3 + Math.sin(t * waveSpeed) * waveAmp;
      rightArmRef.current.rotation.x = isHovered ? Math.cos(t * waveSpeed) * 0.3 : 0;
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.3 - Math.sin(t * 3) * 0.12;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
      ringRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Dynamic Floating Glow Rings */}
      <mesh ref={ringRef} position={[0, -0.1, 0]}>
        <torusGeometry args={[1.55, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ff5500"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* BODY TORSO */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <capsuleGeometry args={[0.55, 0.7, 16, 32]} />
        <meshPhysicalMaterial
          color="#1a0c0a"
          roughness={0.25}
          metalness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#ef4444"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* CHEF APRON SASH ACCENT */}
      <mesh position={[0, -0.4, 0.42]}>
        <boxGeometry args={[0.65, 0.6, 0.2]} />
        <meshStandardMaterial
          color="#f97316"
          roughness={0.3}
          metalness={0.2}
          emissive="#ea580c"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* GOLD EMBLEM BUTTONS */}
      <mesh position={[0, -0.25, 0.54]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.45, 0.54]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* HEAD GROUP */}
      <group ref={headRef} position={[0, 0.6, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.58, 32, 32]} />
          <meshPhysicalMaterial
            color="#26100c"
            roughness={0.35}
            metalness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* CHEF TOQUE */}
        <group position={[0, 0.55, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.38, 0.2, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.46, 32, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Gold Toque Ribbon */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.39, 0.39, 0.06, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.8}
              metalness={0.8}
            />
          </mesh>
        </group>

        {/* EYES */}
        <mesh position={[-0.2, 0.08, 0.48]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-0.2, 0.08, 0.58]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        <mesh position={[0.2, 0.08, 0.48]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0.2, 0.08, 0.58]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* CHEEKS */}
        <mesh position={[-0.32, -0.08, 0.42]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.32, -0.08, 0.42]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.65} />
        </mesh>

        {/* SMILE */}
        <mesh position={[0, -0.12, 0.52]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.12, 0.025, 16, 32, Math.PI * 0.8]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
      </group>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.65, -0.2, 0]}>
        <mesh position={[-0.15, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.45, 16, 16]} />
          <meshStandardMaterial color="#26100c" roughness={0.3} />
        </mesh>
        <mesh position={[-0.15, -0.55, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.65, -0.2, 0]}>
        <mesh position={[0.15, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.45, 16, 16]} />
          <meshStandardMaterial color="#26100c" roughness={0.3} />
        </mesh>
        <mesh position={[0.15, -0.55, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Culinary Wand */}
        <mesh position={[0.22, -0.42, 0.15]} rotation={[0.4, 0, -0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.3, -0.15, 0.25]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff3300"
            emissiveIntensity={3}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* BASE */}
      <mesh position={[-0.26, -1.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#1a0c0a" roughness={0.4} />
      </mesh>
      <mesh position={[0.26, -1.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#1a0c0a" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Hero3DCharacter() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative w-full h-[320px] sm:h-[400px] md:h-[440px] flex items-center justify-center cursor-pointer select-none"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.2}
          color="#ffaa44"
          castShadow
        />
        <pointLight position={[-4, 2, -2]} intensity={2.5} color="#ef4444" />
        <pointLight position={[0, -2, 2]} intensity={1.8} color="#fbbf24" />
        <spotLight
          position={[0, 5, 3]}
          angle={0.6}
          penumbra={0.8}
          intensity={2.8}
          color="#fff0d0"
        />

        <Float
          speed={isHovered ? 4.5 : 2.2}
          rotationIntensity={isHovered ? 0.4 : 0.2}
          floatIntensity={isHovered ? 1.2 : 0.8}
        >
          <CharacterMesh isHovered={isHovered} isClicked={isClicked} />
        </Float>

        <Sparkles
          count={40}
          scale={4.2}
          size={3.5}
          speed={0.6}
          color="#fbbf24"
          opacity={0.8}
        />
        <Sparkles
          count={25}
          scale={3.5}
          size={4}
          speed={0.8}
          color="#ff4400"
          opacity={0.7}
        />
      </Canvas>

      <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300">
        <span className="text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/80 bg-neutral-950/80 border border-orange-500/30 px-3 py-1 rounded-full backdrop-blur-md shadow-lg shadow-orange-500/10">
          ✨ {isHovered ? "Click to trigger spin!" : "Move mouse to interact"}
        </span>
      </div>
    </div>
  );
}