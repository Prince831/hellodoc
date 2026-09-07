import { Link, useNavigate } from "react-router-dom";
import { User, Settings, Pill, Activity, Video, Stethoscope, CalendarDays, LogOut, LogIn } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const UserDropdown = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, roles, isDoctor, signOut } = useAuth();

  if (!user) {
    return (
      <Button asChild variant="default" size="sm" className="rounded-full">
        <Link to="/auth">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "U";
  const roleLabel = isDoctor ? "doctor" : roles[0] ?? "patient";

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been signed out." });
    navigate("/", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="truncate text-sm font-medium">{email}</p>
            <p className="text-xs capitalize text-primary">{roleLabel}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {isDoctor ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/doctor" className="w-full cursor-pointer">
                <Stethoscope className="mr-2 h-4 w-4" />
                <span>Doctor dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/doctor/schedule" className="w-full cursor-pointer">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>My schedule</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="w-full cursor-pointer">
                <Activity className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/medications" className="w-full cursor-pointer">
                <Pill className="mr-2 h-4 w-4" />
                <span>Medications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/video-consultation" className="w-full cursor-pointer">
                <Video className="mr-2 h-4 w-4" />
                <span>Video consultation</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link to="/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
