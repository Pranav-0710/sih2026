import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroMediaCarousel } from "./HeroMediaCarousel";
import RotatingText from "./RotatingText";
import { useRef, useState } from "react";

/**
 * "Sikkim" through the languages actually spoken there.
 *
 * འབྲས་ལྗོངས (Wylie: 'bras ljongs) — "Drenjong/Denjong", Valley of Rice — is
 * the Sikkimese Bhutia endonym, verified against Wikipedia's Sikkimese Bhutia
 * and Sikkim articles rather than transliterated by guesswork.
 *
 * Note Nepali and Hindi render the name identically in Devanagari (सिक्किम).
 * That is correct, not a duplicate — the label beneath the pill is what makes
 * the repeat legible as two separate languages instead of a frozen rotation.
 */
const SIKKIM_NAMES = [
  { name: "Sikkim", language: "English" },
  { name: "འབྲས་ལྗོངས", language: "Sikkimese" },
  { name: "सिक्किम", language: "Nepali" },
  { name: "सिक्किम", language: "Hindi" },
];

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

/** True for plain Latin text — the per-letter cascade is only safe for this. */
const isAsciiOnly = (text: string) =>
  Array.from(text).every((ch) => (ch.codePointAt(0) ?? 0) <= 0x7f);

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
  const [nameIndex, setNameIndex] = useState(0);

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
              {/*
                The outer motion.span drives the ONE-TIME entrance, staggered
                in with "Discover the Soul of" above. RotatingText's own
                initial/animate/exit govern only its subsequent swaps
                (animatePresenceInitial stays false), so the first name does
                not play two entrance animations back to back.

                splitBy is a resolver rather than a fixed value: the
                per-letter cascade (matching the React Bits reference) only
                runs for plain-ASCII text — i.e. "Sikkim". Devanagari and
                Tibetan shape and combine contextually, so the Nepali,
                Hindi and Sikkimese entries stay whole-word to avoid
                rendering them incorrectly. The pill itself still resizes
                smoothly between all four via the `layout` prop.
              */}
              <motion.span
                variants={lineVariants}
                className="inline-flex items-baseline gap-4"
                style={{ perspective: 500 }}
              >
                {/*
                  A genuine "roll": each character tips in on rotateX, like a
                  drum/odometer digit turning over, rather than sliding
                  vertically. transformPerspective is set per-character (not
                  just on the parent) so every letter gets its own vanishing
                  point and rolls independently instead of the whole pill
                  warping as one flat plane.
                */}
                <RotatingText
                  texts={SIKKIM_NAMES.map((n) => n.name)}
                  splitBy={(text) => (isAsciiOnly(text) ? "characters" : "words")}
                  staggerFrom="last"
                  staggerDuration={0.035}
                  rotationInterval={2600}
                  auto
                  onNext={setNameIndex}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { rotateX: 90, y: "40%", opacity: 0, transformPerspective: 400 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { rotateX: 0, y: "0%", opacity: 1, transformPerspective: 400 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { rotateX: -90, y: "-40%", opacity: 0, transformPerspective: 400 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.4 }
                      : { type: "spring", damping: 22, stiffness: 260 }
                  }
                  mainClassName="font-multiscript inline-flex items-center rounded-lg bg-heritage px-4 py-1 font-bold not-italic text-[#1a1207] md:px-5"
                  splitLevelClassName="overflow-hidden pb-[0.1em] -mb-[0.1em]"
                />
              </motion.span>
            </h1>

            {/* Names the language currently shown. Without this, the Nepali
                and Hindi frames — identical in Devanagari — would read as a
                stalled rotation rather than two distinct languages. */}
            <motion.div variants={fadeUp} className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-heritage/60" />
              <span
                key={nameIndex}
                className="animate-fade-in text-[11px] font-medium uppercase tracking-[0.28em] text-heritage"
              >
                {SIKKIM_NAMES[nameIndex]?.language}
              </span>
            </motion.div>

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
