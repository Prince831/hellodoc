
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NavLinks = () => {
  const { user } = useAuth();

  const getNavigationLinks = () => {
    if (!user) {
      return [
        { to: "/doctors", label: "Find Doctors" },
        { to: "/symptom-checker", label: "Symptom Checker" },
      ];
    }

    switch (user.role) {
      case 'doctor':
        return [
          { to: "/doctor/dashboard", label: "Dashboard" },
          { to: "/doctor/appointments", label: "Appointments" },
          { to: "/doctor/patients", label: "Patients" },
          { to: "/doctor/messages", label: "Messages" },
          { to: "/doctor/consultations", label: "Consultations" },
        ];
      case 'admin':
        return [
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/users", label: "Users" },
          { to: "/admin/doctors", label: "Doctors" },
          { to: "/admin/appointments", label: "Appointments" },
          { to: "/admin/analytics", label: "Analytics" },
        ];
      default: // patient
        return [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/appointments", label: "Appointments" },
          { to: "/health-records", label: "Records" },
          { to: "/medications", label: "Medications" },
          { to: "/messages", label: "Messages" },
          { to: "/video-consultation", label: "Video Call" },
        ];
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {getNavigationLinks().map((link) => (
        <Link 
          key={link.to} 
          to={link.to} 
          className="transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
