import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Hero background carousel cycling through all four monasteries.
 *
 * Only Enchey has openly-licensed video footage available (see CREDITS.md).
 * Rumtek, Pemayangtse and Tashiding use a "Ken Burns" pan/zoom on static
 * photography instead of real video — this is a deliberate, disclosed
 * choice, not a stand-in for footage we couldn't find.
 *
 * Video scenes get more screen time than photo scenes so the loop opens
 * on real motion and doesn't linger on stills.
 */

interface Scene {
  type: "image" | "video";
  src: string;
  alt: string;
  durationMs: number;
}

const IMAGE_DURATION_MS = 3500;
const VIDEO_DURATION_MS = 7000;

const scenes: Scene[] = [
  {
    type: "video",
    src: "/vr-assets/enchey-prayer-flags.webm",
    alt: "Prayer flags fluttering at Enchey Monastery",
    durationMs: VIDEO_DURATION_MS,
  },
  {
    type: "image",
    src: "/vr-assets/rumtek-monastery.jpg",
    alt: "Rumtek Monastery",
    durationMs: IMAGE_DURATION_MS,
  },
  {
    type: "video",
    src: "/vr-assets/enchey-prayer-wheels.webm",
    alt: "Prayer wheels turning at Enchey Monastery",
    durationMs: VIDEO_DURATION_MS,
  },
  {
    type: "image",
    src: "/vr-assets/pemayangtse-monastery.jpg",
    alt: "Pemayangtse Monastery",
    durationMs: IMAGE_DURATION_MS,
  },
  {
    type: "image",
    src: "/vr-assets/tashiding-monastery.jpg",
    alt: "Tashiding Monastery",
    durationMs: IMAGE_DURATION_MS,
  },
];

export function HeroMediaCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Scenes always cycle — this is content rotation, not the kind of motion
    // prefers-reduced-motion is meant to suppress. Only the Ken Burns pan/zoom
    // itself is disabled for reduced-motion users, via CSS (see index.css).
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, scenes[index].durationMs);

    return () => clearTimeout(timer);
  }, [index]);

  const scene = scenes[index];

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {scene.type === "image" ? (
            <div
              className="absolute inset-0 bg-cover bg-center animate-ken-burns"
              style={{ backgroundImage: `url(${scene.src})` }}
              role="img"
              aria-label={scene.alt}
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={scene.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={scene.alt}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
