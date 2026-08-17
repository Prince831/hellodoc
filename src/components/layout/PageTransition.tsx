import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Consistent 3D-ish entry transition for every routed page. */
const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;
