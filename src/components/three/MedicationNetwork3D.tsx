import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export type InteractionLevel = "none" | "moderate" | "severe";

export interface MedNode {
  id: string;
  name: string;
}

export interface MedEdge {
  source: string;
  target: string;
  level: Exclude<InteractionLevel, "none">;
  note: string;
}

const LEVEL_COLOR: Record<Exclude<InteractionLevel, "none">, string> = {
  moderate: "#F5B942",
  severe: "#FF6B6B",
};

const Node = ({
  position,
  name,
  danger,
  onSelect,
  active,
}: {
  position: THREE.Vector3;
  name: string;
  danger: InteractionLevel;
  onSelect: () => void;
  active: boolean;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const pulse = danger === "severe" ? 1 + Math.sin(clock.getElapsedTime() * 4) * 0.06 : 1;
    const target = (active || hovered ? 1.25 : 1) * pulse;
    const s = mesh.current.scale.x;
    mesh.current.scale.setScalar(s + (target - s) * Math.min(1, delta * 10));
  });

  const color = danger === "severe" ? LEVEL_COLOR.severe : danger === "moderate" ? LEVEL_COLOR.moderate : "#4C9BFF";

  return (
    <mesh
      ref={mesh}
      position={position}
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
        onSelect();
      }}
    >
      <icosahedronGeometry args={[0.28, 3]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active || hovered ? 0.7 : 0.3}
        roughness={0.15}
        metalness={0.3}
        clearcoat={1}
      />
      <Html center distanceFactor={8} zIndexRange={[10, 0]}>
        <span className="pointer-events-none whitespace-nowrap rounded-full border border-border/40 bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground shadow backdrop-blur">
          {name}
        </span>
      </Html>
    </mesh>
  );
};

const Edge = ({ a, b, level }: { a: THREE.Vector3; b: THREE.Vector3; level: Exclude<InteractionLevel, "none"> }) => {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([a, b]), [a, b]);
  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: LEVEL_COLOR[level], transparent: true, opacity: 0.75 }),
        )
      }
    />
  );
};

const Graph = ({
  nodes,
  edges,
  selected,
  onSelect,
}: {
  nodes: MedNode[];
  edges: MedEdge[];
  selected?: string;
  onSelect: (id: string) => void;
}) => {
  const group = useRef<THREE.Group>(null);

  const layout = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    const n = Math.max(nodes.length, 1);
    nodes.forEach((node, i) => {
      // golden-angle spiral on a sphere — stable, no simulation needed
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      map.set(node.id, new THREE.Vector3(Math.cos(theta) * radius * 1.7, y * 1.3, Math.sin(theta) * radius * 1.7));
    });
    return map;
  }, [nodes]);

  const dangerOf = (id: string): InteractionLevel => {
    const related = edges.filter((e) => e.source === id || e.target === id);
    if (related.some((e) => e.level === "severe")) return "severe";
    if (related.length) return "moderate";
    return "none";
  };

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      {edges.map((e, i) => {
        const a = layout.get(e.source);
        const b = layout.get(e.target);
        if (!a || !b) return null;
        return <Edge key={i} a={a} b={b} level={e.level} />;
      })}
      {nodes.map((node) => (
        <Node
          key={node.id}
          name={node.name}
          position={layout.get(node.id)!}
          danger={dangerOf(node.id)}
          active={selected === node.id}
          onSelect={() => onSelect(node.id)}
        />
      ))}
    </group>
  );
};

interface Props {
  nodes: MedNode[];
  edges: MedEdge[];
  selected?: string;
  onSelect: (id: string) => void;
  className?: string;
}

const MedicationNetwork3D = ({ nodes, edges, selected, onSelect, className }: Props) => (
  <div className={className}>
    <Canvas camera={{ position: [0, 0.6, 5.6], fov: 45 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 4]} intensity={1.2} />
        <pointLight position={[-4, -2, 3]} intensity={1.8} color="#3BD6A0" />
        <Graph nodes={nodes} edges={edges} selected={selected} onSelect={onSelect} />
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} />
      </Suspense>
    </Canvas>
  </div>
);

export default MedicationNetwork3D;
