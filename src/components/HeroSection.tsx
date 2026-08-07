import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMediaCarousel } from "./HeroMediaCarousel";
import RotatingText from "./RotatingText";
import { useRef } from "react";

/** Real sites, ending on the umbrella name — not generic synonym filler. */
const ROTATING_WORDS = ["Rumtek", "Pemayangtse", "Tashiding", "Enchey", "Sikkim"];

const gradientTextClass =
  "animate-gradient-text bg-gradient-to-r from-heritage via-accent to-heritage bg-clip-text pr-[0.08em] italic text-transparent";

/**
 * Hero lines rise out from behind a mask, one after the next — the reveal
 * used on the tourism sites this was modelled on. Each line sits in an
 * overflow-hidden wrapper, so the text is genuinely clipped rather than
 * just faded.
 */
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

const line = {
  hidden: { y: "115%", rotate: 4 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const HEADLINE_WORDS = ["Discover", "the", "Soul", "of"];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const HeroSection = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  // With reduced motion the lines simply fade in place — no vertical travel.
  const lineVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }
    : line;

  return (
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden">
      <motion.div className="absolute inset-0 scale-110" style={{ y, opacity }}>
        <HeroMediaCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-3xl text-white"
          >
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {/* Each word gets its own mask so they arrive one after another.
                  The pb/-mb pair stops the mask clipping descenders and the
                  italic overhang on "Sikkim". */}
              <span className="block">
                {HEADLINE_WORDS.map((word) => (
                  <span
                    key={word}
                    className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
                  >
                    <motion.span variants={lineVariants} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                {/*
                  This outer motion.span handles the ONE-TIME entrance —
                  same staggered rise as "Discover the Soul of" above, driven
                  by the parent container's variants. RotatingText's own
                  initial/animate/exit only govern its *subsequent* swaps
                  (animatePresenceInitial stays false), so the first name
                  doesn't animate in twice.

                  splitBy="words" is deliberate: every entry in
                  ROTATING_WORDS is a single word, so this keeps each name
                  as one gradient-clipped span rather than fragmenting it
                  into a per-character gradient, which would look like the
                  colour was restarting mid-word.
                */}
                <motion.span variants={lineVariants} className="inline-block">
                  <RotatingText
                    texts={ROTATING_WORDS}
                    splitBy="words"
                    rotationInterval={2200}
                    // Always keeps rotating — this is content change, the
                    // same rule the hero video carousel follows, not
                    // decorative motion. Only the slide-vs-fade transition
                    // style below responds to reduced-motion; gating `auto`
                    // on it too would freeze the headline on "Rumtek"
                    // forever for anyone with that preference on.
                    auto
                    staggerDuration={0}
                    initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { y: "0%", opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { y: "-120%", opacity: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0.4 }
                        : { type: "spring", damping: 30, stiffness: 400 }
                    }
                    mainClassName="inline-flex"
                    splitLevelClassName="overflow-hidden"
                    elementLevelClassName={gradientTextClass}
                  />
                </motion.span>
              </span>
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg font-light leading-relaxed text-gray-200 md:text-xl"
            >
              Step inside centuries-old monasteries, explore Himalayan Buddhist
              heritage, and help preserve it for the next generation.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — with no buttons left in the hero, this is the only hint
          that there is more page below. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 pt-2">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-white/70"
            animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
