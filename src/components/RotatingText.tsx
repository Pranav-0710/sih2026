import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./RotatingText.css";

/**
 * Adapted from React Bits' RotatingText (https://reactbits.dev). The
 * upstream source imports from the standalone `motion/react` package; this
 * project already depends on `framer-motion` (same team, same API for the
 * `motion` and `AnimatePresence` exports used here), so the import was
 * swapped rather than installing a second animation library that would do
 * the same job as the one already in use everywhere else in the app.
 *
 * Prop types for initial/animate/exit/transition are derived from
 * motion.span's own props rather than importing framer-motion's internal
 * type names directly, which keeps this resilient to minor version-to-
 * version renames in framer-motion's exported type surface.
 */

type MotionSpanProps = ComponentPropsWithoutRef<typeof motion.span>;

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<
    MotionSpanProps,
    "children" | "initial" | "animate" | "exit" | "transition"
  > {
  texts: string[];
  transition?: MotionSpanProps["transition"];
  initial?: MotionSpanProps["initial"];
  animate?: MotionSpanProps["animate"];
  exit?: MotionSpanProps["exit"];
  animatePresenceMode?: "sync" | "wait" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  /**
   * A resolver function lets the split strategy vary per text, which matters
   * here: Devanagari and Tibetan glyphs shape and combine contextually
   * (conjuncts, subjoined stacks, matras), so splitting them into isolated
   * per-character spans can break how they render. Restricting the
   * per-letter cascade to scripts that are actually safe to split — plain
   * Latin — avoids that risk while still allowing it where it's safe.
   */
  splitBy?: "characters" | "words" | "lines" | string | ((text: string) => "characters" | "words" | "lines" | string);
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

interface WordSplit {
  characters: string[];
  needsSpace: boolean;
}

/**
 * Intl.Segmenter splits on grapheme clusters (so emoji/combining characters
 * count as one "character"), but its types aren't in this project's TS lib
 * target. Declared narrowly here rather than widening the project-wide lib
 * setting for one optional code path — this app's rotating texts are plain
 * ASCII monastery names, so the Array.from fallback is what actually runs.
 */
interface SegmenterLike {
  segment(text: string): Iterable<{ segment: string }>;
}
interface IntlWithSegmenter {
  Segmenter: new (locale: string, options: { granularity: string }) => SegmenterLike;
}

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as unknown as IntlWithSegmenter).Segmenter("en", {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
};

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const currentText = texts[currentTextIndex] ?? "";
  const resolvedSplitBy = typeof splitBy === "function" ? splitBy(currentText) : splitBy;

  const elements = useMemo<WordSplit[]>(() => {
    if (resolvedSplitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (resolvedSplitBy === "words") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: [word],
        needsSpace: i !== words.length - 1,
      }));
    }
    if (resolvedSplitBy === "lines") {
      const lines = currentText.split("\n");
      return lines.map((line, i) => ({
        characters: [line],
        needsSpace: i !== lines.length - 1,
      }));
    }

    const parts = currentText.split(resolvedSplitBy);
    return parts.map((part, i) => ({
      characters: [part],
      needsSpace: i !== parts.length - 1,
    }));
  }, [currentText, resolvedSplitBy]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * totalChars);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex);
      onNext?.(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  const totalCharCount = elements.reduce((sum, word) => sum + word.characters.length, 0);

  return (
    <motion.span className={cn("text-rotate", mainClassName)} {...rest} layout transition={transition}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(resolvedSplitBy === "lines" ? "text-rotate-lines" : "text-rotate")}
          layout
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0);
            return (
              <span key={wordIndex} className={cn("text-rotate-word", splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(previousCharsCount + charIndex, totalCharCount),
                    }}
                    className={cn("text-rotate-element", elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
