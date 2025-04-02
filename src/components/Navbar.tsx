
import Logo from "@/components/navbar/Logo";
import NavLinks from "@/components/navbar/NavLinks";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Only show the title bar on the SymptomChecker and Messages pages
  const showTitleBar = path === "/symptom-checker" || path === "/messages";
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo />
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <NotificationsPopover />
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
      
      {showTitleBar && (
        <div className="w-full bg-primary py-4 px-6 text-center text-primary-foreground">
          <h1 className="text-2xl font-bold">
            {path === "/symptom-checker" ? "Symptom Checker" : "Messages"}
          </h1>
        </div>
      )}
    </header>
  );
};

export default Navbar;
