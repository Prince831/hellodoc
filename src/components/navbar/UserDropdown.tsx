
import { Link } from "react-router-dom";
import { User, Settings, Pill, Activity, Video, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const UserDropdown = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
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
          <Link to="/dashboard" className="cursor-pointer w-full">
            <Activity className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/medications" className="cursor-pointer w-full">
            <Pill className="mr-2 h-4 w-4" />
            <span>Medications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/video-consultation" className="cursor-pointer w-full">
            <Video className="mr-2 h-4 w-4" />
            <span>Video Consultation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Admin Access Link - Only shown for users with admin role */}
        {user?.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="cursor-pointer w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
