import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowUpRight, CalendarClock, Languages, HelpCircle } from "lucide-react"
import PageLayout from "@/components/PageLayout"
import ScrollReveal from "@/components/ScrollReveal"
import { TimelineGame } from "@/components/games/TimelineGame"
import { MantraMatchGame } from "@/components/games/MantraMatchGame"
import { CircuitQuizGame } from "@/components/games/CircuitQuizGame"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next";

type GameId = "timeline" | "mantra" | "quiz"

interface GameMeta {
  id: GameId
  index: string
  title: string
  tagline: string
  description: string
  icon: typeof CalendarClock
}

/**
 * The Sikkim Game Corner.
 *
 * Three games rather than a large grid of shallow ones: each has a distinct
 * mechanic (ordering, memory pairs, multiple choice) and each teaches
 * something specific from the monastery content — founding chronology,
 * Tibetan and Sikkimese vocabulary, and general recall.
 *
 * Scores are intentionally per-session and not persisted. There is no
 * backend for them, and a leaderboard that silently resets on refresh
 * would be worse than none.
 */
const GAMES: GameMeta[] = [
  {
    id: "timeline",
    index: "01",
    title: "Four Centuries",
    tagline: "Ordering",
    description:
      "Place the four monasteries in the order they were founded, from 1641 to 1909.",
    icon: CalendarClock,
  },
  {
    id: "mantra",
    index: "02",
    title: "Term & Meaning",
    tagline: "Memory pairs",
    description:
      "Match Tibetan and Sikkimese terms to their translations — from Pemayangtse to Thongwa Rangdrol.",
    icon: Languages,
  },
  {
    id: "quiz",
    index: "03",
    title: "The Circuit Quiz",
    tagline: "Multiple choice",
    description:
      "Eight questions drawn from all four monasteries, shuffled each round.",
    icon: HelpCircle,
  },
]

const Games = () => {
  const { t } = useTranslation()
  const [active, setActive] = useState<GameId | null>(null)
  const [scores, setScores] = useState<Partial<Record<GameId, number>>>({})

  const activeGame = GAMES.find((g) => g.id === active)

  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-20 md:py-28">
        <ScrollReveal className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="prayer-flags prayer-flags-lg" aria-hidden><span /><span /><span /><span /><span /></span>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-heritage">
              {t("games.label", "Game Corner")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!activeGame ? (
              <motion.div
                key="index"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
                  <h1 className="font-display text-4xl tracking-tight text-foreground md:col-span-7 md:text-5xl">
                    {t("games.title", "Learn the circuit by playing it")}
                  </h1>
                  <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-2">
                    {t("games.subtitle", "Three short games built from the same sourced monastery content as the tours — chronology, vocabulary and recall.")}
                  </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setActive(game.id)}
                      className="group flex min-h-[15rem] flex-col justify-between border border-foreground/10 bg-card p-6 text-left transition-colors duration-500 hover:border-foreground/35"
                    >
                      <div className="flex items-start justify-between">
                        <game.icon
                          className="h-5 w-5 text-foreground/70"
                          strokeWidth={1.5}
                        />
                        <span className="font-mono text-[11px] tabular-nums tracking-widest text-foreground/30">
                          {game.index}
                        </span>
                      </div>

                      <div className="mt-10">
                        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-heritage">
                          {t("games." + game.id + ".tagline", game.tagline)}
                        </p>
                        <h2 className="mt-2 font-display text-xl tracking-tight text-foreground">
                          {t("games." + game.id + ".title", game.title)}
                        </h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                          {t("games." + game.id + ".description", game.description)}
                        </p>

                        <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-3.5">
                          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70">
                            {scores[game.id] !== undefined ? t("common.best", "Best {{score}}", { score: scores[game.id] }) : t("common.play", "Play")}
                          </span>
                          <ArrowUpRight
                            className="h-4 w-4 text-foreground/50 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeGame.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-foreground/10 pt-8">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-heritage">
                      {t("games." + activeGame.id + ".tagline", activeGame.tagline)}
                    </p>
                    <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground md:text-4xl">
                      {t("games." + activeGame.id + ".title", activeGame.title)}
                    </h1>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <ArrowLeft
                      className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:-translate-x-0.5"
                      strokeWidth={1.5}
                    />
                    {t("common.allGames", "All games")}
                  </button>
                </div>

                <div className={cn("mt-10 max-w-3xl")}>
                  {activeGame.id === "timeline" && (
                    <TimelineGame
                      onComplete={(s) =>
                        setScores((prev) => ({
                          ...prev,
                          timeline: Math.max(prev.timeline ?? 0, s),
                        }))
                      }
                    />
                  )}
                  {activeGame.id === "mantra" && (
                    <MantraMatchGame
                      onComplete={(s) =>
                        setScores((prev) => ({
                          ...prev,
                          mantra: Math.max(prev.mantra ?? 0, s),
                        }))
                      }
                    />
                  )}
                  {activeGame.id === "quiz" && (
                    <CircuitQuizGame
                      onComplete={(s) =>
                        setScores((prev) => ({
                          ...prev,
                          quiz: Math.max(prev.quiz ?? 0, s),
                        }))
                      }
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </PageLayout>
  )
}

export default Games
