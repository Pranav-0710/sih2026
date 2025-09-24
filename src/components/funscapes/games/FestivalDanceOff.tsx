import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Music, Trophy, Zap, RotateCcw, Home, Star, Award } from "lucide-react"

interface FallingTile {
  id: string
  key: string
  lane: number
  position: number
  speed: number
  hit: boolean
  missed: boolean
}

interface GameStats {
  score: number
  combo: number
  accuracy: number
  totalHits: number
  perfectHits: number
  goodHits: number
  missedHits: number
  maxCombo: number
}

interface FestivalDanceOffProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
  onGameComplete: () => void
}

const LANES = 5
const TILE_HEIGHT = 80
const GAME_HEIGHT = 600
const TARGET_ZONE = GAME_HEIGHT - 100

const keyMappings = [
  { key: "ArrowLeft", lane: 0, symbol: "←", sound: 261.63, name: "Left Step" },
  { key: "ArrowDown", lane: 1, symbol: "↓", sound: 293.66, name: "Crouch" },
  { key: "ArrowUp", lane: 2, symbol: "↑", sound: 329.63, name: "Jump" },
  { key: "ArrowRight", lane: 3, symbol: "→", sound: 349.23, name: "Right Step" },
  { key: " ", lane: 4, symbol: "⟲", sound: 392.0, name: "Spin" },
]

const difficulties = {
  easy: { speed: 2, spawnRate: 1500, name: "Easy", description: "Slow beats, fewer tiles" },
  medium: { speed: 3, spawnRate: 1200, name: "Medium", description: "Moderate speed" },
  hard: { speed: 4, spawnRate: 800, name: "Hard", description: "Fast tribal beats" },
}

