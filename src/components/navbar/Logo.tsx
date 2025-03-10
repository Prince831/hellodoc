
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/home" className="flex items-center space-x-2">
      <span className="inline-block font-bold text-xl md:text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
        HelloDoc
      </span>
    </Link>
  );
};

export default Logo;
