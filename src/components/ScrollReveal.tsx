import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  blockClassName?: string;
  delay?: number;
  amount?: number;
}

/**
 * "Block up" scroll reveal, modelled on hotelbelavista.net: a solid panel
 * sits over the content, then slides fully off the top edge as the element
 * scrolls into view, like a shutter lifting.
 *
 * blockClassName defaults to a fixed dark tone rather than `bg-background`/
 * `bg-card` — those tokens flip to near-white in light system theme (see
 * index.css :root), which would make the panel flash white on every reveal
 * for anyone not in dark mode. The reveal itself should never depend on the
 * viewer's OS theme.
 *
 * Reduced motion skips the panel outright instead of animating it near-
 * instantly: an opaque overlay is one of the few decorative-motion cases
 * where "disabled" has to mean "never covers the content," not just "moves
 * fast" — a stuck or mistimed panel would hide real content, not just motion.
 */
const ScrollReveal = ({
  children,
  className,
  blockClassName = "bg-gray-900",
  delay = 0,
  amount = 0.3,
}: ScrollRevealProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", blockClassName)}
        initial={{ y: "0%" }}
        whileInView={{ y: "-100%" }}
        viewport={{ once: true, amount }}
        transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
};

export default ScrollReveal;