export function FestivalDanceOff({ onBack, onScoreUpdate, onGameComplete }: FestivalDanceOffProps) {
  const [gameState, setGameState] = useState<"menu" | "tutorial" | "playing" | "paused" | "gameOver" | "completed">(
    "menu",
  )
  const [difficulty, setDifficulty] = useState<keyof typeof difficulties>("easy")
  const [tutorialStep, setTutorialStep] = useState(0)
  const [tiles, setTiles] = useState<FallingTile[]>([])
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    accuracy: 100,
    totalHits: 0,
    perfectHits: 0,
    goodHits: 0,
    missedHits: 0,
    maxCombo: 0,
  })
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [gameTime, setGameTime] = useState(0)
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const gameLoopRef = useRef<number>()
  const spawnTimerRef = useRef<number>()
  const nextTileId = useRef(0)

  const playTribalSound = useCallback((frequency: number, isHit = true) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filterNode = audioContext.createBiquadFilter()

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Tribal drum-like sound
      oscillator.type = isHit ? "sawtooth" : "sine"
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

      filterNode.type = "lowpass"
      filterNode.frequency.setValueAtTime(isHit ? 800 : 400, audioContext.currentTime)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (isHit ? 0.3 : 0.1))

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + (isHit ? 0.3 : 0.1))
    } catch (error) {
      console.log("[v0] Audio context error:", error)
    }
  }, [])

  const triggerComboEffect = useCallback((combo: number) => {
    if (combo === 10) {
      // Fireworks effect
      console.log("[v0] Triggering fireworks effect for 10 combo")
    } else if (combo === 25) {
      // Tribal mask effect
      console.log("[v0] Triggering tribal mask effect for 25 combo")
    } else if (combo >= 50) {
      // Special celebration
      console.log("[v0] Triggering special celebration for 50+ combo")
    }
  }, [])

  const createBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current = null
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const gainNode = audioContext.createGain()
      gainNode.connect(audioContext.destination)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

      // Create a simple tribal rhythm pattern
      const playTribalBeat = () => {
        const oscillator = audioContext.createOscillator()
        const beatGain = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        oscillator.connect(filter)
        filter.connect(beatGain)
        beatGain.connect(gainNode)

        oscillator.type = "sawtooth"
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime)

        filter.type = "lowpass"
        filter.frequency.setValueAtTime(400, audioContext.currentTime)

        beatGain.gain.setValueAtTime(0.5, audioContext.currentTime)
        beatGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      }

      // Create rhythmic pattern
      const startTribalMusic = () => {
        const pattern = [0, 0.3, 0.6, 0.9, 1.2, 1.5] // Beat pattern

        const playPattern = () => {
          pattern.forEach((delay) => {
            setTimeout(() => {
              if (backgroundMusicRef.current) {
                playTribalBeat()
              }
            }, delay * 1000)
          })
        }

        playPattern()
        const interval = setInterval(() => {
          if (backgroundMusicRef.current) {
            playPattern()
          } else {
            clearInterval(interval)
          }
        }, 2000) // Repeat every 2 seconds

        return interval
      }

      const musicInterval = startTribalMusic()

      // Store reference for cleanup
      backgroundMusicRef.current = {
        pause: () => {
          clearInterval(musicInterval)
          audioContext.close()
        },
      } as HTMLAudioElement
    } catch (error) {
      console.log("[v0] Background music creation error:", error)
    }
  }, [])

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser behavior for game keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault()
      }

      if (gameState === "tutorial") {
        const currentKey = keyMappings[tutorialStep]
        if (event.key === currentKey.key) {
          playTribalSound(currentKey.sound)
          if (tutorialStep < keyMappings.length - 1) {
            setTutorialStep((prev) => prev + 1)
          } else {
            setGameState("menu")
            setTutorialStep(0)
          }
        }
        return
      }

      if (gameState !== "playing") return

      const keyMapping = keyMappings.find((k) => k.key === event.key)
      if (!keyMapping) return

      setPressedKeys((prev) => new Set(prev).add(event.key))

      // Check for tiles in target zone
      const targetTiles = tiles.filter(
        (tile) =>
          tile.lane === keyMapping.lane &&
          !tile.hit &&
          !tile.missed &&
          tile.position >= TARGET_ZONE - 50 &&
          tile.position <= TARGET_ZONE + 50,
      )

      if (targetTiles.length > 0) {
        const closestTile = targetTiles.reduce((closest, tile) =>
          Math.abs(tile.position - TARGET_ZONE) < Math.abs(closest.position - TARGET_ZONE) ? tile : closest,
        )

        const distance = Math.abs(closestTile.position - TARGET_ZONE)
        let hitType: "perfect" | "good" | "miss" = "miss"
        let points = 0

        if (distance <= 20) {
          hitType = "perfect"
          points = 10
        } else if (distance <= 40) {
          hitType = "good"
          points = 5
        }

        if (hitType !== "miss") {
          playTribalSound(keyMapping.sound, true)

          setTiles((prev) => prev.map((tile) => (tile.id === closestTile.id ? { ...tile, hit: true } : tile)))

          setStats((prev) => {
            const newCombo = prev.combo + 1
            const multiplier = newCombo >= 50 ? 4 : newCombo >= 25 ? 3 : newCombo >= 10 ? 2 : 1
            const finalPoints = points * multiplier

            // Trigger combo effects
            if (newCombo === 10 || newCombo === 25 || newCombo === 50) {
              triggerComboEffect(newCombo)
            }

            const newStats = {
              ...prev,
              score: prev.score + finalPoints,
              combo: newCombo,
              totalHits: prev.totalHits + 1,
              perfectHits: hitType === "perfect" ? prev.perfectHits + 1 : prev.perfectHits,
              goodHits: hitType === "good" ? prev.goodHits + 1 : prev.goodHits,
              maxCombo: Math.max(prev.maxCombo, newCombo),
            }

            newStats.accuracy =
              newStats.totalHits > 0
                ? ((newStats.perfectHits + newStats.goodHits) / (newStats.totalHits + newStats.missedHits)) * 100
                : 100

            return newStats
          })
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(event.key)
        return newSet
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState, tutorialStep, tiles, playTribalSound, triggerComboEffect])

  useEffect(() => {
    if (gameState !== "playing") return

    const gameLoop = () => {
      setTiles((prev) => {
        const updated = prev
          .map((tile) => ({
            ...tile,
            position: tile.position + tile.speed,
          }))
          .filter((tile) => {
            // Remove tiles that have passed the bottom
            if (tile.position > GAME_HEIGHT + TILE_HEIGHT) {
              if (!tile.hit && !tile.missed) {
                // Missed tile
                setStats((prevStats) => ({
                  ...prevStats,
                  combo: 0,
                  missedHits: prevStats.missedHits + 1,
                  accuracy:
                    prevStats.totalHits > 0
                      ? ((prevStats.perfectHits + prevStats.goodHits) /
                          (prevStats.totalHits + prevStats.missedHits + 1)) *
                        100
                      : 0,
                }))
                playTribalSound(200, false) // Miss sound
              }
              return false
            }
            return true
          })

        return updated
      })

      setGameTime((prev) => prev + 16) // ~60fps
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, playTribalSound])

  useEffect(() => {
    if (gameState !== "playing") return

    const spawnTile = () => {
      const lane = Math.floor(Math.random() * LANES)
      const keyMapping = keyMappings[lane]

      setTiles((prev) => [
        ...prev,
        {
          id: `tile-${nextTileId.current++}`,
          key: keyMapping.key,
          lane,
          position: -TILE_HEIGHT,
          speed: difficulties[difficulty].speed,
          hit: false,
          missed: false,
        },
      ])

      spawnTimerRef.current = window.setTimeout(spawnTile, difficulties[difficulty].spawnRate)
    }

    spawnTimerRef.current = window.setTimeout(spawnTile, 1000) // First tile after 1 second

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current)
      }
    }
  }, [gameState, difficulty])

  useEffect(() => {
    if (gameState === "playing") {
      createBackgroundMusic()
    } else {
      stopBackgroundMusic()
    }

    // Cleanup on unmount
    return () => {
      stopBackgroundMusic()
    }
  }, [gameState, createBackgroundMusic, stopBackgroundMusic])

  useEffect(() => {
    if (gameState === "playing" && gameTime >= 60000) {
      // 1 minute
      setGameState("completed")
      onScoreUpdate(stats.score)
      onGameComplete()
    }
  }, [gameTime, gameState, stats.score, onScoreUpdate, onGameComplete])

  const startGame = () => {
    setGameState("playing")
    setTiles([])
    setStats({
      score: 0,
      combo: 0,
      accuracy: 100,
      totalHits: 0,
      perfectHits: 0,
      goodHits: 0,
      missedHits: 0,
      maxCombo: 0,
    })
    setGameTime(0)
    nextTileId.current = 0
  }

  const startTutorial = () => {
    setGameState("tutorial")
    setTutorialStep(0)
  }

  const restartGame = () => {
    setGameState("menu")
  }

  if (gameState === "tutorial") {
    const currentKey = keyMappings[tutorialStep]
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 flex items-center justify-center">
        <Card className="max-w-md text-center border-accent">
          <CardHeader>
            <CardTitle className="text-2xl text-accent">Learn the Controls</CardTitle>
            <CardDescription>
              Press the arrow keys or spacebar when the falling tiles reach the target box to match the rhythm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">How to Play:</p>
              <p className="text-xs text-muted-foreground">
                Press the keys when the tiles reach the box at the bottom. Perfect timing gives more points!
              </p>
            </div>

            <div className="text-6xl text-primary animate-pulse">{currentKey.symbol}</div>
            <div>
              <h3 className="text-xl font-bold text-accent">{currentKey.name}</h3>
              <p className="text-muted-foreground">Press {currentKey.key === " " ? "SPACEBAR" : currentKey.key}</p>
            </div>
            <Progress value={(tutorialStep / keyMappings.length) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {tutorialStep + 1} of {keyMappings.length}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "gameOver" || gameState === "completed") {
    const isCompleted = gameState === "completed"
    const finalAccuracy = Math.round(stats.accuracy)

    let reward = "Tribal Dancer"
    let rewardIcon = "🎭"

    if (finalAccuracy >= 90 && stats.maxCombo >= 25) {
      reward = "Master Drummer"
      rewardIcon = "🥁"
    } else if (finalAccuracy >= 80) {
      reward = "Festival Performer"
      rewardIcon = "🎪"
    } else if (stats.maxCombo >= 10) {
      reward = "Rhythm Keeper"
      rewardIcon = "🎵"
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 flex items-center justify-center">
        <Card className="max-w-md text-center border-accent">
          <CardHeader>
            <CardTitle className="text-3xl text-accent">
              {isCompleted ? "🎉 Festival Complete!" : "⏰ Time's Up!"}
            </CardTitle>
            <CardDescription>
              {isCompleted ? "You've mastered the tribal rhythm!" : "Keep practicing the traditional beats!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{finalAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.maxCombo}</div>
                <div className="text-sm text-muted-foreground">Max Combo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.perfectHits}</div>
                <div className="text-sm text-muted-foreground">Perfect Hits</div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border-2 border-accent">
              <div className="text-4xl mb-2">{rewardIcon}</div>
              <div className="font-bold text-accent">Reward Unlocked!</div>
              <div className="text-sm text-muted-foreground">{reward}</div>
            </div>

            <div className="flex gap-2">
              <Button onClick={restartGame} className="flex-1 bg-primary hover:bg-primary/90">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => setGameState("menu")} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Menu
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                {stats.score}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                {stats.combo}x
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                {Math.round(stats.accuracy)}%
              </Badge>
            </div>
          </div>

          {/* Game Area */}
          <Card className="overflow-hidden border-accent">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-b from-amber-100 to-orange-100" style={{ height: GAME_HEIGHT }}>
                {/* Lanes */}
                {keyMappings.map((keyMap, index) => (
                  <div
                    key={index}
                    className={`absolute border-r border-accent/30 ${
                      pressedKeys.has(keyMap.key) ? "bg-primary/20" : ""
                    }`}
                    style={{
                      left: `${(index / LANES) * 100}%`,
                      width: `${100 / LANES}%`,
                      height: "100%",
                    }}
                  >
                    {/* Lane symbol at bottom */}
                    <div
                      className="absolute flex items-center justify-center text-2xl font-bold text-accent bg-card/80 rounded-lg border-2 border-accent"
                      style={{
                        bottom: "20px",
                        left: "10px",
                        right: "10px",
                        height: "60px",
                      }}
                    >
                      {keyMap.symbol}
                    </div>
                  </div>
                ))}

                {/* Falling Tiles */}
                {tiles.map((tile) => (
                  <div
                    key={tile.id}
                    className={`absolute rounded-lg border-2 transition-all duration-100 ${
                      tile.hit
                        ? "bg-green-500 border-green-600 scale-110"
                        : tile.missed
                          ? "bg-red-500 border-red-600"
                          : "bg-accent border-accent shadow-lg"
                    }`}
                    style={{
                      left: `${(tile.lane / LANES) * 100 + 2}%`,
                      width: `${100 / LANES - 4}%`,
                      height: `${TILE_HEIGHT}px`,
                      top: `${tile.position}px`,
                    }}
                  >
                    <div className="flex items-center justify-center h-full text-white text-xl font-bold">
                      {keyMappings[tile.lane].symbol}
                    </div>
                  </div>
                ))}

                {/* Target Zone */}
                <div
                  className="absolute left-0 right-0 border-t-4 border-primary bg-primary/10"
                  style={{ top: `${TARGET_ZONE - 25}px`, height: "50px" }}
                />

                {/* Combo Effects */}
                {stats.combo >= 10 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-primary animate-pulse">
                    🎆 {stats.combo}x COMBO! 🎆
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Time: {Math.round((60000 - gameTime) / 1000)}s</span>
              <span>Difficulty: {difficulties[difficulty].name}</span>
            </div>
            <Progress value={(gameTime / 60000) * 100} className="w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 flex items-center justify-center">
      <Card className="max-w-md text-center border-accent">
        <CardHeader>
          <CardTitle className="text-3xl text-accent flex items-center justify-center gap-2">
            <Music className="h-8 w-8" />
            Festival Dance-off
          </CardTitle>
          <CardDescription>Rhythm-based Piano Tiles inspired by Jharkhand tribal dances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-accent">Select Difficulty:</h3>
            {Object.entries(difficulties).map(([key, diff]) => (
              <Button
                key={key}
                onClick={() => setDifficulty(key as keyof typeof difficulties)}
                variant={difficulty === key ? "default" : "outline"}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-semibold">{diff.name}</div>
                  <div className="text-xs opacity-70">{diff.description}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={startTutorial} variant="secondary" className="w-full">
              <Award className="h-4 w-4 mr-2" />
              Tutorial (Learn Controls)
            </Button>
            <Button onClick={startGame} className="w-full bg-primary hover:bg-primary/90">
              <Music className="h-4 w-4 mr-2" />
              Start Dancing
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
