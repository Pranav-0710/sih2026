import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar pinned above the floating navbar.
 * Purely decorative, so it stays out of the accessibility tree.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-heritage"
    />
  );
};

export default ScrollProgress;
