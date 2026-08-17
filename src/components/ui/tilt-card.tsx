import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number;
  glare?: boolean;
}

/** Pointer-reactive 3D tilt wrapper. Pure CSS transforms — no extra deps. */
const TiltCard = ({
  children,
  className,
  intensity = 10,
  glare = true,
  ...props
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setStyle({
      transform: `perspective(1000px) rotateY(${(px - 0.5) * intensity * 2}deg) rotateX(${
        (0.5 - py) * intensity * 2
      }deg) translateY(-6px) scale(1.015)`,
    });
    setGlarePos({ x: px * 100, y: py * 100, opacity: 0.16 });
  };

  const reset = () => {
    setStyle({ transform: "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)" });
    setGlarePos((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)", ...style }}
      className={cn("relative will-change-transform", className)}
      {...props}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsl(var(--primary-glow)), transparent 55%)`,
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
