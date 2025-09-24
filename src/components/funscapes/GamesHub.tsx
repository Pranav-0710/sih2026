import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Users, Target, Award, Clock, Utensils, Paintbrush } from "lucide-react"
import { Leaderboard } from "@/components/funscapes/Leaderboard"
import { GameCard } from "@/components/funscapes/GameCard"
import { HiddenAnimalGame } from "@/components/funscapes/games/HiddenAnimalGame"
import { TribalArtifactHunt } from "@/components/funscapes/games/TribalArtifactHunt"
import { FestivalDanceOff } from "@/components/funscapes/games/FestivalDanceOff"
import { WildlifeTrivia } from "@/components/funscapes/games/WildlifeTrivia"
import { EcoExplorer } from "@/components/funscapes/games/EcoExplorer"
import { TimeTraveler } from "@/components/funscapes/games/TimeTraveler"
import { FoodExplorer } from "@/components/funscapes/games/FoodExplorer"
import { CavePainting } from "@/components/funscapes/games/CavePainting"
import { CertificateSystem } from "@/components/funscapes/CertificateSystem"

const games = [
  {
    id: "hidden-animal",
    title: "Find the Hidden Animal",
    description: "360° forest exploration with zoom features and audio narration",
    image: "/images/funscapes/dense-forest-with-hidden-animals-in-jharkhand.jpg",
    difficulty: "Medium",
    points: 100,
    category: "Wildlife",
    icon: Target,
  },
  {
    id: "tribal-hunt",
    title: "Tribal Artifact Hunt",
    description: "Interactive VR village with mini-puzzles and virtual museum",
    image: "/images/funscapes/traditional-tribal-village-in-jharkhand-with-artif.jpg",
    difficulty: "Hard",
    points: 150,
    category: "Culture",
    icon: Award,
  },
  {
    id: "dance-off",
    title: "Festival Dance-off",
    description: "Teaching rounds with step-by-step guidance and final challenge",
    image: "/images/funscapes/colorful-tribal-festival-dance-in-jharkhand.jpg",
    difficulty: "Medium",
    points: 120,
    category: "Culture",
    icon: Users,
  },
  {
    id: "wildlife-trivia",
    title: "Wildlife Trivia Challenge",
    description: "AR animal cards with lifelines and unlockable 3D models",
    image: "/images/funscapes/diverse-wildlife-and-plants-of-jharkhand.jpg",
    difficulty: "Easy",
    points: 50,
    category: "Education",
    icon: Star,
  },
  {
    id: "eco-explorer",
    title: "Eco-Friendly Explorer",
    description: "Real photo verification missions with eco-certificates",
    image: "/images/funscapes/environmental-conservation-activities-in-jharkhand.jpg",
    difficulty: "Medium",
    points: 100,
    category: "Environment",
    icon: Trophy,
  },
  {
    id: "time-traveler",
    title: "Jharkhand Time Traveler",
    description: "VR journey through tribal eras with interactive mini-quests",
    image: "/images/funscapes/ancient-tribal-era-jharkhand-historical-scene.jpg",
    difficulty: "Hard",
    points: 200,
    category: "History",
    icon: Clock,
  },
  {
    id: "food-explorer",
    title: "Local Food Explorer",
    description: "VR cooking experience with traditional recipes and stories",
    image: "/images/funscapes/traditional-jharkhand-cuisine-cooking-scene.jpg",
    difficulty: "Medium",
    points: 130,
    category: "Culture",
    icon: Utensils,
  },
  {
    id: "cave-painting",
    title: "Cave Painting Creator",
    description: "AR/VR Sohrai painting creation with shareable gallery",
    image: "/images/funscapes/sohrai-cave-painting-art-creation-scene.jpg",
    difficulty: "Easy",
    points: 80,
    category: "Art",
    icon: Paintbrush,
  },
]

interface GameProgress {
  userScore: number
  gamesCompleted: string[]
  gameStats: Record<string, any>
}

export function GamesHub() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [gamesCompleted, setGamesCompleted] = useState<string[]>([])

  useEffect(() => {
    const savedProgress = sessionStorage.getItem("jharkhand-games-progress")
    if (savedProgress) {
      try {
        const progress: GameProgress = JSON.parse(savedProgress)
        setUserScore(progress.userScore || 0)
        setGamesCompleted(progress.gamesCompleted || [])
      } catch (error) {
        console.error("Failed to load saved progress:", error)
      }
    }
  }, [])

  useEffect(() => {
    const progress: GameProgress = {
      userScore,
      gamesCompleted,
      gameStats: {},
    }
    sessionStorage.setItem("jharkhand-games-progress", JSON.stringify(progress))
  }, [userScore, gamesCompleted])

  const handleScoreUpdate = (points: number) => {
    setUserScore((prev) => prev + points)
  }

  const handleGameComplete = (gameId: string) => {
    setGamesCompleted((prev) => {
      if (!prev.includes(gameId)) {
        return [...prev, gameId]
      }
      return prev
    })
  }

  if (selectedGame === "hidden-animal") {
    return (
      <HiddenAnimalGame
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("hidden-animal")}
      />
    )
  }

  if (selectedGame === "tribal-hunt") {
    return (
      <TribalArtifactHunt
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("tribal-hunt")}
      />
    )
  }

  if (selectedGame === "dance-off") {
    return (
      <FestivalDanceOff
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("dance-off")}
      />
    )
  }

  if (selectedGame === "wildlife-trivia") {
    return (
      <WildlifeTrivia
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("wildlife-trivia")}
      />
    )
  }

  if (selectedGame === "eco-explorer") {
    return (
      <EcoExplorer
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("eco-explorer")}
      />
    )
  }

  if (selectedGame === "time-traveler") {
    return (
      <TimeTraveler
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("time-traveler")}
      />
    )
  }

  if (selectedGame === "food-explorer") {
    return (
      <FoodExplorer
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("food-explorer")}
      />
    )
  }

  if (selectedGame === "cave-painting") {
    return (
      <CavePainting
        onBack={() => setSelectedGame(null)}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={() => handleGameComplete("cave-painting")}
      />
    )
  }

  if (showCertificates) {
    return (
      <CertificateSystem
        userScore={userScore}
        gamesCompleted={gamesCompleted}
        onBack={() => setShowCertificates(false)}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 text-balance">FUN ZONE</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Immerse yourself in the rich culture, wildlife, and natural beauty of Jharkhand through 8 interactive virtual
          experiences with enhanced AR/VR features
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
          </Button>
          <Button onClick={() => setShowCertificates(true)} variant="outline" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            View Certificates
          </Button>
        </div>
      </div>

      {/* Leaderboard Section */}
      {showLeaderboard && (
        <div className="mb-12">
          <Leaderboard />
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onPlay={() => setSelectedGame(game.id)} />
        ))}
      </div>

      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Your Gaming Journey</CardTitle>
          <CardDescription className="text-center">
            Track your progress across all 8 Fun Zone experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{userScore}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">{gamesCompleted.length}</div>
              <div className="text-sm text-muted-foreground">Games Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">
                {gamesCompleted.length >= 8 ? 5 : gamesCompleted.length >= 1 ? Math.min(gamesCompleted.length, 4) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-chart-3">
                {gamesCompleted.length >= 8
                  ? "Master"
                  : gamesCompleted.length >= 5
                    ? "Expert"
                    : gamesCompleted.length >= 1
                      ? "Explorer"
                      : "Beginner"}
              </div>
              <div className="text-sm text-muted-foreground">Current Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}