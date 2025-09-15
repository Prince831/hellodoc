
import Logo from "@/components/navbar/Logo";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { Link } from "react-router-dom";
import { Video, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const user = null; // No authentication
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getNavigationLinks = () => {
    return [
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
  };

  const MobileNavContent = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-40"
    >
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Mobile Search */}
        <div className="w-full">
          <GlobalSearch />
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col space-y-3">
          {getNavigationLinks().map((link) => (
            <Button key={link.to} variant="ghost" size="lg" asChild className="justify-start h-12 text-base font-medium" onClick={closeMenu}>
              <Link to={link.to}>
                {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                {link.label}
              </Link>
            </Button>
          ))}
          
          <Button variant="ghost" size="lg" asChild className="justify-start h-12 text-base font-medium" onClick={closeMenu}>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="justify-start h-12 text-base font-medium" onClick={closeMenu}>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-6">
            <Logo />
            
            {/* Desktop Quick Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {getNavigationLinks().slice(0, 4).map((link) => (
                <Button key={link.to} variant="ghost" size="sm" asChild>
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          
          {/* Center - Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md mx-8">
            <GlobalSearch />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
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
            
            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && <MobileNavContent />}
      </AnimatePresence>
      
      {/* Mobile backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
