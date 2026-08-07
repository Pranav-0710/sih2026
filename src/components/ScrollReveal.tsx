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
 * Reduced motion drops the sliding panel but still reveals via a plain
 * opacity crossfade, rather than skipping the panel outright. An earlier
 * version bailed out to a static div with no animation at all here — the
 * same class of bug that once froze the hero's rotating text: gating the
 * *reveal itself* behind prefers-reduced-motion, instead of gating only the
 * large positional motion, means anyone with that OS setting never sees the
 * effect at all. A same-place opacity fade carries no vestibular-motion risk,
 * so it's safe to keep even under reduced motion.
 */
const ScrollReveal = ({
  children,
  className,
  blockClassName = "bg-gray-900",
  delay = 0,
  amount = 0.3,
}: ScrollRevealProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", blockClassName)}
        initial={reduceMotion ? { opacity: 1 } : { y: "0%" }}
        whileInView={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
        viewport={{ once: true, amount }}
        transition={
          reduceMotion
            ? { duration: 0.4, delay }
            : { duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }
        }
      />
    </div>
  );
};

export default ScrollReveal;
