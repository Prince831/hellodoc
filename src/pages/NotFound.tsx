
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          <Button asChild size="lg">
            <Link to="/home">Return to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
