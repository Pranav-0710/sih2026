"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Award, Star, Download, Medal, Crown, Target } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  requirement: string
  points: number
  unlocked: boolean
  unlockedAt?: Date
  gameName: string
  gameLevel: string
}

interface CertificateSystemProps {
  userScore: number
  gamesCompleted: string[]
  onBack: () => void
}

const achievements: Achievement[] = [
  {
    id: "first-game",
    title: "First Steps",
    description: "Complete your first AR/VR game",
    icon: Target,
    requirement: "Complete 1 game",
    points: 50,
    unlocked: false,
    gameName: "First Game Experience",
    gameLevel: "Beginner",
  },
  {
    id: "wildlife-expert",
    title: "Wildlife Expert",
    description: "Master all wildlife-related games",
    icon: Star,
    requirement: "Complete Hidden Animal & Wildlife Trivia",
    points: 200,
    unlocked: false,
    gameName: "Wildlife Games",
    gameLevel: "Expert",
  },
  {
    id: "culture-guardian",
    title: "Culture Guardian",
    description: "Preserve Jharkhand's cultural heritage",
    icon: Award,
    requirement: "Complete all cultural games",
    points: 300,
    unlocked: false,
    gameName: "Cultural Heritage Games",
    gameLevel: "Master",
  },
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Champion environmental conservation",
    icon: Medal,
    requirement: "Complete Eco Explorer with photo verification",
    points: 250,
    unlocked: false,
    gameName: "Eco-Friendly Explorer",
    gameLevel: "Advanced",
  },
  {
    id: "grand-master",
    title: "Jharkhand Grand Master",
    description: "Complete all AR/VR experiences",
    icon: Crown,
    requirement: "Complete all games",
    points: 1000,
    unlocked: false,
    gameName: "All Games Challenge",
    gameLevel: "Grand Master",
  },
]

