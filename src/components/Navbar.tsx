
import Logo from "@/components/navbar/Logo";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { Link } from "react-router-dom";
import { Video, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const MobileNavContent = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-40"
    >
      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Mobile Search */}
        <div className="w-full">
          <GlobalSearch />
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/appointments">Appointments</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/video-consultation">Video Consultation</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/health-records">Health Records</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/messages">Messages</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/settings">Settings</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/symptom-checker">Symptom Checker</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="justify-start h-12" onClick={closeMenu}>
                <Link to="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* User Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && <NotificationsPopover />}
          </div>
          {user && <UserDropdown />}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          
          {/* Center - Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md mx-8">
            <GlobalSearch />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
              {user && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/video-consultation">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Video Call</span>
                  </Link>
                </Button>
              )}
              {user && <NotificationsPopover />}
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
