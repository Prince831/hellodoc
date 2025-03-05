
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, User } from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/home" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl md:text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              HelloDoc
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/symptom-checker" className="transition-colors hover:text-primary">
              Symptom Checker
            </Link>
            <Link to="/appointments" className="transition-colors hover:text-primary">
              Appointments
            </Link>
            <Link to="/health-records" className="transition-colors hover:text-primary">
              Records
            </Link>
            <Link to="/messages" className="transition-colors hover:text-primary">
              Messages
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
