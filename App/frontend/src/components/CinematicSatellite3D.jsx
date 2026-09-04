import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ───────────────────────────────────────────────
   Procedural Tactical Earth Globe
   ─────────────────────────────────────────────── */
function EarthGlobe() {
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* Base Earth — slightly translucent dark sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.6}
          metalness={0.3}
          emissive="#0a1520"
          emissiveIntensity={0.4}
          transparent
          opacity={0.92}
        />

        {/* Tactical Wireframe Grid */}
        <mesh>
          <sphereGeometry args={[1.81, 24, 24]} />
          <meshBasicMaterial
            color="#2D7A4F"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Hazard Hotspot — Uttarakhand Red Zone */}
        <group position={[0.55, 1.1, 1.05]}>
          <mesh>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshBasicMaterial color="#B85C38" />
          </mesh>
          <mesh>
            <ringGeometry args={[0.1, 0.15, 32]} />
            <meshBasicMaterial color="#B85C38" side={THREE.DoubleSide} transparent opacity={0.55} />
          </mesh>
        </group>

        {/* Secondary Marker */}
        <group position={[0.3, 1.3, 1.0]}>
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#D4AF37" />
          </mesh>
        </group>
      </mesh>

      {/* Soft Atmosphere Rim */}
      <mesh>
        <sphereGeometry args={[1.92, 48, 48]} />
        <meshBasicMaterial
          color="#8B7355"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbit Ring — SAR Scan Path */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.6, 0.012, 16, 100]} />
        <meshBasicMaterial color="#8B7355" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Procedural ISRO SAR Satellite
   ─────────────────────────────────────────────── */
function SatelliteModel() {
  const groupRef = useRef();
  const dishRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = 1.0 + Math.sin(t * 1.5) * 0.06;
      groupRef.current.rotation.y = -0.5 + Math.sin(t * 0.4) * 0.15;
      groupRef.current.rotation.z = Math.cos(t * 0.8) * 0.03;
    }
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[1.4, 1.0, 1.2]} scale={[0.35, 0.35, 0.35]}>
      {/* Central Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 1.4, 1]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.85}
          roughness={0.25}
          emissive="#8B7355"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* SAR Radar Dish */}
      <group ref={dishRef} position={[0, -0.9, 0.2]} rotation={[0.4, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.1, 0.2, 32]} />
          <meshStandardMaterial color="#2C2A29" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.08, 0.5, 16]} />
          <meshBasicMaterial color="#B85C38" />
        </mesh>
      </group>

      {/* Solar Panel Left */}
      <group position={[-1.7, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 0.8, 0.06]} />
          <meshStandardMaterial
            color="#1d3557"
            metalness={0.6}
            roughness={0.2}
            emissive="#0077b6"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[1.15, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} />
        </mesh>
      </group>

      {/* Solar Panel Right */}
      <group position={[1.7, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 0.8, 0.06]} />
          <meshStandardMaterial
            color="#1d3557"
            metalness={0.6}
            roughness={0.2}
            emissive="#0077b6"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[-1.15, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} />
        </mesh>
      </group>

      {/* Antenna Mast */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#e5e5e5" metalness={0.9} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Scanning Beam (pulsing cone)
   ─────────────────────────────────────────────── */
function ScanningBeam() {
  const beamRef = useRef();

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.12 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05;
    }
  });

  return (
    <group position={[0.3, 0.2, 1.0]} rotation={[-0.4, 0.2, 0.2]}>
      <mesh ref={beamRef}>
        <coneGeometry args={[0.9, 2.2, 32, 1, true]} />
        <meshBasicMaterial
          color="#B85C38"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ───────────────────────────────────────────────
   Exported Widget — Transparent Background
   Satellite & Globe floating on the page
   ─────────────────────────────────────────────── */
export default function CinematicSatellite3D() {
  return (
    <div className="relative w-full h-full min-h-[420px] select-none">
      {/* Fully transparent WebGL Canvas — no background */}
      <Canvas
        camera={{ position: [0, 0.5, 4.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        className="cursor-grab active:cursor-grabbing"
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 3]} intensity={2.2} color="#fff8e7" />
        <pointLight position={[-3, -2, -2]} intensity={0.5} color="#8B7355" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
          <EarthGlobe />
          <SatelliteModel />
          <ScanningBeam />
        </Float>
      </Canvas>
    </div>
  );
}
