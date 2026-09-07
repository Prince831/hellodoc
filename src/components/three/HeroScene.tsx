import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";
import heartImage from "@/assets/anatomical-heart.png";

/** Two-phase cardiac waveform (systole + weaker diastole) in the 0..1 range. */
const heartbeat = (t: number) => {
  const cycle = t % 1;
  const spike = Math.exp(-Math.pow((cycle - 0.12) / 0.05, 2));
  const echo = 0.45 * Math.exp(-Math.pow((cycle - 0.32) / 0.07, 2));
  return spike + echo;
};

/** Shared beat clock so the heart and the particle field stay in phase. */
const beatAt = (elapsed: number, bpm: number) => heartbeat((elapsed * bpm) / 60);

const AnatomicalHeart = ({ bpm }: { bpm: number }) => {
  const group = useRef<Group>(null);
  const glow = useRef<Mesh>(null);
  const texture = useTexture(heartImage);

  // Correct colour space + filtering so the render matches the source artwork.
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const beat = beatAt(t, bpm);
    const scale = 1 + beat * 0.06;
    group.current.scale.set(scale, scale * (1 + beat * 0.02), scale);
    group.current.position.y = Math.sin(t * 0.62) * 0.045 - beat * 0.03;
    group.current.rotation.y = Math.sin(t * 0.28) * 0.05;
    group.current.rotation.z = Math.sin(t * 0.24) * 0.02;

    if (glow.current) {
      const mat = glow.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + beat * 0.14;
      const g = 1 + beat * 0.12;
      glow.current.scale.set(g, g, 1);
    }
  });

  return (
    <group ref={group} rotation={[0.015, -0.06, -0.035]}>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.04}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={glow} position={[0, -0.05, -0.12]} scale={[0.92, 1.08, 1]}>
        <circleGeometry args={[1.75, 64]} />
        <meshBasicMaterial color="#ef5c59" transparent opacity={0.09} depthWrite={false} />
      </mesh>
    </group>
  );
};

/** Particle field whose pulse, drift and colour follow the patient's vitals. */
const VitalsMotes = ({ bpm, oxygen }: { bpm: number; oxygen: number | null }) => {
  const pts = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 2.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  // Well-oxygenated blood reads brighter/cooler; low saturation shifts warm.
  const color = useMemo(() => {
    const sat = oxygen ?? 98;
    const健 = Math.min(1, Math.max(0, (sat - 88) / 10));
    return new THREE.Color().setHSL(0.02 + 0.53 * 健, 0.85, 0.62);
  }, [oxygen]);

  useFrame(({ clock }) => {
    if (!pts.current) return;
    const t = clock.getElapsedTime();
    const beat = beatAt(t, bpm);
    pts.current.rotation.y = t * (0.03 + (bpm / 72) * 0.03);
    pts.current.scale.setScalar(1 + beat * 0.05);
    const mat = pts.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + beat * 0.35;
    mat.size = 0.028 + beat * 0.012;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

interface HeroSceneProps {
  className?: string;
  /** Beats per minute driving the animation (defaults to a resting rate). */
  bpm?: number;
  /** Blood oxygen saturation, used to tint the particle field. */
  oxygen?: number | null;
}

const HeroScene = ({ className, bpm = 72, oxygen = null }: HeroSceneProps) => {
  const rate = Math.min(180, Math.max(40, bpm));

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 4]} intensity={1.6} color="#ffffff" />
          <pointLight position={[-4, -2, 3]} intensity={2.4} color="#3BD6A0" />
          <pointLight position={[3, 3, -4]} intensity={1.9} color="#4C9BFF" />
          <AnatomicalHeart bpm={rate} />
          <VitalsMotes bpm={rate} oxygen={oxygen} />
          <Environment>
            <Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.2} color="#3BD6A0" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
            <Lightformer intensity={1} color="#4C9BFF" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
