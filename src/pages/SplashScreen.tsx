
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/symptom-checker");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EEFF]">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img 
          src="/lovable-uploads/a14d508b-451d-457e-9978-d6ac299763b5.png"
          alt="Hello Doc Logo"
          className="w-32 h-32 mx-auto mb-4"
        />
        {isLoading && (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SplashScreen;
