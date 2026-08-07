import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use sparingly — sections should mostly move as one. */
  delay?: number;
  /** Fraction of the element that must be on screen before it starts. */
  amount?: number;
  /** How far below its resting place the content starts, in px. */
  distance?: number;
}

/**
 * Section reveal: content rises into place as it scrolls into view.
 *
 * Wrap a section's *content* with this, never the <section> element that
 * carries the background — animating the background too would drag the
 * section's colour up with it and open a visible gap against the section
 * above. Backgrounds stay put; only what sits on them moves.
 *
 * There is deliberately no covering panel here. An earlier version wiped a
 * solid block up over the content, which meant every reveal briefly hid the
 * section behind an opaque rectangle and had to be colour-matched against
 * both light and dark themes to avoid flashing. Moving the content itself
 * needs no overlay, so it cannot flash any colour, and it reads as one
 * continuous motion rather than a shutter.
 *
 * No overflow-hidden either: this wraps arbitrary section content, some of
 * which intentionally overflows its box (hover image scale, focus rings),
 * and clipping that here would silently break it.
 */
const ScrollReveal = ({
  children,
  className,
  delay = 0,
  amount = 0.15,
  distance = 56,
}: ScrollRevealProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      data-scroll-reveal="true"
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={
        reduceMotion
          ? { duration: 0.5, delay }
          : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
