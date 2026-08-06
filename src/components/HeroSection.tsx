import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMediaCarousel } from "./HeroMediaCarousel";
import { useRef } from "react";

/**
 * Hero lines rise out from behind a mask, one after the next — the reveal
 * used on the tourism sites this was modelled on. Each line sits in an
 * overflow-hidden wrapper, so the text is genuinely clipped rather than
 * just faded.
 */
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
};

const line = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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
              {/* pb/-mb pair stops the mask clipping descenders and the
                  italic overhang on "Sikkim". */}
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span variants={lineVariants} className="block">
                  Discover the Soul of
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  variants={lineVariants}
                  className="block bg-gradient-to-r from-heritage to-accent bg-clip-text pr-[0.08em] italic text-transparent"
                >
                  Sikkim
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
