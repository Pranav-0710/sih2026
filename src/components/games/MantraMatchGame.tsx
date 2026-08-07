import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { mantraPairs } from "@/data/games"
import { cn } from "@/lib/utils"

interface Card {
  key: string
  pairId: string
  label: string
  kind: "term" | "meaning"
}

const PAIRS_PER_ROUND = 6

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Draws a fresh six-pair board from the ten-pair pool. */
const dealCards = (): Card[] => {
  const chosen = shuffle(mantraPairs).slice(0, PAIRS_PER_ROUND)
  return shuffle(
    chosen.flatMap((p) => [
      { key: `${p.id}-term`, pairId: p.id, label: p.term, kind: "term" as const },
      { key: `${p.id}-meaning`, pairId: p.id, label: p.meaning, kind: "meaning" as const },
    ])
  )
}

/**
 * Memory pairs: match a Tibetan or Sikkimese term to its translation.
 *
 * Six pairs (twelve cards) per round drawn from a pool of ten, so replaying
 * isn't the identical board each time. Cards show text rather than icons —
 * the point is to learn the vocabulary, and an icon would give the answer
 * away without teaching the word.
 */
export function MantraMatchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<Card[]>(dealCards)
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)

  const isDone = matched.length === PAIRS_PER_ROUND

  // Resolve a pair of flipped cards after a beat so the second card is
  // readable before a wrong pair closes again.
  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped.map((k) => cards.find((c) => c.key === k))
    const isMatch = a && b && a.pairId === b.pairId
    const timer = setTimeout(
      () => {
        if (isMatch && a) setMatched((m) => [...m, a.pairId])
        setFlipped([])
      },
      isMatch ? 420 : 900
    )
    return () => clearTimeout(timer)
  }, [flipped, cards])

  useEffect(() => {
    if (isDone) {
      // Fewer moves scores higher; a perfect round is 6 moves.
      onComplete(Math.max(20, 100 - (moves - PAIRS_PER_ROUND) * 6))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone])

  const onCardClick = (card: Card) => {
    if (flipped.length === 2) return
    if (flipped.includes(card.key)) return
    if (matched.includes(card.pairId)) return
    setFlipped((f) => {
      const nextFlipped = [...f, card.key]
      if (nextFlipped.length === 2) setMoves((m) => m + 1)
      return nextFlipped
    })
  }

  const reset = () => {
    setFlipped([])
    setMatched([])
    setMoves(0)
    setCards(dealCards())
  }

  return (
    <div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Match each term to its meaning. Fewer moves scores higher.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => {
          const isMatched = matched.includes(card.pairId)
          const isFlipped = flipped.includes(card.key) || isMatched

          return (
            <button
              key={card.key}
              onClick={() => onCardClick(card)}
              disabled={isMatched}
              aria-label={isFlipped ? card.label : "Hidden card"}
              className={cn(
                "flex min-h-[5.5rem] items-center justify-center border p-3 text-center transition-colors duration-300",
                isMatched && "border-emerald-600/50 bg-emerald-600/5",
                !isMatched && isFlipped && "border-foreground/40 bg-card",
                !isFlipped &&
                  "border-foreground/15 bg-card hover:border-foreground/40 cursor-pointer"
              )}
            >
              {isFlipped ? (
                <span
                  className={cn(
                    "text-[13px] leading-snug",
                    card.kind === "term"
                      ? "font-display text-base text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {card.label}
                </span>
              ) : (
                <span className="font-mono text-[11px] tracking-widest text-foreground/25">
                  ?
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex items-center gap-4 border-t border-foreground/10 pt-5">
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {matched.length} / {PAIRS_PER_ROUND} matched
        </span>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {moves} moves
        </span>
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-2 border border-foreground/25 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/60"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          {isDone ? "Again" : "Reshuffle"}
        </button>
      </div>

      {isDone && (
        <p className="mt-4 text-sm text-foreground">
          All matched in {moves} moves.
        </p>
      )}
    </div>
  )
}
