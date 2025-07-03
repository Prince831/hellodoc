
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      <Link to="/doctors" className="transition-colors hover:text-primary">
        Doctors
      </Link>
      <Link to="/symptom-checker" className="transition-colors hover:text-primary">
        Find by Symptoms
      </Link>
      <Link to="/dashboard" className="transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link to="/appointments" className="transition-colors hover:text-primary">
        Appointments
      </Link>
      <Link to="/health-records" className="transition-colors hover:text-primary">
        Records
      </Link>
      <Link to="/medications" className="transition-colors hover:text-primary">
        Medications
      </Link>
      <Link to="/messages" className="transition-colors hover:text-primary">
        Messages
      </Link>
      <Link to="/video-consultation" className="transition-colors hover:text-primary">
        Video Call
      </Link>
    </nav>
  );
};

export default NavLinks;
