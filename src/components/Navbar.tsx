
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, User, Settings } from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Navbar = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const { toast } = useToast();

  // Mock notifications data
  const notifications = [
    { id: 1, title: "New Message", description: "Dr. Smith sent you a message", time: "Just now" },
    { id: 2, title: "Appointment Reminder", description: "Your appointment is tomorrow at 10 AM", time: "2 hours ago" },
    { id: 3, title: "Test Results", description: "Your test results are ready", time: "Yesterday" }
  ];

  const handleNotificationClick = () => {
    setUnreadNotifications(0);
  };

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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-medium">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="font-medium">Notifications</div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.description}</div>
                        <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  Mark all as read
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully",
                });
              }}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
