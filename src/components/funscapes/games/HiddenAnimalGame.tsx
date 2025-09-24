"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Eye, Target, Clock, Star, Trophy, ZoomIn, ZoomOut, Volume2, Award } from "lucide-react"

interface Animal {
  id: string
  name: string
  position: { x: number; y: number }
  found: boolean
  fact: string
  points: number
  audioNarration: string
}

interface HiddenAnimalGameProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const animals: Animal[] = [
  {
    id: "elephant",
    name: "Asian Elephant",
    position: { x: 15, y: 25 },
    found: false,
    fact: "Asian elephants in Jharkhand are smaller than African elephants and have smaller ears.",
    points: 25,
    audioNarration:
      "The majestic Asian elephant roams through Jharkhand's dense forests, using its trunk to communicate with other elephants.",
  },
  {
    id: "tiger",
    name: "Bengal Tiger",
    position: { x: 65, y: 40 },
    found: false,
    fact: "Jharkhand is home to several tiger reserves including Palamau Tiger Reserve.",
    points: 30,
    audioNarration:
      "The Bengal tiger, apex predator of Jharkhand, silently stalks through the undergrowth with incredible stealth.",
  },
  {
    id: "leopard",
    name: "Indian Leopard",
    position: { x: 80, y: 15 },
    found: false,
    fact: "Leopards are excellent climbers and often rest in trees during the day.",
    points: 25,
    audioNarration: "The elusive Indian leopard prefers the rocky terrain and dense canopy of Jharkhand's hills.",
  },
  {
    id: "deer",
    name: "Spotted Deer",
    position: { x: 35, y: 60 },
    found: false,
    fact: "Also known as Chital, these deer are commonly found in Jharkhand's forests.",
    points: 15,
    audioNarration:
      "The graceful spotted deer, with its distinctive white spots, grazes peacefully in Jharkhand's meadows.",
  },
  {
    id: "peacock",
    name: "Indian Peacock",
    position: { x: 50, y: 20 },
    found: false,
    fact: "The national bird of India, peacocks are abundant in Jharkhand's rural areas.",
    points: 20,
    audioNarration: "The vibrant Indian peacock displays its magnificent plumage during monsoon season in Jharkhand.",
  },
]

