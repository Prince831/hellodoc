import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Lightformer, Torus } from "@react-three/drei";
import type { Mesh, Group, Points } from "three";

/** Two-phase cardiac waveform (systole + weaker diastole) in the 0..1 range. */
const heartbeat = (t: number) => {
  const cycle = (t % 1) / 1;
  const spike = Math.exp(-Math.pow((cycle - 0.12) / 0.05, 2));
  const echo = 0.45 * Math.exp(-Math.pow((cycle - 0.32) / 0.07, 2));
  return spike + echo;
};

const PulseCore = () => {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const beat = 1 + heartbeat(t * 1.2) * 0.09;
    mesh.current.scale.setScalar(beat);
    mesh.current.rotation.y = t * 0.25;
    const mat = mesh.current.material as { emissiveIntensity?: number };
    if (mat) mat.emissiveIntensity = 0.2 + heartbeat(t * 1.2) * 0.9;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.25, 12]} />
      <MeshDistortMaterial
        color="#4C9BFF"
        emissive="#3BD6A0"
        emissiveIntensity={0.25}
        roughness={0.12}
        metalness={0.55}
        clearcoat={1}
        clearcoatRoughness={0.1}
        distort={0.32}
        speed={1.6}
      />
    </mesh>
  );
};

const VitalsMotes = () => {
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

  useFrame(({ clock }) => {
    if (!pts.current) return;
    const t = clock.getElapsedTime();
    pts.current.rotation.y = t * 0.05;
    pts.current.scale.setScalar(1 + heartbeat(t * 1.2) * 0.03);
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8ED9FF" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};


const OrbitRings = () => {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.18;
    group.current.rotation.x = Math.sin(t * 0.3) * 0.25;
  });

  return (
    <group ref={group}>
      <Torus args={[2.1, 0.025, 16, 128]} rotation={[Math.PI / 2.6, 0, 0]}>
        <meshStandardMaterial color="#3BD6A0" emissive="#3BD6A0" emissiveIntensity={0.6} roughness={0.3} />
      </Torus>
      <Torus args={[2.6, 0.018, 16, 128]} rotation={[Math.PI / 1.9, 0.4, 0]}>
        <meshStandardMaterial color="#4C9BFF" emissive="#4C9BFF" emissiveIntensity={0.5} roughness={0.3} />
      </Torus>
    </group>
  );
};

const Capsules = () => {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = -clock.getElapsedTime() * 0.35;
  });

  const items = [0, 1, 2, 3];
  return (
    <group ref={group}>
      {items.map((i) => {
        const angle = (i / items.length) * Math.PI * 2;
        return (
          <Float key={i} speed={2} rotationIntensity={1.2} floatIntensity={1.1}>
            <mesh position={[Math.cos(angle) * 2.4, Math.sin(angle) * 0.9, Math.sin(angle) * 1.4]}>
              <capsuleGeometry args={[0.12, 0.32, 8, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#8ED9FF" : "#7DF3C6"}
                roughness={0.15}
                metalness={0.4}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

interface HeroSceneProps {
  className?: string;
}

const HeroScene = ({ className }: HeroSceneProps) => {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 4]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-4, -2, 3]} intensity={2.2} color="#3BD6A0" />
          <pointLight position={[3, 3, -4]} intensity={1.8} color="#4C9BFF" />
          <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
            <PulseCore />
          </Float>
          <OrbitRings />
          <Capsules />
          <VitalsMotes />
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
