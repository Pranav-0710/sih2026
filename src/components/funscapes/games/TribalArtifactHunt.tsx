import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, Puzzle, Clock, Star, Trophy, Lightbulb } from "lucide-react"

interface Artifact {
  id: string
  name: string
  position: { x: number; y: number }
  found: boolean
  description: string
  culturalSignificance: string
  points: number
  puzzle: {
    question: string
    options: string[]
    correctAnswer: number
    hint: string
  }
}

interface TribalArtifactHuntProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const artifacts: Artifact[] = [
  {
    id: "dhol",
    name: "Traditional Dhol",
    position: { x: 25, y: 45 },
    found: false,
    description: "A traditional drum used in tribal festivals and ceremonies",
    culturalSignificance:
      "The dhol is central to tribal music and is believed to connect the community with ancestral spirits during festivals.",
    points: 30,
    puzzle: {
      question: "What is the primary use of a dhol in tribal culture?",
      options: ["Cooking", "Musical ceremonies", "Water storage", "Hunting"],
      correctAnswer: 1,
      hint: "Think about sounds and celebrations",
    },
  },
  {
    id: "mask",
    name: "Ritual Mask",
    position: { x: 70, y: 30 },
    found: false,
    description: "Carved wooden mask used in traditional dance performances",
    culturalSignificance:
      "These masks represent various deities and spirits, worn during ritual dances to invoke blessings and protection.",
    points: 35,
    puzzle: {
      question: "What do tribal masks typically represent?",
      options: ["Animals only", "Deities and spirits", "Weather patterns", "Crop seasons"],
      correctAnswer: 1,
      hint: "They're used in spiritual ceremonies",
    },
  },
  {
    id: "pottery",
    name: "Clay Pottery",
    position: { x: 45, y: 65 },
    found: false,
    description: "Handcrafted clay vessels used for storing water and grains",
    culturalSignificance:
      "Pottery making is a traditional skill passed down through generations, with unique designs representing different tribes.",
    points: 25,
    puzzle: {
      question: "How are traditional pottery designs typically passed down?",
      options: ["Written books", "Through generations", "Government schools", "Online tutorials"],
      correctAnswer: 1,
      hint: "Think about family traditions",
    },
  },
  {
    id: "jewelry",
    name: "Silver Jewelry",
    position: { x: 60, y: 55 },
    found: false,
    description: "Intricate silver ornaments worn during special occasions",
    culturalSignificance:
      "Silver jewelry is not just decorative but also serves as a symbol of social status and tribal identity.",
    points: 40,
    puzzle: {
      question: "Besides decoration, what else does tribal jewelry represent?",
      options: ["Weather prediction", "Social status and identity", "Cooking recipes", "Farming techniques"],
      correctAnswer: 1,
      hint: "It shows your place in the community",
    },
  },
  {
    id: "bow",
    name: "Hunting Bow",
    position: { x: 80, y: 40 },
    found: false,
    description: "Traditional bow made from bamboo and used for hunting",
    culturalSignificance:
      "The bow represents the tribe's connection with nature and their sustainable hunting practices.",
    points: 30,
    puzzle: {
      question: "What does the hunting bow symbolize in tribal culture?",
      options: ["War and conflict", "Connection with nature", "Modern technology", "Agricultural tools"],
      correctAnswer: 1,
      hint: "Think about harmony with the environment",
    },
  },
]

