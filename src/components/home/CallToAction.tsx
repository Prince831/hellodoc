
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary/90 to-primary/70 text-white mt-8 rounded-lg shadow-lg"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
        >
          Need Another Consultation?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto"
        >
          Try our AI Symptom Checker to find the right specialist for your needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="h-12 px-8 text-primary font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Link to="/symptom-checker">Start New Consultation</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
