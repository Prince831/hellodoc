
import Logo from "@/components/navbar/Logo";
import NavLinks from "@/components/navbar/NavLinks";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsPopover from "@/components/navbar/NotificationsPopover";
import UserDropdown from "@/components/navbar/UserDropdown";

const Navbar = () => {
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
    </header>
  );
};

export default Navbar;