export function HiddenAnimalGame({ onBack, onScoreUpdate }: HiddenAnimalGameProps) {
  const [gameAnimals, setGameAnimals] = useState<Animal[]>(animals)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [gameStatus, setGameStatus] = useState<"playing" | "completed" | "timeout">("playing")
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [badges, setBadges] = useState<string[]>([])
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false)

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
    const foundAnimals = gameAnimals.filter((animal) => animal.found).length
    if (foundAnimals === gameAnimals.length && gameStatus === "playing") {
      setGameStatus("completed")
      onScoreUpdate(score)
      if (!badges.includes("Master Spotter")) {
        setBadges((prev) => [...prev, "Master Spotter"])
      }
    }
  }, [gameAnimals, gameStatus, score, onScoreUpdate, badges])

  const handleAnimalClick = useCallback(
    (clickedAnimal: Animal) => {
      if (clickedAnimal.found || gameStatus !== "playing") return

      const newScore = score + clickedAnimal.points
      setScore(newScore)
      setSelectedAnimal(clickedAnimal)

      setGameAnimals((prev) =>
        prev.map((animal) => (animal.id === clickedAnimal.id ? { ...animal, found: true } : animal)),
      )

      const timeElapsed = 120 - timeLeft
      if (timeElapsed < 10 && !badges.includes("Lightning Fast")) {
        setBadges((prev) => [...prev, "Lightning Fast"])
      } else if (timeElapsed < 30 && !badges.includes("Quick Eye")) {
        setBadges((prev) => [...prev, "Quick Eye"])
      }

      setTimeout(() => setSelectedAnimal(null), 3000)
    },
    [score, gameStatus, timeLeft, badges],
  )

  const playNarration = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsNarrationPlaying(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.onend = () => setIsNarrationPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus !== "playing") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const clickedAnimal = gameAnimals.find((animal) => {
      if (animal.found) return false
      const distance = Math.sqrt(Math.pow(x - animal.position.x, 2) + Math.pow(y - animal.position.y, 2))
      return distance < 8 / zoomLevel
    })

    if (clickedAnimal) {
      handleAnimalClick(clickedAnimal)
      playNarration(clickedAnimal.audioNarration)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const foundCount = gameAnimals.filter((animal) => animal.found).length
  const progress = (foundCount / gameAnimals.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
            <Badge variant={timeLeft < 30 ? "destructive" : "default"} className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              {zoomLevel}x Zoom
            </Badge>
          </div>
        </div>

        {/* Game Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Find the Hidden Animals - Enhanced 360° Experience
            </CardTitle>
            <CardDescription>
              Use zoom controls to explore the forest scene and click on camouflaged animals. Listen to audio narration
              and earn badges for quick spotting!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Progress:</span>
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {foundCount}/{gameAnimals.length} found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleZoomOut} disabled={zoomLevel <= 1} variant="outline" size="sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button onClick={handleZoomIn} disabled={zoomLevel >= 3} variant="outline" size="sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  {showHint ? "Hide Hints" : "Show Hints"}
                </Button>
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
                <div className="relative cursor-crosshair overflow-hidden" onClick={handleImageClick}>
                  <div
                    className="transition-transform duration-300 origin-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <img
                      src="/images/funscapes/dense-forest-with-hidden-animals-in-jharkhand.jpg"
                      alt="Dense forest scene with hidden animals"
                      className="w-full h-[500px] object-cover"
                    />

                    {/* Animal markers */}
                    {gameAnimals.map((animal) => (
                      <div
                        key={animal.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                          animal.found ? "animate-pulse" : showHint ? "animate-bounce" : ""
                        }`}
                        style={{
                          left: `${animal.position.x}%`,
                          top: `${animal.position.y}%`,
                        }}
                      >
                        {animal.found ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <Star className="h-4 w-4 text-white fill-white" />
                          </div>
                        ) : showHint ? (
                          <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg opacity-70" />
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {/* Game Over Overlay */}
                  {gameStatus !== "playing" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card className="text-center">
                        <CardHeader>
                          <CardTitle className="text-2xl">
                            {gameStatus === "completed" ? "Congratulations!" : "Time's Up!"}
                          </CardTitle>
                          <CardDescription>
                            {gameStatus === "completed"
                              ? `You found all animals and scored ${score} points!`
                              : `You found ${foundCount} out of ${gameAnimals.length} animals.`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={onBack} className="mr-2">
                            Back to Games
                          </Button>
                          <Button
                            onClick={() => {
                              setGameAnimals(animals.map((a) => ({ ...a, found: false })))
                              setScore(0)
                              setTimeLeft(120)
                              setGameStatus("playing")
                              setSelectedAnimal(null)
                              setZoomLevel(1)
                              setBadges([])
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
            {badges.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} className="bg-yellow-600 text-white">
                      {badge}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Animal List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Animals to Find</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gameAnimals.map((animal) => (
                  <div
                    key={animal.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      animal.found ? "bg-green-100 text-green-800" : "bg-muted"
                    }`}
                  >
                    <span className={`font-medium ${animal.found ? "line-through" : ""}`}>{animal.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {animal.points}pts
                      </Badge>
                      {animal.found && <Star className="h-4 w-4 text-green-600 fill-green-600" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Animal Info */}
            {selectedAnimal && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center justify-between">
                    {selectedAnimal.name} Found!
                    <Button
                      onClick={() => playNarration(selectedAnimal.audioNarration)}
                      disabled={isNarrationPlaying}
                      variant="outline"
                      size="sm"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-3">{selectedAnimal.fact}</p>
                  <Badge className="bg-green-600">+{selectedAnimal.points} points</Badge>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use zoom controls to explore the 360° forest scene</p>
                <p>• Click on animals hidden in the forest scene</p>
                <p>• Listen to audio narration about each animal</p>
                <p>• Use the hint button if you're stuck</p>
                <p>• Earn badges for quick spotting!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}