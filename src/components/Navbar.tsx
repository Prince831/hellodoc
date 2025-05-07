
import Logo from "@/components/navbar/Logo";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";
import { Link } from "react-router-dom";
import { Video } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/video-consultation">
              <Video className="h-5 w-5" />
              <span className="sr-only">Video Call</span>
            </Link>
          </Button>
          <NotificationsPopover />
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
