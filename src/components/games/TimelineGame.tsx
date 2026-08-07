import { useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Check, X } from "lucide-react"
import { timelineEntries, type TimelineEntry } from "@/data/games"
import { cn } from "@/lib/utils"

/** Fisher-Yates, seeded per round so a replay reshuffles. */
const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Order the four monasteries oldest to newest.
 *
 * Deliberately not a drag-and-drop: dragging is fiddly on touch, needs a
 * library, and is unusable by keyboard. Tapping to place into the next free
 * slot gives the same puzzle with none of that.
 */
export function TimelineGame({ onComplete }: { onComplete: (score: number) => void }) {
  // The shuffled deck lives in state and is reshuffled explicitly on reset,
  // rather than being a useMemo keyed on a round counter — the counter was
  // never read inside the memo, which made it look like a redundant
  // dependency to anyone reading it (and to eslint).
  const [pool, setPool] = useState<TimelineEntry[]>(() => shuffle(timelineEntries))
  const [placed, setPlaced] = useState<TimelineEntry[]>([])
  const [checked, setChecked] = useState(false)

  const remaining = pool.filter((e) => !placed.some((p) => p.id === e.id))
  const correctOrder = [...timelineEntries].sort((a, b) => a.year - b.year)
  const isRight = (entry: TimelineEntry, i: number) => correctOrder[i]?.id === entry.id
  const score = placed.filter((e, i) => isRight(e, i)).length

  const reset = () => {
    setPlaced([])
    setChecked(false)
    setPool(shuffle(timelineEntries))
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Tap the monasteries in the order they were founded — oldest first.
      </p>

      {/* Slots */}
      <ol className="mt-8 space-y-2">
        {[0, 1, 2, 3].map((i) => {
          const entry = placed[i]
          const right = entry && isRight(entry, i)
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-4 border px-4 py-3.5 transition-colors",
                !entry && "border-dashed border-foreground/20",
                entry && !checked && "border-foreground/25 bg-card",
                checked && right && "border-emerald-600/60 bg-emerald-600/5",
                checked && entry && !right && "border-destructive/60 bg-destructive/5"
              )}
            >
              <span className="font-mono text-[11px] tabular-nums tracking-widest text-foreground/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              {entry ? (
                <>
                  <span className="flex-1 font-display text-lg text-foreground">{entry.name}</span>
                  {checked && (
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {entry.year}
                      </span>
                      {right ? (
                        <Check className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
                      ) : (
                        <X className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                      )}
                    </span>
                  )}
                </>
              ) : (
                <span className="flex-1 text-sm text-muted-foreground/60">Empty</span>
              )}
            </li>
          )
        })}
      </ol>

      {/* Pool */}
      {!checked && (
        <div className="mt-6 flex flex-wrap gap-2">
          {remaining.map((entry) => (
            <motion.button
              key={entry.id}
              layout
              onClick={() => setPlaced((p) => [...p, entry])}
              className="border border-foreground/20 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-foreground/50 hover:bg-card"
            >
              {entry.name}
            </motion.button>
          ))}
        </div>
      )}

      {/* Result notes */}
      {checked && (
        <div className="mt-6 space-y-2 border-t border-foreground/10 pt-5">
          {correctOrder.map((entry) => (
            <p key={entry.id} className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-mono tabular-nums text-foreground">{entry.year}</span>{" "}
              <span className="text-foreground">{entry.name}</span> — {entry.note}
            </p>
          ))}
        </div>
      )}

      <div className="mt-7 flex items-center gap-3">
        {!checked ? (
          <button
            onClick={() => {
              setChecked(true)
              onComplete(placed.filter((e, i) => isRight(e, i)).length * 25)
            }}
            disabled={placed.length < 4}
            className="border border-foreground/25 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check order
          </button>
        ) : (
          <>
            <span className="font-mono text-sm tabular-nums text-foreground">
              {score} / 4 correct
            </span>
            <button
              onClick={reset}
              className="ml-auto inline-flex items-center gap-2 border border-foreground/25 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/60"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Again
            </button>
          </>
        )}
        {!checked && placed.length > 0 && (
          <button
            onClick={() => setPlaced([])}
            className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
