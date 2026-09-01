import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Html } from "@react-three/drei";
import type { Group, Mesh } from "three";

export interface BodyRegion {
  id: string;
  label: string;
  /** Symptom hints pre-filled when the region is picked */
  symptoms: string[];
  specialization: string;
  position: [number, number, number];
  /** radius, height for the capsule */
  args: [number, number];
  rotation?: [number, number, number];
}

export const BODY_REGIONS: BodyRegion[] = [
  {
    id: "head",
    label: "Head & Neck",
    symptoms: ["headache", "dizziness", "blurred vision"],
    specialization: "Neurology",
    position: [0, 1.62, 0],
    args: [0.26, 0.12],
  },
  {
    id: "chest",
    label: "Chest",
    symptoms: ["chest pain", "shortness of breath", "palpitations"],
    specialization: "Cardiology",
    position: [0, 0.98, 0],
    args: [0.32, 0.34],
  },
  {
    id: "abdomen",
    label: "Abdomen",
    symptoms: ["stomach pain", "nausea", "bloating"],
    specialization: "General Practice",
    position: [0, 0.46, 0],
    args: [0.28, 0.26],
  },
  {
    id: "left-arm",
    label: "Left Arm",
    symptoms: ["arm pain", "numbness", "joint pain"],
    specialization: "Orthopedics",
    position: [-0.5, 0.92, 0],
    args: [0.1, 0.62],
    rotation: [0, 0, 0.16],
  },
  {
    id: "right-arm",
    label: "Right Arm",
    symptoms: ["arm pain", "numbness", "joint pain"],
    specialization: "Orthopedics",
    position: [0.5, 0.92, 0],
    args: [0.1, 0.62],
    rotation: [0, 0, -0.16],
  },
  {
    id: "left-leg",
    label: "Left Leg",
    symptoms: ["knee pain", "swelling", "difficulty walking"],
    specialization: "Orthopedics",
    position: [-0.18, -0.32, 0],
    args: [0.13, 0.78],
  },
  {
    id: "right-leg",
    label: "Right Leg",
    symptoms: ["knee pain", "swelling", "difficulty walking"],
    specialization: "Orthopedics",
    position: [0.18, -0.32, 0],
    args: [0.13, 0.78],
  },
  {
    id: "back",
    label: "Back & Spine",
    symptoms: ["back pain", "stiffness", "sciatica"],
    specialization: "Orthopedics",
    position: [0, 0.86, -0.24],
    args: [0.16, 0.7],
  },
];

const Region = ({
  region,
  selected,
  onPick,
}: {
  region: BodyRegion;
  selected: boolean;
  onPick: (r: BodyRegion) => void;
}) => {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const target = selected ? 1.12 : hovered ? 1.06 : 1;
    const s = mesh.current.scale.x;
    const next = s + (target - s) * Math.min(1, delta * 8);
    mesh.current.scale.setScalar(next);
  });

  const active = selected || hovered;

  return (
    <mesh
      ref={mesh}
      position={region.position}
      rotation={region.rotation ?? [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPick(region);
      }}
    >
      <capsuleGeometry args={[region.args[0], region.args[1], 8, 24]} />
      <meshPhysicalMaterial
        color={active ? "#7DF3C6" : "#4C9BFF"}
        emissive={selected ? "#3BD6A0" : "#1b3f6b"}
        emissiveIntensity={active ? 0.55 : 0.15}
        roughness={0.18}
        metalness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.15}
        transmission={0.35}
        thickness={0.6}
        transparent
        opacity={0.92}
      />
      {active && (
        <Html center distanceFactor={6} zIndexRange={[10, 0]}>
          <span className="pointer-events-none whitespace-nowrap rounded-full border border-primary/30 bg-background/85 px-2 py-1 text-[10px] font-medium text-foreground shadow-lg backdrop-blur">
            {region.label}
          </span>
        </Html>
      )}
    </mesh>
  );
};

const Body = ({
  selectedId,
  onPick,
}: {
  selectedId?: string;
  onPick: (r: BodyRegion) => void;
}) => {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.35;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {BODY_REGIONS.map((r) => (
        <Region key={r.id} region={r} selected={selectedId === r.id} onPick={onPick} />
      ))}
      {/* soft ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
        <circleGeometry args={[1.4, 48]} />
        <meshBasicMaterial color="#3BD6A0" transparent opacity={0.07} />
      </mesh>
    </group>
  );
};

const Motes = () => {
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);
  const pts = useRef<any>(null);
  useFrame(({ clock }) => {
    if (pts.current) pts.current.rotation.y = clock.getElapsedTime() * 0.04;
  });
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#8ED9FF" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

interface Props {
  selectedId?: string;
  onPick: (region: BodyRegion) => void;
  className?: string;
}

const BodyMap3D = ({ selectedId, onPick, className }: Props) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0.4, 4.2], fov: 45 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.3} />
        <pointLight position={[-3, -1, 3]} intensity={2} color="#3BD6A0" />
        <pointLight position={[3, 2, -3]} intensity={1.6} color="#4C9BFF" />
        <Motes />
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
          <Body selectedId={selectedId} onPick={onPick} />
        </Float>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
      </Suspense>
    </Canvas>
  </div>
);

export default BodyMap3D;
