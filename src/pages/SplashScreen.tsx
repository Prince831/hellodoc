
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";

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
        className="relative w-full max-w-[80vh] aspect-video bg-white rounded-lg shadow-xl overflow-hidden"
      >
        {/* Window Controls */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4">
          <div className="flex gap-2">
            <Circle className="w-3 h-3 fill-red-500 text-red-500" />
            <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <Circle className="w-3 h-3 fill-green-500 text-green-500" />
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full h-full pt-8 flex items-center justify-center">
          <div className="text-center">
            <img 
              src="/lovable-uploads/a14d508b-451d-457e-9978-d6ac299763b5.png"
              alt="Hello Doc Logo"
              className="w-full h-full object-contain max-w-[400px] max-h-[400px]"
            />
            {isLoading && (
              <div className="mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
