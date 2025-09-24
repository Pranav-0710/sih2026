"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Target, Trophy, Clock, Star, X } from "lucide-react"

interface Animal {
  id: string
  name: string
  type: "mammal" | "bird" | "reptile"
  difficulty: "easy" | "medium" | "hard"
  points: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  description: string
  found: boolean
  hint: string
}

interface WildlifeSpottingGameProps {
  isVisible: boolean
  onClose: () => void
  locationId: string
  onComplete: (score: number) => void
}

export function WildlifeSpottingGame({ isVisible, onClose, locationId, onComplete }: WildlifeSpottingGameProps) {
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu")
  const [animals, setAnimals] = useState<Animal[]>([])
  const [foundAnimals, setFoundAnimals] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [showHint, setShowHint] = useState<string | null>(null)
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize animals based on location
  useEffect(() => {
    if (locationId === "betla-national-park") {
      setAnimals([
        {
          id: "elephant",
          name: "Asian Elephant",
          type: "mammal",
          difficulty: "easy",
          points: 10,
          position: { x: 25, y: 60 },
          size: { width: 8, height: 6 },
          description: "Large herbivorous mammal with distinctive trunk",
          found: false,
          hint: "Look for the largest animal near the water source",
        },
        {
          id: "tiger",
          name: "Bengal Tiger",
          type: "mammal",
          difficulty: "hard",
          points: 50,
          position: { x: 70, y: 40 },
          size: { width: 4, height: 3 },
          description: "Apex predator with distinctive orange and black stripes",
          found: false,
          hint: "The king of the jungle hides in the tall grass",
        },
        {
          id: "peacock",
          name: "Indian Peacock",
          type: "bird",
          difficulty: "medium",
          points: 25,
          position: { x: 45, y: 30 },
          size: { width: 3, height: 4 },
          description: "Colorful bird known for its magnificent tail feathers",
          found: false,
          hint: "A splash of blue and green among the trees",
        },
        {
          id: "deer",
          name: "Spotted Deer",
          type: "mammal",
          difficulty: "easy",
          points: 15,
          position: { x: 60, y: 70 },
          size: { width: 3, height: 3 },
          description: "Graceful herbivore with white spots on brown coat",
          found: false,
          hint: "Gentle creatures grazing in the open meadow",
        },
        {
          id: "hornbill",
          name: "Great Hornbill",
          type: "bird",
          difficulty: "medium",
          points: 30,
          position: { x: 15, y: 20 },
          size: { width: 2, height: 3 },
          description: "Large bird with distinctive curved beak and casque",
          found: false,
          hint: "Listen for the whooshing sound of large wings overhead",
        },
        {
          id: "langur",
          name: "Hanuman Langur",
          type: "mammal",
          difficulty: "medium",
          points: 20,
          position: { x: 80, y: 25 },
          size: { width: 2, height: 3 },
          description: "Gray monkey with long tail and black face",
          found: false,
          hint: "Playful primates swinging through the canopy",
        },
      ])
    } else {
      // Default animals for other locations
      setAnimals([
        {
          id: "bird1",
          name: "Local Bird",
          type: "bird",
          difficulty: "easy",
          points: 10,
          position: { x: 30, y: 40 },
          size: { width: 2, height: 2 },
          description: "Common bird species in this region",
          found: false,
          hint: "Small creatures that sing in the morning",
        },
        {
          id: "butterfly",
          name: "Butterfly",
          type: "reptile",
          difficulty: "medium",
          points: 15,
          position: { x: 65, y: 55 },
          size: { width: 1, height: 1 },
          description: "Colorful flying insect",
          found: false,
          hint: "Delicate wings flutter among the flowers",
        },
      ])
    }
  }, [locationId])

  // Game timer
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("completed")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState])

  // Check if all animals are found
  useEffect(() => {
    if (gameState === "playing" && foundAnimals.length === animals.length && animals.length > 0) {
      setGameState("completed")
      // Bonus points for completing early
      const timeBonus = Math.floor(timeLeft / 10) * 5
      setScore((prev) => prev + timeBonus)
    }
  }, [foundAnimals, animals, gameState, timeLeft])

  const startGame = () => {
    setGameState("playing")
    setFoundAnimals([])
    setScore(0)
    setTimeLeft(120)
    setShowHint(null)
    setClickPosition(null)
    // Reset animals found status
    setAnimals((prev) => prev.map((animal) => ({ ...animal, found: false })))
  }

  const handleGameAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setClickPosition({ x, y })

    // Check if click is on any animal
    const clickedAnimal = animals.find((animal) => {
      const { position, size } = animal
      return (
        !animal.found &&
        x >= position.x - size.width / 2 &&
        x <= position.x + size.width / 2 &&
        y >= position.y - size.height / 2 &&
        y <= position.y + size.height / 2
      )
    })

    if (clickedAnimal) {
      // Animal found!
      setFoundAnimals((prev) => [...prev, clickedAnimal.id])
      setScore((prev) => prev + clickedAnimal.points)
      setAnimals((prev) => prev.map((animal) => (animal.id === clickedAnimal.id ? { ...animal, found: true } : animal)))

      // Show success feedback
      setTimeout(() => setClickPosition(null), 1000)
    } else {
      // Miss - show click position briefly
      setTimeout(() => setClickPosition(null), 500)
    }
  }

  const getHint = () => {
    const unFoundAnimals = animals.filter((animal) => !animal.found)
    if (unFoundAnimals.length > 0) {
      const randomAnimal = unFoundAnimals[Math.floor(Math.random() * unFoundAnimals.length)]
      setShowHint(randomAnimal.hint)
      setTimeout(() => setShowHint(null), 5000)
    }
  }

  const handleComplete = () => {
    onComplete(score)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-4xl h-full max-h-[90vh] bg-gray-900 border-gray-700 text-white overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  Wildlife Spotting Challenge
                </h2>
                <p className="text-sm text-gray-400">Find all the hidden animals in the scene</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Game Menu */}
          {gameState === "menu" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Ready to Spot Wildlife?</h3>
                <p className="text-gray-400 mb-6">
                  Test your observation skills! Find all {animals.length} hidden animals in the scene. Click on them
                  when you spot them. You have 2 minutes to complete the challenge.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-primary font-semibold">Animals to Find</div>
                    <div className="text-2xl font-bold">{animals.length}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-primary font-semibold">Time Limit</div>
                    <div className="text-2xl font-bold">2:00</div>
                  </div>
                </div>
                <Button onClick={startGame} className="bg-primary hover:bg-primary/90">
                  Start Challenge
                </Button>
              </div>
            </div>
          )}

          {/* Game Playing */}
          {gameState === "playing" && (
            <>
              {/* Game Stats */}
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{score} points</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>
                        {foundAnimals.length}/{animals.length} found
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className={timeLeft < 30 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getHint}
                    className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                  >
                    Get Hint
                  </Button>
                </div>
              </div>

              {/* Hint Display */}
              {showHint && (
                <div className="p-3 bg-primary/20 border-b border-primary/30">
                  <p className="text-sm text-center">💡 Hint: {showHint}</p>
                </div>
              )}

              {/* Game Area */}
              <div
                ref={gameAreaRef}
                className="flex-1 relative bg-gradient-to-b from-sky-200 to-green-300 cursor-crosshair overflow-hidden"
                onClick={handleGameAreaClick}
                style={{
                  backgroundImage:
                    locationId === "betla-national-park"
                      ? "url('/vr-assets/public/betla-national-park-forest-with-tigers-and-elephan.png')"
                      : "url('/vr-assets/public/jharkhand-landscape-with-lush-green-forests-waterf.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Animals (invisible clickable areas) */}
                {animals.map((animal) => (
                  <div
                    key={animal.id}
                    className={`absolute transition-all duration-300 ${
                      animal.found ? "bg-green-500/30 border-2 border-green-500 rounded-lg" : "hover:bg-white/10"
                    }`}
                    style={{
                      left: `${animal.position.x - animal.size.width / 2}%`,
                      top: `${animal.position.y - animal.size.height / 2}%`,
                      width: `${animal.size.width}%`,
                      height: `${animal.size.height}%`,
                    }}
                  >
                    {animal.found && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                        {animal.name} (+{animal.points})
                      </div>
                    )}
                  </div>
                ))}

                {/* Click feedback */}
                {clickPosition && (
                  <div
                    className="absolute w-8 h-8 border-2 border-white rounded-full animate-ping pointer-events-none"
                    style={{
                      left: `${clickPosition.x}%`,
                      top: `${clickPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                {/* Instructions overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-sm text-white">Click on animals when you spot them!</p>
                </div>
              </div>

              {/* Animal List */}
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <h4 className="text-sm font-semibold mb-2">Animals to Find:</h4>
                <div className="flex flex-wrap gap-2">
                  {animals.map((animal) => (
                    <Badge
                      key={animal.id}
                      variant={animal.found ? "default" : "outline"}
                      className={`${animal.found ? "bg-green-500 text-white" : "border-gray-600 text-gray-400"}`}
                    >
                      {animal.name} ({animal.points}pts)
                      {animal.found && <Star className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Game Completed */}
          {gameState === "completed" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
                <p className="text-gray-400 mb-6">
                  You found {foundAnimals.length} out of {animals.length} animals
                </p>

                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">{score} Points</div>
                  <div className="text-sm text-gray-400">
                    {foundAnimals.length === animals.length ? "Perfect Score!" : "Good effort!"}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={startGame}
                    className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                  >
                    Play Again
                  </Button>
                  <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90">
                    Continue Exploring
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
