"use client"

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
      ranchi: [
        {
          id: "ranchi-1",
          question: "What is Ranchi famously known as?",
          options: ["City of Waterfalls", "Manchester of the East", "City of Lakes", "Garden City"],
          correctAnswer: 0,
          explanation:
            "Ranchi is known as the 'City of Waterfalls' due to numerous beautiful waterfalls in and around the city.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "ranchi-2",
          question: "Which famous temple is located in Ranchi?",
          options: ["Jagannath Temple", "Sun Temple", "Kali Temple", "Shiva Temple"],
          correctAnswer: 0,
          explanation: "The Jagannath Temple in Ranchi is a famous Hindu temple dedicated to Lord Jagannath.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "ranchi-3",
          question: "Ranchi became the capital of Jharkhand in which year?",
          options: ["1999", "2000", "2001", "2002"],
          correctAnswer: 1,
          explanation: "Ranchi became the capital of the newly formed state of Jharkhand on November 15, 2000.",
          difficulty: "hard",
          points: 20,
        },
      ],
      "betla-national-park": [
        {
          id: "betla-1",
          question: "What is the main attraction of Betla National Park?",
          options: ["Bird watching", "Tiger safari", "Rock climbing", "River rafting"],
          correctAnswer: 1,
          explanation: "Betla National Park is famous for its tiger population and offers exciting tiger safaris.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "betla-2",
          question: "Which river flows through Betla National Park?",
          options: ["Koel River", "South Koel River", "Subarnarekha River", "Damodar River"],
          correctAnswer: 1,
          explanation: "The South Koel River flows through Betla National Park, providing water for wildlife.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "betla-3",
          question: "Betla National Park was established in which year?",
          options: ["1986", "1989", "1991", "1994"],
          correctAnswer: 0,
          explanation: "Betla National Park was established in 1986 as part of the Palamau Tiger Reserve.",
          difficulty: "hard",
          points: 20,
        },
      ],
      netarhat: [
        {
          id: "netarhat-1",
          question: "Netarhat is famous for its spectacular what?",
          options: ["Sunset", "Sunrise", "Waterfalls", "Caves"],
          correctAnswer: 1,
          explanation: "Netarhat is renowned for its breathtaking sunrise views from the Sunrise Point.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "netarhat-2",
          question: "What is Netarhat commonly called?",
          options: ["Queen of Chotanagpur", "Hill Station of Jharkhand", "Both A and B", "None of the above"],
          correctAnswer: 2,
          explanation:
            "Netarhat is called both 'Queen of Chotanagpur' and 'Hill Station of Jharkhand' due to its scenic beauty.",
          difficulty: "medium",
          points: 15,
        },
        {
          id: "netarhat-3",
          question: "At what altitude is Netarhat located?",
          options: ["1000 feet", "2000 feet", "3000 feet", "3700 feet"],
          correctAnswer: 3,
          explanation: "Netarhat is located at an altitude of approximately 3,700 feet above sea level.",
          difficulty: "hard",
          points: 20,
        },
      ],
    }

    // Default questions for locations not specifically covered
    const defaultQuestions: QuizQuestion[] = [
      {
        id: "jharkhand-1",
        question: "Jharkhand was carved out of which state?",
        options: ["Bihar", "West Bengal", "Odisha", "Chhattisgarh"],
        correctAnswer: 0,
        explanation: "Jharkhand was carved out of Bihar and became a separate state in 2000.",
        difficulty: "easy",
        points: 10,
      },
      {
        id: "jharkhand-2",
        question: "What is the main tribal community in Jharkhand?",
        options: ["Santal", "Munda", "Oraon", "All of the above"],
        correctAnswer: 3,
        explanation: "Jharkhand is home to various tribal communities including Santal, Munda, and Oraon.",
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white">
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
