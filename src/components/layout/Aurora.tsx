import { cn } from "@/lib/utils";

/** Soft animated gradient blobs used as an ambient page backdrop. */
const Aurora = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
    <div
      className="aurora-blob h-[38rem] w-[38rem] -left-40 -top-40"
      style={{ background: "hsl(var(--primary) / 0.55)" }}
    />
    <div
      className="aurora-blob h-[32rem] w-[32rem] right-[-10rem] top-10"
      style={{ background: "hsl(var(--accent) / 0.45)", animationDelay: "-6s" }}
    />
    <div
      className="aurora-blob h-[34rem] w-[34rem] bottom-[-14rem] left-1/3"
      style={{ background: "hsl(var(--primary-glow) / 0.45)", animationDelay: "-11s" }}
    />
  </div>
);

export default Aurora;
