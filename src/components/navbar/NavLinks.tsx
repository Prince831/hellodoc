
import { Link } from "react-router-dom";
const NavLinks = () => {
  const user = null; // No authentication

  const getNavigationLinks = () => {
    return [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/doctors", label: "Find Doctors" },
      { to: "/symptom-checker", label: "Symptom Checker" },
      { to: "/appointments", label: "Appointments" },
      { to: "/health-records", label: "Records" },
      { to: "/medications", label: "Medications" },
      { to: "/messages", label: "Messages" },
      { to: "/video-consultation", label: "Video Call" },
    ];
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
