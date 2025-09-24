import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Trophy, Star, Hammer, Home, Users, Crown } from "lucide-react"

interface Era {
  id: string
  name: string
  period: string
  description: string
  completed: boolean
}

interface Quest {
  id: string
  eraId: string
  name: string
  description: string
  type: "forge" | "build" | "ritual" | "interact"
  completed: boolean
  points: number
  task: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

interface TimeTravelerProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const eras: Era[] = [
  {
    id: "ancient",
    name: "Ancient Tribal Era",
    period: "3000 BCE - 500 CE",
    description: "Experience life with the earliest tribal communities",
    completed: false,
  },
  {
    id: "medieval",
    name: "Medieval Kingdoms",
    period: "500 CE - 1200 CE",
    description: "Meet tribal kings and witness the rise of kingdoms",
    completed: false,
  },
  {
    id: "temple",
    name: "Temple Building Era",
    period: "1200 CE - 1600 CE",
    description: "Participate in the construction of sacred temples",
    completed: false,
  },
  {
    id: "colonial",
    name: "Colonial Resistance",
    period: "1600 CE - 1947 CE",
    description: "Join the freedom struggle and tribal resistance",
    completed: false,
  },
]

const quests: Quest[] = [
  {
    id: "forge-tools",
    eraId: "ancient",
    name: "Forge Iron Tools",
    description: "Learn the ancient art of iron forging with tribal blacksmiths",
    type: "forge",
    completed: false,
    points: 30,
    task: {
      question: "What was the primary metal used by ancient Jharkhand tribes for making tools?",
      options: ["Copper", "Iron", "Bronze", "Gold"],
      correctAnswer: 1,
      explanation:
        "Jharkhand's rich iron ore deposits made iron the primary metal for tool-making, giving tribes a technological advantage.",
    },
  },
  {
    id: "mud-house",
    eraId: "ancient",
    name: "Build Mud House",
    description: "Construct a traditional tribal dwelling using natural materials",
    type: "build",
    completed: false,
    points: 25,
    task: {
      question: "Which natural material was most commonly used to strengthen mud walls?",
      options: ["Sand", "Straw and cow dung", "Stones", "Clay"],
      correctAnswer: 1,
      explanation:
        "Straw and cow dung were mixed with mud to create strong, weather-resistant walls that could last for decades.",
    },
  },
  {
    id: "harvest-ritual",
    eraId: "ancient",
    name: "Join Harvest Ritual",
    description: "Participate in the sacred Sarhul festival celebrating nature",
    type: "ritual",
    completed: false,
    points: 35,
    task: {
      question: "What does the Sarhul festival primarily celebrate?",
      options: ["Harvest season", "Worship of trees and nature", "New year", "Ancestor worship"],
      correctAnswer: 1,
      explanation:
        "Sarhul is the most important festival celebrating the worship of trees, nature, and the arrival of spring.",
    },
  },
  {
    id: "meet-king",
    eraId: "medieval",
    name: "Meet Tribal King",
    description: "Have an audience with a powerful tribal ruler",
    type: "interact",
    completed: false,
    points: 40,
    task: {
      question: "Which was one of the most powerful tribal kingdoms in medieval Jharkhand?",
      options: ["Chero Kingdom", "Nagvanshi Kingdom", "Kharwar Kingdom", "All of the above"],
      correctAnswer: 3,
      explanation:
        "All three kingdoms - Chero, Nagvanshi, and Kharwar - were powerful tribal dynasties that ruled different parts of Jharkhand.",
    },
  },
  {
    id: "temple-stone",
    eraId: "temple",
    name: "Carve Temple Stone",
    description: "Help artisans carve intricate designs for temple construction",
    type: "build",
    completed: false,
    points: 45,
    task: {
      question: "Which architectural style influenced many temples in Jharkhand?",
      options: ["Dravidian", "Nagara", "Kalinga", "Indo-Islamic"],
      correctAnswer: 1,
      explanation:
        "The Nagara style of temple architecture, characterized by its curvilinear towers, was predominant in Jharkhand.",
    },
  },
  {
    id: "resistance-meeting",
    eraId: "colonial",
    name: "Join Resistance Meeting",
    description: "Participate in planning tribal resistance against colonial rule",
    type: "interact",
    completed: false,
    points: 50,
    task: {
      question: "Who led the famous Santhal rebellion in 1855?",
      options: ["Birsa Munda", "Sido and Kanhu Murmu", "Tilka Manjhi", "Jatra Bhagat"],
      correctAnswer: 1,
      explanation:
        "Sido and Kanhu Murmu led the Santhal rebellion in 1855, one of the first major tribal uprisings against British rule.",
    },
  },
]

export function TimeTraveler({ onBack, onScoreUpdate }: TimeTravelerProps) {
  const [currentEra, setCurrentEra] = useState<Era | null>(null)
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null)
  const [gameEras, setGameEras] = useState<Era[]>(eras)
  const [gameQuests, setGameQuests] = useState<Quest[]>(quests)
  const [score, setScore] = useState(0)
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [questResult, setQuestResult] = useState<{ correct: boolean; explanation: string } | null>(null)

  const handleEraSelect = (era: Era) => {
    setCurrentEra(era)
  }

  const handleQuestStart = (quest: Quest) => {
    setCurrentQuest(quest)
    setShowQuestModal(true)
    setQuestResult(null)
  }