export function CertificateSystem({ userScore, gamesCompleted, onBack }: CertificateSystemProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<Achievement | null>(null)
  const [participantName, setParticipantName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    const updatedAchievements = achievements.map((achievement) => {
      let unlocked = false

      switch (achievement.id) {
        case "first-game":
          unlocked = gamesCompleted.length >= 1
          break
        case "wildlife-expert":
          unlocked = gamesCompleted.includes("hidden-animal") && gamesCompleted.includes("wildlife-trivia")
          break
        case "culture-guardian":
          unlocked = ["tribal-hunt", "dance-off", "food-explorer", "cave-painting"].every((game) =>
            gamesCompleted.includes(game),
          )
          break
        case "eco-warrior":
          unlocked = gamesCompleted.includes("eco-explorer")
          break
        case "grand-master":
          unlocked = gamesCompleted.length >= 8
          break
      }

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlocked && !achievement.unlocked ? new Date() : achievement.unlockedAt,
      }
    })

    setUnlockedAchievements(updatedAchievements.filter((a) => a.unlocked))
  }, [gamesCompleted])

  const generateCertificate = (achievement: Achievement, name: string) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    const backgroundImage = new Image()
    backgroundImage.crossOrigin = "anonymous"
    backgroundImage.onload = () => {
      // Draw the certificate background
      ctx.drawImage(backgroundImage, 0, 0, 800, 600)

      // Add text overlay with proper styling
      ctx.fillStyle = "#2d5016" // Dark green text for better contrast
      ctx.font = "bold 28px Arial"
      ctx.textAlign = "center"
      ctx.fillText("This is to certify that", 400, 180)

      ctx.font = "bold 36px Arial"
      ctx.fillStyle = "#1a3d0a" // Darker green for name
      ctx.fillText(name, 400, 230)

      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#2d5016"
      ctx.fillText("has successfully participated in and completed", 400, 280)

      ctx.font = "bold 30px Arial"
      ctx.fillStyle = "#1a3d0a"
      ctx.fillText(`${achievement.gameName}`, 400, 330)

      ctx.font = "bold 26px Arial"
      ctx.fillStyle = "#2d5016"
      ctx.fillText("Jharkhand Tourism Fun Zone", 400, 370)

      ctx.font = "20px Arial"
      const currentDate = new Date().toLocaleDateString("en-GB")
      ctx.fillText(`Date: ${currentDate}`, 400, 450)

      ctx.font = "bold 22px Arial"
      ctx.fillText(`Points Earned: ${achievement.points}`, 400, 490)

      // Download certificate
      const link = document.createElement("a")
      link.download = `jharkhand-${achievement.id}-certificate-${name.replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    }

    backgroundImage.onerror = () => {
      // Fallback to solid background if image fails to load
      ctx.fillStyle = "#f8f9fa"
      ctx.fillRect(0, 0, 800, 600)

      // Add border
      ctx.strokeStyle = "#28a745"
      ctx.lineWidth = 8
      ctx.strokeRect(20, 20, 760, 560)

      // Add text with fallback styling
      ctx.fillStyle = "#28a745"
      ctx.font = "bold 28px Arial"
      ctx.textAlign = "center"
      ctx.fillText("This is to certify that", 400, 180)

      ctx.font = "bold 36px Arial"
      ctx.fillStyle = "#155724"
      ctx.fillText(name, 400, 230)

      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#28a745"
      ctx.fillText("has successfully participated in and completed", 400, 280)

      ctx.font = "bold 30px Arial"
      ctx.fillStyle = "#155724"
      ctx.fillText(`${achievement.gameName}`, 400, 330)

      ctx.font = "bold 26px Arial"
      ctx.fillStyle = "#28a745"
      ctx.fillText("Jharkhand Tourism Fun Zone", 400, 370)

      ctx.font = "20px Arial"
      const currentDate = new Date().toLocaleDateString("en-GB")
      ctx.fillText(`Date: ${currentDate}`, 400, 450)

      ctx.font = "bold 22px Arial"
      ctx.fillText(`Points Earned: ${achievement.points}`, 400, 490)

      // Download certificate
      const link = document.createElement("a")
      link.download = `jharkhand-${achievement.id}-certificate-${name.replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    }

    backgroundImage.src = "/images/certificate-background.jpg"
  }

  const handleDownloadClick = (achievement: Achievement) => {
    setSelectedCertificate(achievement)
    setShowNameInput(true)
  }

  const handleNameSubmit = () => {
    if (participantName.trim() && selectedCertificate) {
      generateCertificate(selectedCertificate, participantName.trim())
      setShowNameInput(false)
      setParticipantName("")
      setSelectedCertificate(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Achievement Center</h1>
            <p className="text-muted-foreground">Your Jharkhand Fun Zone certificates and achievements</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {userScore} Points
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your journey through Jharkhand's Fun Zone experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{gamesCompleted.length}</div>
                <div className="text-sm text-muted-foreground">Games Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">{unlockedAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">{userScore}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-chart-3">{Math.round((gamesCompleted.length / 8) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedAchievements.some((a) => a.id === achievement.id)
            const IconComponent = achievement.icon

            return (
              <Card
                key={achievement.id}
                className={`transition-all hover:shadow-lg ${
                  isUnlocked ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : "opacity-60"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-full ${isUnlocked ? "bg-yellow-500" : "bg-gray-400"} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant={isUnlocked ? "default" : "secondary"}>{achievement.points} pts</Badge>
                  </div>
                  <CardTitle className={`text-lg ${isUnlocked ? "text-yellow-800" : "text-gray-500"}`}>
                    {achievement.title}
                    {isUnlocked && <Trophy className="inline h-5 w-5 ml-2 text-yellow-600" />}
                  </CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    <strong>Requirement:</strong> {achievement.requirement}
                  </div>
                  {isUnlocked ? (
                    <Button onClick={() => handleDownloadClick(achievement)} size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  ) : (
                    <Button disabled size="sm" className="w-full">
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {showNameInput && selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Enter Your Name
                </CardTitle>
                <CardDescription>
                  Please enter your name to be printed on the {selectedCertificate.title} certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="participant-name">Full Name</Label>
                  <Input
                    id="participant-name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleNameSubmit} className="flex-1" disabled={!participantName.trim()}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNameInput(false)
                      setParticipantName("")
                      setSelectedCertificate(null)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
