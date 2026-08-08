import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Pause, Play, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react"
import type { MonasteryStory } from "@/data/stories"
import { cn } from "@/lib/utils"

interface StoryModeProps {
  story: MonasteryStory
  image: string
  monasteryName: string
  onClose: () => void
}

/** Roughly how long a chapter stays up when narration is off, in ms. */
const readingDuration = (text: string) => Math.max(6500, Math.min(text.length * 58, 16000))

const PROGRESS_TICK_MS = 50

/**
 * Narrated, chaptered story tour for a single monastery.
 *
 * Pacing works one of two ways depending on narration:
 *  - narration off → a timer advances the chapter, and drives the progress bar.
 *  - narration on  → speech end advances the chapter, because a fixed timer
 *    would cut the voice off mid-sentence on slower voices or longer text.
 *    The bar still animates on the reading estimate, clamped at full, so it
 *    never runs ahead of the audio it is supposed to represent.
 *
 * Narration is opt-in rather than autoplaying. Speech starting unprompted on
 * page entry is both intrusive and, in most browsers, blocked before a user
 * gesture anyway — so autoplay would look broken rather than impressive.
 */
export function StoryMode({ story, image, monasteryName, onClose }: StoryModeProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [narrationOn, setNarrationOn] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const chapter = story.chapters[index]
  const isLast = index === story.chapters.length - 1
  const duration = readingDuration(chapter.text)

  // Speech synthesis isn't universally available (and is disabled in some
  // privacy-hardened browsers). Feature-detect once so the narration control
  // is hidden rather than present-but-dead where it can't work.
  const [speechAvailable] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  )
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= story.chapters.length) return
      setIndex(next)
      setElapsed(0)
    },
    [story.chapters.length]
  )

  const next = useCallback(() => {
    if (isLast) {
      onClose()
      return
    }
    goTo(index + 1)
  }, [isLast, index, goTo, onClose])

  const previous = useCallback(() => goTo(index - 1), [goTo, index])

  // Cancel any in-flight speech. Called on chapter change, unmount, and when
  // narration is switched off — speechSynthesis is global to the page, so
  // leaving an utterance running would keep talking over a closed story.
  const stopSpeech = useCallback(() => {
    if (!speechAvailable) return
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* cancel throws in some browsers when nothing is queued */
    }
    utteranceRef.current = null
  }, [speechAvailable])

  // Speak the current chapter when narration is on.
  useEffect(() => {
    if (!narrationOn || !speechAvailable || isPaused) return

    stopSpeech()
    const utterance = new SpeechSynthesisUtterance(chapter.text)
    utterance.rate = 0.92
    utterance.pitch = 1
    utterance.volume = 0.9
    utterance.onend = () => {
      // Guard against a stale utterance from a previous chapter resolving
      // after the user has already navigated away from it.
      if (utteranceRef.current === utterance) next()
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)

    return stopSpeech
    // `next` is intentionally excluded: it changes identity every time the
    // index does, which would re-trigger this effect and restart the speech
    // it just started. The onend guard above covers the staleness this
    // would otherwise protect against.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.text, narrationOn, speechAvailable, isPaused, stopSpeech])

  useEffect(() => stopSpeech, [stopSpeech])

  // Progress ticker. Advances the chapter itself only when narration is off.
  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => {
      setElapsed((prev) => {
        const value = prev + PROGRESS_TICK_MS
        if (value >= duration && !narrationOn) {
          next()
          return 0
        }
        return value
      })
    }, PROGRESS_TICK_MS)
    return () => clearInterval(id)
  }, [isPaused, duration, narrationOn, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") previous()
      if (e.key === " ") {
        e.preventDefault()
        setIsPaused((p) => !p)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, previous, onClose])

  const progress = Math.min(elapsed / duration, 1)

  return (
    // z-60 sits above the app's floating SOS / report-condition buttons,
    // which are fixed at z-50. At equal z-index they win on DOM order and
    // land on top of this overlay's own controls in the bottom-right.
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink">
      {/* Ken Burns image. The drift targets the chapter's focal point so the
          camera settles on whatever the narration is describing. */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={chapter.id}
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : chapter.scale }}
            animate={{
              opacity: 0.5,
              scale: reduceMotion ? 1 : chapter.scale + 0.09,
            }}
            exit={{ opacity: 0 }}
            style={{ transformOrigin: `${chapter.focus.x}% ${chapter.focus.y}%` }}
            transition={{
              opacity: { duration: 1.1 },
              scale: { duration: reduceMotion ? 0 : duration / 1000 + 2, ease: "linear" },
            }}
          />
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, hsl(var(--ink)) 0%, hsl(var(--ink) / 0.72) 45%, hsl(var(--ink) / 0.42) 100%)",
          }}
        />
      </div>

      {/* Chapter progress, one segment per chapter */}
      <div className="relative z-10 flex gap-1.5 px-5 pt-5 md:px-8 md:pt-6">
        {story.chapters.map((c, i) => (
          <button
            key={c.id}
            onClick={() => goTo(i)}
            aria-label={`Chapter ${i + 1}: ${c.title}`}
            className="group h-6 flex-1"
          >
            <span className="block h-0.5 w-full overflow-hidden bg-white/20">
              <span
                className="block h-full origin-left bg-heritage transition-transform"
                style={{
                  transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})`,
                  transitionDuration: i === index ? `${PROGRESS_TICK_MS}ms` : "0ms",
                  transitionTimingFunction: "linear",
                }}
              />
            </span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between px-5 pt-3 md:px-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-heritage">
            {monasteryName}
          </p>
          <h2 className="mt-1.5 font-display text-lg tracking-tight text-white md:text-xl">
            {story.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close story"
          className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Chapter body */}
      <div className="relative z-10 flex flex-1 items-end px-5 pb-4 md:px-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/40">
                  {String(index + 1).padStart(2, "0")} / {String(story.chapters.length).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-heritage/60" />
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-heritage">
                  {chapter.title}
                </span>
              </div>
              <p className="mt-4 font-display text-xl leading-[1.5] tracking-tight text-white md:text-3xl md:leading-[1.45]">
                {chapter.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-5 py-4 md:px-8">
        <div className="flex items-center gap-1">
          <ControlButton onClick={previous} disabled={index === 0} label="Previous chapter">
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </ControlButton>
          <ControlButton onClick={() => setIsPaused((p) => !p)} label={isPaused ? "Resume" : "Pause"}>
            {isPaused ? <Play className="h-4 w-4" strokeWidth={1.5} /> : <Pause className="h-4 w-4" strokeWidth={1.5} />}
          </ControlButton>
          <ControlButton onClick={next} label={isLast ? "Finish story" : "Next chapter"}>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </ControlButton>
        </div>

        {speechAvailable && (
          <button
            onClick={() => {
              if (narrationOn) stopSpeech()
              setNarrationOn((n) => !n)
              setElapsed(0)
            }}
            className={cn(
              "inline-flex items-center gap-2.5 border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
              narrationOn
                ? "border-heritage/60 text-heritage"
                : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            )}
          >
            {narrationOn ? <Volume2 className="h-3.5 w-3.5" strokeWidth={1.5} /> : <VolumeX className="h-3.5 w-3.5" strokeWidth={1.5} />}
            {narrationOn ? "Narrating" : "Narrate"}
          </button>
        )}
      </div>
    </div>
  )
}

const ControlButton = ({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15"
  >
    {children}
  </button>
)