  const handleQuestAnswer = (answerIndex: number) => {
    if (!currentQuest) return

    const isCorrect = answerIndex === currentQuest.task.correctAnswer
    const pointsEarned = isCorrect ? currentQuest.points : Math.floor(currentQuest.points * 0.5)

    setScore((prev) => prev + pointsEarned)
    setQuestResult({
      correct: isCorrect,
      explanation: currentQuest.task.explanation,
    })

    // Mark quest as completed
    setGameQuests((prev) => prev.map((quest) => (quest.id === currentQuest.id ? { ...quest, completed: true } : quest)))

    // Check if era is completed
    const eraQuests = gameQuests.filter((q) => q.eraId === currentQuest.eraId)
    const completedEraQuests = eraQuests.filter((q) => q.completed || q.id === currentQuest.id)

    if (completedEraQuests.length === eraQuests.length) {
      setGameEras((prev) => prev.map((era) => (era.id === currentQuest.eraId ? { ...era, completed: true } : era)))
    }
  }

  const closeQuestModal = () => {
    setShowQuestModal(false)
    setCurrentQuest(null)
    setQuestResult(null)
  }

  const getEraQuests = (eraId: string) => {
    return gameQuests.filter((quest) => quest.eraId === eraId)
  }

  const getCompletedQuests = () => {
    return gameQuests.filter((quest) => quest.completed).length
  }

  const getTotalQuests = () => {
    return gameQuests.length
  }

  const getQuestIcon = (type: Quest["type"]) => {
    switch (type) {
      case "forge":
        return Hammer
      case "build":
        return Home
      case "ritual":
        return Star
      case "interact":
        return Users
      default:
        return Star
    }
  }

  if (!currentEra) {
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
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                {getCompletedQuests()}/{getTotalQuests()} Quests
              </Badge>
            </div>
          </div>

          {/* Game Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Clock className="h-8 w-8 text-primary" />
                Jharkhand Time Traveler
              </CardTitle>
              <CardDescription className="text-lg">
                Journey through different eras of Jharkhand's history and experience life with ancient tribes, medieval
                kings, and freedom fighters
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Era Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameEras.map((era) => {
              const eraQuests = getEraQuests(era.id)
              const completedEraQuests = eraQuests.filter((q) => q.completed)
              const progress = eraQuests.length > 0 ? (completedEraQuests.length / eraQuests.length) * 100 : 0

              return (
                <Card
                  key={era.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    era.completed ? "border-green-500 bg-green-50" : "hover:border-primary"
                  }`}
                  onClick={() => handleEraSelect(era)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-amber-600" />
                        {era.name}
                      </CardTitle>
                      {era.completed && (
                        <Badge className="bg-green-600">
                          <Star className="h-4 w-4 mr-1 fill-white" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm font-medium text-amber-700">{era.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{era.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>
                          {completedEraQuests.length}/{eraQuests.length} quests
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const eraQuests = getEraQuests(currentEra.id)
  const completedEraQuests = eraQuests.filter((q) => q.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentEra(null)}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Eras
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {completedEraQuests.length}/{eraQuests.length} Quests
            </Badge>
          </div>
        </div>

        {/* Era Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="h-7 w-7 text-amber-600" />
              {currentEra.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentEra.period} • {currentEra.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scene */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/images/funscapes/ancient-tribal-era-jharkhand-historical-scene.jpg"
                    alt={`${currentEra.name} scene`}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Welcome to {currentEra.name}</h3>
                    <p className="text-lg opacity-90">
                      Explore this era by completing quests and learning about Jharkhand's rich history
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quests Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Quests</CardTitle>
                <CardDescription>Complete mini-quests to learn about this era</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {eraQuests.map((quest) => {
                  const IconComponent = getQuestIcon(quest.type)
                  return (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        quest.completed
                          ? "bg-green-100 border-green-300"
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-primary"
                      }`}
                      onClick={() => !quest.completed && handleQuestStart(quest)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${quest.completed ? "bg-green-500" : "bg-primary"}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${quest.completed ? "line-through text-green-700" : ""}`}>
                            {quest.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {quest.points} points
                            </Badge>
                            {quest.completed && <Star className="h-4 w-4 text-green-600 fill-green-600" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Click on quests to start mini-challenges</p>
                <p>• Answer questions correctly to earn points</p>
                <p>• Complete all quests to master an era</p>
                <p>• Learn fascinating historical facts</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quest Modal */}
        {showQuestModal && currentQuest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getQuestIcon(currentQuest.type), { className: "h-6 w-6 text-primary" })}
                  {currentQuest.name}
                </CardTitle>
                <CardDescription>{currentQuest.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!questResult ? (
                  <>
                    <p className="font-medium text-lg">{currentQuest.task.question}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuest.task.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleQuestAnswer(index)}
                          variant="outline"
                          className="justify-start text-left p-4 h-auto"
                        >
                          <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className={`text-6xl ${questResult.correct ? "text-green-500" : "text-orange-500"}`}>
                      {questResult.correct ? "✓" : "!"}
                    </div>
                    <h3 className={`text-xl font-bold ${questResult.correct ? "text-green-700" : "text-orange-700"}`}>
                      {questResult.correct ? "Excellent!" : "Good Try!"}
                    </h3>
                    <p className="text-muted-foreground">{questResult.explanation}</p>
                    <Badge className={questResult.correct ? "bg-green-600" : "bg-orange-600"}>
                      +{questResult.correct ? currentQuest.points : Math.floor(currentQuest.points * 0.5)} points
                    </Badge>
                    <Button onClick={closeQuestModal} className="mt-4">
                      Continue Journey
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
