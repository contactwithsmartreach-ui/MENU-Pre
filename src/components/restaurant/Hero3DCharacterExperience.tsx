"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, Sparkles } from "lucide-react";

interface Hero3DCharacterExperienceProps {
  onScrollToMenu: () => void;
}

export function Hero3DCharacterExperience({ onScrollToMenu }: Hero3DCharacterExperienceProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- Atmospheric Sahara Lighting ---
    const ambientLight = new THREE.AmbientLight(0xff6a00, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xf97316, 4.5, 12);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const goldUnderLight = new THREE.PointLight(0xfbbf24, 3, 8);
    goldUnderLight.position.set(0, -1, 1);
    scene.add(goldUnderLight);

    // --- Stylized High-Poly Master Chef 3D Mascot ---
    const characterGroup = new THREE.Group();

    // Materials with Sahara gold & obsidian metallic sheen
    const coatMaterial = new THREE.MeshStandardMaterial({
      color: 0x181311,
      roughness: 0.25,
      metalness: 0.35,
    });
    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.2,
    });
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xd49b78,
      roughness: 0.5,
      metalness: 0.05,
    });
    const hatMaterial = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.4,
      metalness: 0.1,
    });

    // 1. Torso / Master Chef Robe
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.62, 1.1, 32);
    const torso = new THREE.Mesh(torsoGeo, coatMaterial);
    torso.position.y = 0.55;
    torso.castShadow = true;
    characterGroup.add(torso);

    // Gold Collar & Trim
    const collarGeo = new THREE.TorusGeometry(0.46, 0.05, 16, 32);
    const collar = new THREE.Mesh(collarGeo, goldTrimMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.05;
    characterGroup.add(collar);

    // Double-breasted Gold Buttons
    for (let i = 0; i < 4; i++) {
      const btnGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const btnL = new THREE.Mesh(btnGeo, goldTrimMaterial);
      btnL.position.set(-0.14, 0.85 - i * 0.16, 0.46);
      characterGroup.add(btnL);

      const btnR = new THREE.Mesh(btnGeo, goldTrimMaterial);
      btnR.position.set(0.14, 0.85 - i * 0.16, 0.46);
      characterGroup.add(btnR);
    }

    // 2. Head Group (for mouse tracking and nodding)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.35;

    const headGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.scale.set(1, 1.1, 0.95);
    headGroup.add(head);

    // Toque Blanche (Chef Hat)
    const hatBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
    const hatBase = new THREE.Mesh(hatBaseGeo, goldTrimMaterial);
    hatBase.position.y = 0.36;
    headGroup.add(hatBase);

    const hatTopGeo = new THREE.CylinderGeometry(0.55, 0.32, 0.55, 32);
    const hatTop = new THREE.Mesh(hatTopGeo, hatMaterial);
    hatTop.position.y = 0.65;
    headGroup.add(hatTop);

    // Hat Crown Pleats
    const hatPuffGeo = new THREE.SphereGeometry(0.56, 32, 16);
    const hatPuff = new THREE.Mesh(hatPuffGeo, hatMaterial);
    hatPuff.position.y = 0.92;
    hatPuff.scale.set(1, 0.45, 1);
    headGroup.add(hatPuff);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 0.05, 0.34);
    headGroup.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 0.05, 0.34);
    headGroup.add(eyeR);

    characterGroup.add(headGroup);

    // 3. Hands & Magic Culinary Sphere (Floating Glowing Plate of Fire)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.55, 0.85, 0);

    const armGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.65, 16);
    const leftArm = new THREE.Mesh(armGeo, coatMaterial);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.position.set(-0.2, -0.2, 0.15);
    leftArmGroup.add(leftArm);

    const handGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const leftHand = new THREE.Mesh(handGeo, skinMaterial);
    leftHand.position.set(-0.42, -0.4, 0.3);
    leftArmGroup.add(leftHand);
    characterGroup.add(leftArmGroup);

    // Right Arm presenting the magic culinary flame
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.55, 0.85, 0);

    const rightArm = new THREE.Mesh(armGeo, coatMaterial);
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.position.set(0.2, -0.2, 0.15);
    rightArmGroup.add(rightArm);

    const rightHand = new THREE.Mesh(handGeo, skinMaterial);
    rightHand.position.set(0.42, -0.4, 0.3);
    rightArmGroup.add(rightHand);
    characterGroup.add(rightArmGroup);

    // 4. Floating Sahara Cloche / Golden Orb in Front
    const orbGroup = new THREE.Group();
    orbGroup.position.set(0, 0.5, 0.85);

    const orbPlateGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 32);
    const orbPlate = new THREE.Mesh(orbPlateGeo, goldTrimMaterial);
    orbGroup.add(orbPlate);

    const clocheGeo = new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const clocheMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xb45309,
      emissiveIntensity: 0.4,
    });
    const cloche = new THREE.Mesh(clocheGeo, clocheMat);
    cloche.position.y = 0.02;
    orbGroup.add(cloche);

    const clocheHandleGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const clocheHandle = new THREE.Mesh(clocheHandleGeo, goldTrimMaterial);
    clocheHandle.position.y = 0.4;
    orbGroup.add(clocheHandle);

    characterGroup.add(orbGroup);

    // 5. Golden Base Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.25, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x120c0a,
      metalness: 0.5,
      roughness: 0.4,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.12;
    pedestal.receiveShadow = true;
    characterGroup.add(pedestal);

    const pedestalRingGeo = new THREE.TorusGeometry(1.22, 0.03, 16, 48);
    const pedestalRing = new THREE.Mesh(pedestalRingGeo, goldTrimMaterial);
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.y = 0.01;
    characterGroup.add(pedestalRing);

    scene.add(characterGroup);

    // --- Sahara Floating Embers & Particle Galaxy ---
    const particlesCount = 90;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleScales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = Math.random() * 4 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      particleScales[i] = Math.random();
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Interactive Mouse Tracking & Scroll Listeners ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleScroll = () => {
      const scrollMax = Math.max(window.innerHeight * 0.8, 1);
      scrollProgress = Math.min(window.scrollY / scrollMax, 1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      // Subtle Breathing Idle Motion
      const breath = Math.sin(elapsedTime * 2.2) * 0.03;
      torso.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);

      // Cloche Levitation & Spin
      orbGroup.position.y = 0.5 + Math.sin(elapsedTime * 3) * 0.05;
      orbGroup.rotation.y = elapsedTime * 1.2;

      // Head looks towards pointer
      headGroup.rotation.y = targetX * 0.45;
      headGroup.rotation.x = -targetY * 0.3 + breath * 0.2;

      // Arms slight gentle gesture
      leftArmGroup.rotation.z = Math.sin(elapsedTime * 2) * 0.08;
      rightArmGroup.rotation.z = -Math.sin(elapsedTime * 2) * 0.08;

      // Scroll-driven dynamic 3D transformation
      characterGroup.rotation.y = targetX * 0.2 + scrollProgress * Math.PI * 0.6;
      characterGroup.position.y = -scrollProgress * 0.6 + breath * 0.1;
      camera.position.z = 5 - scrollProgress * 1.2;
      camera.position.y = 1.2 + scrollProgress * 0.4;

      // Rising Sahara Embers
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -0.5;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-8 pb-8 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Sahara Title & Badge */}
      <div className="relative z-20 max-w-2xl space-y-2 mt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/80 border border-orange-500/30 backdrop-blur-md text-amber-300 text-xs font-serif tracking-widest uppercase shadow-lg shadow-orange-500/10">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
          <span>Interactive 3D Culinary Experience</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-[0.16em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_12px_35px_rgba(249,115,22,0.4)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* 3D Master Chef Mascot WebGL Stage */}
      <div className="relative z-10 w-full max-w-2xl h-[360px] sm:h-[460px] md:h-[500px] flex items-center justify-center -my-4 sm:-my-6">
        {/* Soft Ambient Pedestal Core Glow */}
        <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-red-600/30 via-orange-500/25 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Canvas Container */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        />
      </div>

      {/* Sahara CTA Button with Reflection & Scroll Cue */}
      <div className="relative z-30 flex flex-col items-center gap-4">
        <div
          className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
          style={{
            WebkitBoxReflect:
              "below 8px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.45) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE MENU"
            hoverText="TASTE THE SAHARA"
            size="lg"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/80 hover:text-white transition-colors mt-2 animate-bounce cursor-pointer"
        >
          <span>Scroll down to enter theater</span>
          <ChevronDown className="w-4 h-4 text-orange-400" />
        </button>
      </div>
    </section>
  );
}