import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:rotate-6">
        <Activity className="h-5 w-5 text-primary-foreground" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight gradient-text md:text-2xl">
        HelloDoc
      </span>
    </Link>
  );
};

export default Logo;
