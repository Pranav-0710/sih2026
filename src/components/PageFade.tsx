import { motion } from "framer-motion";

/**
 * Wraps a routed page so navigating between routes fades/rises the new
 * page in rather than hard-cutting. Deliberately entrance-only (no exit
 * animation tied to route change) — trying to time an exit against
 * React Router's location swap is fragile without a way to visually
 * verify the result, and a clean fade-in already fixes the hard-cut feel.
 */
const PageFade = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default PageFade;
