"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, Clock, Users, X, ChevronRight } from "lucide-react"

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface EducationalContent {
  history: string
  culture: string
  geography: string
  wildlife?: string
  quiz: Quiz[]
}

interface EducationalPanelProps {
  locationName: string
  content: EducationalContent
  isVisible: boolean
  onClose: () => void
}

export function EducationalPanel({ locationName, content, isVisible, onClose }: EducationalPanelProps) {
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([])

  if (!isVisible) return null

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === content.quiz[currentQuiz].correctAnswer) {
      if (!completedQuizzes.includes(currentQuiz)) {
        setScore((prev) => prev + 1)
        setCompletedQuizzes((prev) => [...prev, currentQuiz])
      }
    }
  }

  const handleNextQuiz = () => {
    if (currentQuiz < content.quiz.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompletedQuizzes([])
  }

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-black/90 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Learn About {locationName}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === "learn" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("learn")}
              className={activeTab === "learn" ? "bg-primary" : "text-white hover:bg-white/20"}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>
            <Button
              variant={activeTab === "quiz" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("quiz")}
              className={activeTab === "quiz" ? "bg-primary" : "text-white hover:bg-white/20"}
            >
              <Award className="h-4 w-4 mr-2" />
              Quiz ({score}/{content.quiz.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          {activeTab === "learn" && (
            <div className="space-y-6">
              {/* History Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Historical Background
                </h3>
                <p className="text-gray-300 leading-relaxed">{content.history}</p>
              </div>

              {/* Culture Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Cultural Significance
                </h3>
                <p className="text-gray-300 leading-relaxed">{content.culture}</p>
              </div>

              {/* Geography Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Geography & Features
                </h3>
                <p className="text-gray-300 leading-relaxed">{content.geography}</p>
              </div>

              {/* Wildlife Section (if applicable) */}
              {content.wildlife && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Wildlife & Ecology
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{content.wildlife}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-4">
              {currentQuiz < content.quiz.length ? (
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        Question {currentQuiz + 1} of {content.quiz.length}
                      </span>
                      <span className="text-sm text-primary">
                        Score: {score}/{content.quiz.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuiz + 1) / content.quiz.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-4">{content.quiz[currentQuiz].question}</h3>

                  <div className="space-y-2 mb-4">
                    {content.quiz[currentQuiz].options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full text-left justify-start p-4 h-auto border-gray-600 text-white hover:bg-white/10 ${
                          selectedAnswer === index
                            ? index === content.quiz[currentQuiz].correctAnswer
                              ? "bg-green-500/20 border-green-500"
                              : "bg-red-500/20 border-red-500"
                            : showResult && index === content.quiz[currentQuiz].correctAnswer
                              ? "bg-green-500/20 border-green-500"
                              : ""
                        }`}
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className="p-4 bg-white/10 rounded-lg mb-4">
                      <p className="text-sm text-gray-300">{content.quiz[currentQuiz].explanation}</p>
                    </div>
                  )}

                  {showResult && currentQuiz < content.quiz.length - 1 && (
                    <Button onClick={handleNextQuiz} className="w-full bg-primary hover:bg-primary/90">
                      Next Question
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                  <p className="text-lg text-gray-300 mb-4">
                    You scored {score} out of {content.quiz.length}
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    {score === content.quiz.length
                      ? "Perfect! You're a Jharkhand expert!"
                      : score >= content.quiz.length * 0.7
                        ? "Great job! You know a lot about this location."
                        : "Good effort! Try exploring more to learn additional facts."}
                  </p>
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-white/10 bg-transparent"
                  >
                    Retake Quiz
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
