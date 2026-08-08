import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle, Trophy, X } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

interface TriviaQuizProps {
  isVisible: boolean
  onClose: () => void
  locationId: string
  locationName: string
  onComplete: (score: number) => void
}

export function TriviaQuiz({ isVisible, onClose, locationId, locationName, onComplete }: TriviaQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu")

  // Initialize questions based on location
  useEffect(() => {
    const questionSets: Record<string, QuizQuestion[]> = {
      rumtek: [
        {
          id: "rumtek-1",
          question: "Rumtek Monastery is the principal seat of which Buddhist lineage?",
          options: ["Gelug", "Karma Kagyu", "Sakya", "Nyingma"],
          correctAnswer: 1,
          explanation:
            "Rumtek is the main seat of the Karma Kagyu order outside Tibet, established there by the 16th Karmapa.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "rumtek-2",
          question: "By what formal name is Rumtek Monastery also known?",
          options: ["Zangdok Palri", "Dharma Chakra Centre", "Thongwa Rangdrol", "Pemayangtse Gompa"],
          correctAnswer: 1,
          explanation:
            "Rumtek is formally called the Dharma Chakra Centre, meaning the centre of the wheel of dharma.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "rumtek-3",
          question: "In which year was the rebuilt Rumtek Monastery completed by the 16th Karmapa?",
          options: ["1959", "1962", "1966", "1971"],
          correctAnswer: 2,
          explanation:
            "After fleeing Tibet in 1959, the 16th Karmapa rebuilt Rumtek, completing construction in 1966.",
          difficulty: "hard",
          points: 20,
        },
      ],
      pemayangtse: [
        {
          id: "pemayangtse-1",
          question: "What does the name 'Pemayangtse' mean?",
          options: ["Perfect Sublime Lotus", "Solitary Temple", "Devoted Central Glory", "Wheel of Dharma"],
          correctAnswer: 0,
          explanation: "Pemayangtse translates as 'Perfect Sublime Lotus', a reference to Guru Padmasambhava.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "pemayangtse-2",
          question: "Pemayangtse Monastery belongs to which order of Tibetan Buddhism?",
          options: ["Kagyu", "Gelug", "Nyingma", "Sakya"],
          correctAnswer: 2,
          explanation:
            "Pemayangtse follows the Nyingma order and historically held authority over Sikkim's other Nyingma monasteries.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "pemayangtse-3",
          question: "In which year was Pemayangtse formally established at its present hilltop site?",
          options: ["1641", "1705", "1840", "1909"],
          correctAnswer: 1,
          explanation:
            "Founded as a shrine around 1650, Pemayangtse was established as a monastery at its present site in 1705.",
          difficulty: "hard",
          points: 20,
        },
      ],
      tashiding: [
        {
          id: "tashiding-1",
          question: "Tashiding Monastery is widely regarded as what?",
          options: [
            "The largest monastery in Sikkim",
            "The holiest monastery in Sikkim",
            "The newest monastery in Sikkim",
            "The highest monastery in Sikkim",
          ],
          correctAnswer: 1,
          explanation: "Tashiding is held by many Sikkimese Buddhists to be the holiest monastery in the state.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "tashiding-2",
          question: "During the Bumchu festival, what is read as a prophecy for the coming year?",
          options: [
            "The direction of the wind",
            "The water level in a sacred vase",
            "The number of pilgrims present",
            "The colour of the dawn sky",
          ],
          correctAnswer: 1,
          explanation:
            "A sacred vase of holy water is opened during Bumchu, and its level is read as a forecast for Sikkim's year.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "tashiding-3",
          question: "In which year was Tashiding Monastery founded?",
          options: ["1641", "1705", "1734", "1909"],
          correctAnswer: 0,
          explanation:
            "Tashiding was founded in 1641 by Ngadak Sempa Chempo Phunshok Rigzing of the Nyingma school.",
          difficulty: "hard",
          points: 20,
        },
      ],
      enchey: [
        {
          id: "enchey-1",
          question: "What does the name 'Enchey' mean?",
          options: ["The Golden Roof", "The Solitary Temple", "The Sacred Vase", "The Lotus Throne"],
          correctAnswer: 1,
          explanation: "Enchey means 'the solitary temple', reflecting its isolated ridge-top setting above Gangtok.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "enchey-2",
          question: "Which masked dance performed at Enchey represents the snow lion?",
          options: ["Singhe Chaam", "Pang Lhabsol", "Bumchu", "Losar"],
          correctAnswer: 0,
          explanation: "The Singhe Chaam, or snow lion dance, is among the masked dances performed at Enchey.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "enchey-3",
          question: "In which year was the present Enchey Monastery constructed?",
          options: ["1840", "1875", "1909", "1932"],
          correctAnswer: 2,
          explanation:
            "The present monastery was built in 1909 under Sidkeong Tulku, in a distinctive Chinese pagoda style.",
          difficulty: "hard",
          points: 20,
        },
      ],
    }

    // Default questions for locations not specifically covered
    const defaultQuestions: QuizQuestion[] = [
      {
        id: "sikkim-1",
        question: "Which mountain is revered in Sikkim as the state's guardian deity?",
        options: ["Everest", "Kanchenjunga", "Nanda Devi", "Annapurna"],
        correctAnswer: 1,
        explanation:
          "Kanchenjunga is venerated as Sikkim's protective deity and is honoured in the Pang Lhabsol festival.",
        difficulty: "easy",
        points: 10,
      },
      {
        id: "sikkim-2",
        question: "Which is the oldest order of Tibetan Buddhism, followed by many of Sikkim's earliest monasteries?",
        options: ["Gelug", "Kagyu", "Nyingma", "Sakya"],
        correctAnswer: 2,
        explanation:
          "The Nyingma order is the oldest school of Tibetan Buddhism and shaped Sikkim's earliest monastic foundations.",
        difficulty: "medium",
        points: 15,
      },
    ]

    setQuestions(questionSets[locationId] || defaultQuestions)
    setAnsweredQuestions(new Array(questionSets[locationId]?.length || defaultQuestions.length).fill(false))
  }, [locationId])

  const startQuiz = () => {
    setGameState("playing")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + currentQuestion.points)
    }

    setAnsweredQuestions((prev) => {
      const newAnswered = [...prev]
      newAnswered[currentQuestionIndex] = true
      return newAnswered
    })

    setShowResult(true)

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameState("completed")
      }
    }, 3000)
  }

  const handleComplete = () => {
    onComplete(score)
    onClose()
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!isVisible || questions.length === 0) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-ink border-gray-700 text-white">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  {locationName} Trivia
                </h2>
                <p className="text-sm text-gray-400">Test your knowledge about this amazing location</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quiz Menu */}
          {gameState === "menu" && (
            <div className="p-8 text-center">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Ready for the Quiz?</h3>
              <p className="text-gray-400 mb-6">
                Test your knowledge about {locationName} with {questions.length} questions. Each correct answer earns
                you points based on difficulty level.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-green-500 font-semibold">Easy</div>
                  <div className="text-sm text-gray-400">10 points</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-yellow-500 font-semibold">Medium</div>
                  <div className="text-sm text-gray-400">15 points</div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="text-red-500 font-semibold">Hard</div>
                  <div className="text-sm text-gray-400">20 points</div>
                </div>
              </div>
              <Button onClick={startQuiz} className="bg-primary hover:bg-primary/90">
                Start Quiz
              </Button>
            </div>
          )}

          {/* Quiz Playing */}
          {gameState === "playing" && currentQuestion && (
            <>
              {/* Progress Bar */}
              <div className="p-4 bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{score} points</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={`${
                      currentQuestion.difficulty === "easy"
                        ? "border-green-500 text-green-500"
                        : currentQuestion.difficulty === "medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-red-500 text-red-500"
                    }`}
                  >
                    {currentQuestion.difficulty} • {currentQuestion.points} points
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

                {/* Answer Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                        showResult
                          ? index === currentQuestion.correctAnswer
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                              ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                          : selectedAnswer === index
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            showResult && index === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-500"
                              : showResult &&
                                  index === selectedAnswer &&
                                  selectedAnswer !== currentQuestion.correctAnswer
                                ? "border-red-500 bg-red-500"
                                : selectedAnswer === index
                                  ? "border-primary bg-primary"
                                  : "border-gray-600"
                          }`}
                        >
                          {showResult && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                          {showResult &&
                            index === selectedAnswer &&
                            selectedAnswer !== currentQuestion.correctAnswer && (
                              <XCircle className="h-4 w-4 text-white" />
                            )}
                          {!showResult && selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Result Explanation */}
                {showResult && (
                  <div
                    className={`p-4 rounded-lg mb-4 ${
                      isCorrect
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-red-500/20 border border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-semibold">
                        {isCorrect ? `Correct! +${currentQuestion.points} points` : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Submit Button */}
                {!showResult && (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Quiz Completed */}
          {gameState === "completed" && (
            <div className="p-8 text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-gray-400 mb-6">You've completed the {locationName} trivia quiz</p>

              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <div className="text-4xl font-bold text-primary mb-2">{score}</div>
                <div className="text-lg text-gray-300 mb-2">Total Points</div>
                <div className="text-sm text-gray-400">
                  {Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100)}% Score
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={startQuiz}
                  className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  Retake Quiz
                </Button>
                <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90">
                  Continue Exploring
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
