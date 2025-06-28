
import Logo from "@/components/navbar/Logo";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { Link } from "react-router-dom";
import { Video, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  const MobileNavContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <NotificationsPopover />}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        {user ? (
          <>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/appointments">Appointments</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/video-consultation">Video Consultation</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/health-records">Health Records</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/messages">Messages</Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/symptom-checker">Symptom Checker</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link to="/auth">Sign In</Link>
            </Button>
          </>
        )}
      </div>
      {user && (
        <div className="border-t pt-4">
          <UserDropdown />
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <Logo />
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <MobileNavContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Center - Search (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
          <GlobalSearch />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile search */}
          <div className="flex md:hidden">
            <GlobalSearch />
          </div>
          
          {user && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/video-consultation">
                <Video className="h-5 w-5" />
                <span className="sr-only">Video Call</span>
              </Link>
            </Button>
          )}
          
          {/* Desktop navigation items */}
          <div className="hidden md:flex items-center gap-2">
            {user && <NotificationsPopover />}
            <ThemeToggle />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
