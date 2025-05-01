
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-16 px-4 bg-primary text-white mt-8 rounded-lg"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Need Another Consultation?</h2>
        <p className="text-xl mb-8 opacity-90">
          Try our AI Symptom Checker to find the right specialist for your needs.
        </p>
        <Button
          variant="secondary"
          size="lg"
          asChild
          className="h-12 px-8 text-primary"
        >
          <Link to="/symptom-checker">Start New Consultation</Link>
        </Button>
      </div>
    </motion.section>
  );
};

export default CallToAction;
