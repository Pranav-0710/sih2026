import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Check, X } from "lucide-react"
import { locations } from "@/data/monasteries"
import { cn } from "@/lib/utils"

interface QuizItem {
  id: string
  monastery: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * One quiz spanning all four monasteries, assembled from the per-monastery
 * question banks in monasteries.ts rather than a second, separate set of
 * questions — so fixing a question in one place fixes it everywhere it
 * appears, including the in-tour quiz.
 */
/** Flattens every monastery's question bank into one shuffled round. */
const dealQuestions = (): QuizItem[] =>
  shuffle(
    locations.flatMap((loc) =>
      (loc.educationalContent?.quiz ?? []).map((q) => ({
        id: `${loc.id}-${q.id}`,
        monastery: loc.name,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }))
    )
  )

export function CircuitQuizGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [questions, setQuestions] = useState<QuizItem[]>(dealQuestions)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answered = selected !== null

  const choose = (i: number) => {
    if (answered) return
    setSelected(i)
    if (i === question.correctAnswer) setCorrectCount((c) => c + 1)
  }

  const advance = () => {
    if (index === questions.length - 1) {
      // correctCount already includes this question — choose() increments it
      // at answer time, not here.
      setFinished(true)
      onComplete(Math.round((correctCount / questions.length) * 100))
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  const reset = () => {
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
    setQuestions(dealQuestions())
  }

  if (finished) {
    return (
      <div>
        <p className="font-mono text-sm tabular-nums text-muted-foreground">Result</p>
        <p className="mt-3 font-display text-5xl tracking-tight text-foreground">
          {correctCount}
          <span className="text-muted-foreground"> / {questions.length}</span>
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {correctCount === questions.length
            ? "Every question right — you know the circuit."
            : correctCount >= questions.length / 2
              ? "A solid pass. The story tours cover what's left."
              : "Worth running the story tours before trying again."}
        </p>
        <button
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 border border-foreground/25 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/60"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
          Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums tracking-widest text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </span>
        <span className="h-px w-6 bg-primary/60" />
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-primary">
          {question.monastery}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="mt-5 font-display text-xl leading-snug tracking-tight text-foreground md:text-2xl">
            {question.question}
          </h3>

          <div className="mt-7 space-y-2">
            {question.options.map((option, i) => {
              const isCorrect = i === question.correctAnswer
              const isChosen = i === selected
              return (
                <button
                  key={option}
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={cn(
                    "flex w-full items-center gap-4 border px-4 py-3.5 text-left text-sm transition-colors",
                    !answered && "border-foreground/15 hover:border-foreground/45 hover:bg-card",
                    answered && isCorrect && "border-emerald-600/60 bg-emerald-600/5",
                    answered && isChosen && !isCorrect && "border-destructive/60 bg-destructive/5",
                    answered && !isCorrect && !isChosen && "border-foreground/10 opacity-50"
                  )}
                >
                  <span className="font-mono text-[11px] tabular-nums text-foreground/35">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                  {answered && isCorrect && (
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
                  )}
                  {answered && isChosen && !isCorrect && (
                    <X className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                  )}
                </button>
              )
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 border-t border-foreground/10 pt-5"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
              <button
                onClick={advance}
                className="mt-5 border border-foreground/25 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground/60"
              >
                {index === questions.length - 1 ? "See result" : "Next question"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
