import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StackCardProps {
  children: ReactNode
  /** Position in the stack — drives the small stepped offset of the deck. */
  index: number
  className?: string
  /** Height of the scroll runway. Longer = slower, more deliberate stacking. */
  runway?: string
}

/**
 * Scroll-stacked card.
 *
 * Each card sticks to the top of the viewport while the page scrolls past
 * its runway, then the next card rides up and covers it — the outgoing card
 * shrinking and dimming so the deck reads as depth rather than a hard cut.
 *
 * The structure matters: the scroll progress is measured on the OUTER
 * spacer, never on the sticky element itself. A stuck element's bounding
 * rect stops moving relative to the viewport by definition, so measuring it
 * directly would freeze progress at 0 for exactly the span the effect needs
 * to animate over.
 *
 * `top` steps down slightly per card so the stacked edges stay visible
 * behind the active one, like a fanned deck.
 */
export function StackCard({ children, index, className, runway = "115vh" }: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Cards recede as the following one arrives over them.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.9, 0.45])

  return (
    <div ref={ref} style={{ height: runway }} className="relative">
      <div
        className="sticky"
        style={{ top: `calc(6.5rem + ${index * 0.75}rem)` }}
      >
        <motion.div
          style={reduceMotion ? undefined : { scale, opacity }}
          className={cn("origin-top", className)}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

interface StackedCardsProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper for a run of StackCards. Exists mainly to give the group a
 * predictable stacking context and bottom breathing room so the final card
 * can settle before the footer arrives.
 */
export function StackedCards({ children, className }: StackedCardsProps) {
  return <div className={cn("relative pb-[35vh]", className)}>{children}</div>
}