export function TribalArtifactHunt({ onBack, onScoreUpdate }: TribalArtifactHuntProps) {
  const [gameArtifacts, setGameArtifacts] = useState<Artifact[]>(artifacts)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [gameStatus, setGameStatus] = useState<"playing" | "completed" | "timeout">("playing")
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState<Artifact | null>(null)
  const [showHint, setShowHint] = useState(false)

  // Timer effect
  useEffect(() => {
    if (gameStatus !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus("timeout")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus])

  // Check if game is completed
  useEffect(() => {
    const foundArtifacts = gameArtifacts.filter((artifact) => artifact.found).length
    if (foundArtifacts === gameArtifacts.length && gameStatus === "playing") {
      setGameStatus("completed")
      onScoreUpdate(score)
    }
  }, [gameArtifacts, gameStatus, score, onScoreUpdate])

  const handleArtifactClick = useCallback(
    (clickedArtifact: Artifact) => {
      if (clickedArtifact.found || gameStatus !== "playing") return

      setCurrentPuzzle(clickedArtifact)
      setShowPuzzle(true)
      setShowHint(false)
    },
    [gameStatus],
  )

  const handlePuzzleAnswer = (answerIndex: number) => {
    if (!currentPuzzle) return

    const isCorrect = answerIndex === currentPuzzle.puzzle.correctAnswer

    if (isCorrect) {
      const newScore = score + currentPuzzle.points
      setScore(newScore)
      setSelectedArtifact(currentPuzzle)

      setGameArtifacts((prev) =>
        prev.map((artifact) => (artifact.id === currentPuzzle.id ? { ...artifact, found: true } : artifact)),
      )

      setShowPuzzle(false)
      setCurrentPuzzle(null)

      // Auto-close artifact info after 4 seconds
      setTimeout(() => setSelectedArtifact(null), 4000)
    } else {
      // Show hint for wrong answer
      setShowHint(true)
    }
  }

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus !== "playing") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    // Check if click is near any unfound artifact
    const clickedArtifact = gameArtifacts.find((artifact) => {
      if (artifact.found) return false
      const distance = Math.sqrt(Math.pow(x - artifact.position.x, 2) + Math.pow(y - artifact.position.y, 2))
      return distance < 10 // 10% tolerance
    })

    if (clickedArtifact) {
      handleArtifactClick(clickedArtifact)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const foundCount = gameArtifacts.filter((artifact) => artifact.found).length
  const progress = (foundCount / gameArtifacts.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-6xl">
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
            <Badge variant={timeLeft < 60 ? "destructive" : "default"} className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </div>

        {/* Game Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Tribal Artifact Hunt
            </CardTitle>
            <CardDescription>
              Discover cultural artifacts hidden in this traditional tribal village. Click on artifacts and solve
              puzzles to learn about Jharkhand's rich heritage!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Progress:</span>
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {foundCount}/{gameArtifacts.length} found
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Image */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative cursor-crosshair" onClick={handleImageClick}>
                  <img
                    src="/images/funscapes/traditional-tribal-village-in-jharkhand-with-artif.jpg"
                    alt="Traditional tribal village scene"
                    className="w-full h-[500px] object-cover"
                  />

                  {/* Artifact markers */}
                  {gameArtifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                        artifact.found ? "animate-pulse" : "animate-bounce"
                      }`}
                      style={{
                        left: `${artifact.position.x}%`,
                        top: `${artifact.position.y}%`,
                      }}
                    >
                      {artifact.found ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <Star className="h-4 w-4 text-white fill-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-amber-400 rounded-full border-2 border-white shadow-lg opacity-80 hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  ))}

                  {/* Game Over Overlay */}
                  {gameStatus !== "playing" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="text-center">
                        <CardHeader>
                          <CardTitle className="text-2xl">
                            {gameStatus === "completed" ? "Cultural Explorer!" : "Time's Up!"}
                          </CardTitle>
                          <CardDescription>
                            {gameStatus === "completed"
                              ? `You discovered all artifacts and scored ${score} points!`
                              : `You found ${foundCount} out of ${gameArtifacts.length} artifacts.`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={onBack} className="mr-2">
                            Back to Games
                          </Button>
                          <Button
                            onClick={() => {
                              setGameArtifacts(artifacts.map((a) => ({ ...a, found: false })))
                              setScore(0)
                              setTimeLeft(180)
                              setGameStatus("playing")
                              setSelectedArtifact(null)
                              setShowPuzzle(false)
                              setCurrentPuzzle(null)
                            }}
                            variant="outline"
                          >
                            Play Again
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Artifact List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Artifacts to Find</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gameArtifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      artifact.found ? "bg-green-100 text-green-800" : "bg-muted"
                    }`}
                  >
                    <span className={`font-medium ${artifact.found ? "line-through" : ""}`}>{artifact.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {artifact.points}pts
                      </Badge>
                      {artifact.found && <Star className="h-4 w-4 text-green-600 fill-green-600" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Artifact Info */}
            {selectedArtifact && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">{selectedArtifact.name} Discovered!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-2">{selectedArtifact.description}</p>
                  <p className="text-xs text-green-600 mb-3 italic">{selectedArtifact.culturalSignificance}</p>
                  <Badge className="bg-green-600">+{selectedArtifact.points} points</Badge>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Click on glowing artifacts in the village</p>
                <p>• Solve puzzles to collect each artifact</p>
                <p>• Learn about Jharkhand's tribal heritage</p>
                <p>• Find all artifacts before time runs out</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Puzzle Modal */}
        {showPuzzle && currentPuzzle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5 text-primary" />
                  Solve the Puzzle
                </CardTitle>
                <CardDescription>Answer correctly to collect the {currentPuzzle.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{currentPuzzle.puzzle.question}</p>

                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">Hint:</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">{currentPuzzle.puzzle.hint}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {currentPuzzle.puzzle.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handlePuzzleAnswer(index)}
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setShowPuzzle(false)
                      setCurrentPuzzle(null)
                      setShowHint(false)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  {!showHint && (
                    <Button onClick={() => setShowHint(true)} variant="secondary" className="flex-1">
                      Show Hint
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
