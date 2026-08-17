import Logo from "@/components/navbar/Logo";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { Link, useLocation } from "react-router-dom";
import { Video, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/doctors", label: "Find Doctors" },
  { to: "/symptom-checker", label: "Symptom Checker" },
  { to: "/appointments", label: "Appointments" },
  { to: "/health-records", label: "Health Records" },
  { to: "/medications", label: "Medications" },
  { to: "/messages", label: "Messages" },
  { to: "/video-consultation", label: "Video Call", icon: Video },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((o) => !o);
  const closeMenu = () => setIsMenuOpen(false);

  const MobileNavContent = () => (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass absolute left-0 right-0 top-16 z-40 border-t md:hidden"
    >
      <div className="container mx-auto space-y-4 px-4 py-6">
        <GlobalSearch />
        <div className="flex flex-col space-y-1.5">
          {navigationLinks.map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              size="lg"
              asChild
              className="h-12 justify-start text-base font-medium"
              onClick={closeMenu}
            >
              <Link to={link.to}>
                {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                {link.label}
              </Link>
            </Button>
          ))}
          <Button variant="ghost" size="lg" asChild className="h-12 justify-start text-base" onClick={closeMenu}>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="h-12 justify-start text-base" onClick={closeMenu}>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationsPopover />
          </div>
          <UserDropdown />
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex">
              {navigationLinks.slice(0, 4).map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mx-8 hidden max-w-md flex-1 justify-center lg:flex">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/video-consultation">
                  <Video className="h-4 w-4" />
                  <span className="sr-only">Video Call</span>
                </Link>
              </Button>
              <NotificationsPopover />
              <ThemeToggle />
              <UserDropdown />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>{isMenuOpen && <MobileNavContent />}</AnimatePresence>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/10 backdrop-blur-sm md:hidden" onClick={closeMenu} />
      )}
    </>
  );
};

export default Navbar;
