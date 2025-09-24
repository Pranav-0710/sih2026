import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Clock, Star, Trophy, Lightbulb } from "lucide-react"

interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: "flora" | "fauna" | "conservation" | "geography"
  timeLimit: number
}

interface WildlifeTriviaProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: "q1",
    question: "Which is the state bird of Jharkhand?",
    options: ["Peacock", "Asian Koel", "Hornbill", "Kingfisher"],
    correctAnswer: 1,
    explanation: "The Asian Koel is the state bird of Jharkhand, known for its distinctive call during monsoon season.",
    points: 10,
    difficulty: "easy",
    category: "fauna",
    timeLimit: 15,
  },
  {
    id: "q2",
    question: "What is the main tree species found in Jharkhand's Sal forests?",
    options: ["Teak", "Sal", "Bamboo", "Eucalyptus"],
    correctAnswer: 1,
    explanation:
      "Sal (Shorea robusta) is the dominant tree species in Jharkhand's forests, covering about 23% of the state.",
    points: 15,
    difficulty: "medium",
    category: "flora",
    timeLimit: 20,
  },
  {
    id: "q3",
    question: "Which national park in Jharkhand is famous for its tiger population?",
    options: ["Betla National Park", "Hazaribagh National Park", "Dalma Wildlife Sanctuary", "Palamau Tiger Reserve"],
    correctAnswer: 3,
    explanation: "Palamau Tiger Reserve is one of the oldest tiger reserves in India, established in 1974.",
    points: 20,
    difficulty: "hard",
    category: "conservation",
    timeLimit: 25,
  },
  {
    id: "q4",
    question: "What percentage of Jharkhand is covered by forests?",
    options: ["15%", "23%", "29%", "35%"],
    correctAnswer: 2,
    explanation: "Approximately 29% of Jharkhand is covered by forests, making it one of India's most forested states.",
    points: 15,
    difficulty: "medium",
    category: "geography",
    timeLimit: 20,
  },
  {
    id: "q5",
    question: "Which endangered species is found in Jharkhand's Dalma Wildlife Sanctuary?",
    options: ["Snow Leopard", "Asian Elephant", "One-horned Rhinoceros", "Red Panda"],
    correctAnswer: 1,
    explanation: "Dalma Wildlife Sanctuary is home to Asian Elephants and serves as an important elephant corridor.",
    points: 25,
    difficulty: "hard",
    category: "fauna",
    timeLimit: 25,
  },
  {
    id: "q6",
    question: "Which medicinal plant commonly found in Jharkhand is known as 'Indian Ginseng'?",
    options: ["Neem", "Ashwagandha", "Tulsi", "Aloe Vera"],
    correctAnswer: 1,
    explanation:
      "Ashwagandha, also known as Indian Ginseng, grows wild in Jharkhand and has numerous medicinal properties.",
    points: 20,
    difficulty: "hard",
    category: "flora",
    timeLimit: 25,
  },
  {
    id: "q7",
    question: "What is the main threat to wildlife in Jharkhand?",
    options: ["Climate change", "Habitat loss", "Poaching", "All of the above"],
    correctAnswer: 3,
    explanation:
      "Wildlife in Jharkhand faces multiple threats including habitat loss, poaching, and climate change effects.",
    points: 15,
    difficulty: "medium",
    category: "conservation",
    timeLimit: 20,
  },
  {
    id: "q8",
    question: "Which river system is most important for Jharkhand's biodiversity?",
    options: ["Ganges", "Damodar", "Subarnarekha", "All of the above"],
    correctAnswer: 3,
    explanation: "All these river systems support diverse ecosystems and are crucial for Jharkhand's biodiversity.",
    points: 10,
    difficulty: "easy",
    category: "geography",
    timeLimit: 15,
  },
]

export function WildlifeTrivia({ onBack, onScoreUpdate }: WildlifeTriviaProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "answered" | "completed">("playing")
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  const currentQuestion = triviaQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= triviaQuestions.length - 1

  // Timer effect
  useEffect(() => {
    if (gameStatus !== "playing" || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null) // Time's up
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus, timeLeft])

  // Initialize timer for new question
  useEffect(() => {
    if (currentQuestion && gameStatus === "playing") {
      setTimeLeft(currentQuestion.timeLimit)
    }
  }, [currentQuestion, gameStatus])

  const handleAnswer = (answerIndex: number | null) => {
    if (gameStatus !== "playing") return

    setSelectedAnswer(answerIndex)
    setGameStatus("answered")

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    let points = 0

    if (isCorrect) {
      // Calculate points based on difficulty and time remaining
      const basePoints = currentQuestion.points
      const timeBonus = Math.floor((timeLeft / currentQuestion.timeLimit) * 10)
      points = basePoints + timeBonus

      setCorrectAnswers((prev) => prev + 1)
      setStreak((prev) => {
        const newStreak = prev + 1
        setMaxStreak((max) => Math.max(max, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    setScore((prev) => prev + points)

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (isLastQuestion) {
        setGameStatus("completed")
        onScoreUpdate(score + points)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setGameStatus("playing")
      }
    }, 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "flora":
        return "bg-green-500"
      case "fauna":
        return "bg-blue-500"
      case "conservation":
        return "bg-purple-500"
      case "geography":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (gameStatus === "completed") {
    const accuracy = (correctAnswers / triviaQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-4 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>You've tested your knowledge of Jharkhand's wildlife!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {correctAnswers}/{triviaQuestions.length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{accuracy.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-3">{maxStreak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onBack} className="flex-1">
                Back to Games
              </Button>
              <Button
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setScore(0)
                  setCorrectAnswers(0)
                  setStreak(0)
                  setMaxStreak(0)
                  setSelectedAnswer(null)
                  setGameStatus("playing")
                }}
                variant="outline"
                className="flex-1"
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {streak} Streak
            </Badge>
            <Badge variant={timeLeft <= 5 ? "destructive" : "default"} className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {timeLeft}s
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Wildlife Trivia Challenge
            </CardTitle>
            <CardDescription>Test your knowledge about Jharkhand's amazing flora and fauna!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Progress:</span>
                <Progress value={((currentQuestionIndex + 1) / triviaQuestions.length) * 100} className="w-48" />
                <span className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1}/{triviaQuestions.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
                <Badge className={`${getCategoryColor(currentQuestion.category)} text-white`}>
                  {currentQuestion.category}
                </Badge>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {currentQuestion.points} pts
              </Badge>
            </div>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={gameStatus !== "playing"}
                variant={
                  gameStatus === "answered"
                    ? index === currentQuestion.correctAnswer
                      ? "default"
                      : index === selectedAnswer
                        ? "destructive"
                        : "outline"
                    : "outline"
                }
                className={`w-full justify-start text-left p-4 h-auto ${
                  gameStatus === "answered" && index === currentQuestion.correctAnswer
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : gameStatus === "answered" && index === selectedAnswer && index !== currentQuestion.correctAnswer
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : ""
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}

            {gameStatus === "answered" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{currentQuestionIndex + 1 - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{streak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-chart-3">{maxStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
