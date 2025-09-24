import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MapPin, Trophy, Star, Clock, Heart, Book } from "lucide-react"

interface PilgrimageSite {
  id: string
  name: string
  location: string
  description: string
  significance: string
  visited: boolean
  points: number
  activities: Activity[]
  historicalInfo: string
  blessings: string[]
}

interface Activity {
  id: string
  name: string
  description: string
  type: "prayer" | "ritual" | "learning" | "meditation"
  completed: boolean
  points: number
  task: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

interface PilgrimageJourneyProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const pilgrimageSites: PilgrimageSite[] = [
  {
    id: "baidyanath",
    name: "Baidyanath Dham",
    location: "Deoghar, Jharkhand",
    description: "One of the twelve Jyotirlingas, sacred to Lord Shiva",
    significance: "The most revered pilgrimage site in Jharkhand, attracting millions of devotees annually",
    visited: false,
    points: 50,
    historicalInfo:
      "Baidyanath Dham is believed to be the place where Ravana offered his ten heads to Lord Shiva. The temple complex dates back to ancient times and is mentioned in various Hindu scriptures.",
    blessings: ["Health and Healing", "Spiritual Purification", "Divine Protection", "Inner Peace"],
    activities: [
      {
        id: "darshan",
        name: "Sacred Darshan",
        description: "Offer prayers and seek blessings at the main temple",
        type: "prayer",
        completed: false,
        points: 20,
        task: {
          question: "What is the significance of Baidyanath Dham?",
          options: [
            "It's one of the 12 Jyotirlingas",
            "It's a Buddhist monastery",
            "It's a Jain temple",
            "It's a Sikh gurudwara",
          ],
          correctAnswer: 0,
          explanation:
            "Baidyanath Dham is one of the twelve sacred Jyotirlingas dedicated to Lord Shiva, making it extremely significant for Hindu devotees.",
        },
      },
      {
        id: "abhishek",
        name: "Rudrabhishek Ritual",
        description: "Participate in the sacred water offering ceremony",
        type: "ritual",
        completed: false,
        points: 25,
        task: {
          question: "What is offered during Rudrabhishek?",
          options: ["Flowers only", "Sacred water and milk", "Only fruits", "Only incense"],
          correctAnswer: 1,
          explanation:
            "Rudrabhishek involves offering sacred water, milk, honey, and other pure substances to the Shiva Linga while chanting mantras.",
        },
      },
    ],
  },
  {
    id: "parasnath",
    name: "Parasnath Hill",
    location: "Giridih, Jharkhand",
    description: "Sacred Jain pilgrimage site and highest peak in Jharkhand",
    significance: "Twenty Jain Tirthankaras attained moksha (liberation) here",
    visited: false,
    points: 45,
    historicalInfo:
      "Parasnath Hill, also known as Shikharji, is the most sacred pilgrimage site for Jains. It's believed that 20 out of 24 Jain Tirthankaras achieved liberation here.",
    blessings: ["Spiritual Liberation", "Karmic Purification", "Wisdom", "Non-violence"],
    activities: [
      {
        id: "parikrama",
        name: "Sacred Parikrama",
        description: "Complete the traditional circumambulation of the hill",
        type: "meditation",
        completed: false,
        points: 30,
        task: {
          question: "How many Jain Tirthankaras attained moksha at Parasnath Hill?",
          options: ["10", "15", "20", "24"],
          correctAnswer: 2,
          explanation:
            "Twenty out of the twenty-four Jain Tirthankaras are believed to have attained moksha (liberation) at Parasnath Hill.",
        },
      },
    ],
  },
  {
    id: "rajrappa",
    name: "Rajrappa Temple",
    location: "Ramgarh, Jharkhand",
    description: "Ancient temple dedicated to Goddess Chhinnamasta",
    significance: "One of the 51 Shakti Peethas, where Sati's head fell",
    visited: false,
    points: 40,
    historicalInfo:
      "Rajrappa Temple is dedicated to Goddess Chhinnamasta, a fierce form of Goddess Durga. It's located at the confluence of rivers Bhera and Damodar.",
    blessings: ["Divine Power", "Courage", "Protection from Evil", "Spiritual Strength"],
    activities: [
      {
        id: "goddess-prayer",
        name: "Goddess Worship",
        description: "Offer prayers to the powerful Goddess Chhinnamasta",
        type: "prayer",
        completed: false,
        points: 25,
        task: {
          question: "Rajrappa Temple is dedicated to which goddess?",
          options: ["Goddess Durga", "Goddess Chhinnamasta", "Goddess Kali", "Goddess Saraswati"],
          correctAnswer: 1,
          explanation:
            "Rajrappa Temple is specifically dedicated to Goddess Chhinnamasta, a fierce and powerful form of the Divine Mother.",
        },
      },
    ],
  },
  {
    id: "jagannath",
    name: "Jagannath Temple",
    location: "Ranchi, Jharkhand",
    description: "Replica of the famous Puri Jagannath Temple",
    significance: "Important center for Lord Jagannath worship in Jharkhand",
    visited: false,
    points: 35,
    historicalInfo:
      "Built in 1691, this temple is a smaller replica of the famous Jagannath Temple in Puri, Odisha. It serves as an important spiritual center for devotees who cannot travel to Puri.",
    blessings: ["Universal Love", "Compassion", "Unity", "Divine Grace"],
    activities: [
      {
        id: "aarti",
        name: "Evening Aarti",
        description: "Participate in the beautiful evening prayer ceremony",
        type: "prayer",
        completed: false,
        points: 20,
        task: {
          question: "The Jagannath Temple in Ranchi is a replica of which famous temple?",
          options: ["Konark Sun Temple", "Puri Jagannath Temple", "Lingaraj Temple", "Kedarnath Temple"],
          correctAnswer: 1,
          explanation:
            "The Jagannath Temple in Ranchi is built as a replica of the world-famous Jagannath Temple in Puri, Odisha.",
        },
      },
    ],
  },
]

export function PilgrimageJourney({ onBack, onScoreUpdate }: PilgrimageJourneyProps) {
  const [selectedSite, setSelectedSite] = useState<PilgrimageSite | null>(null)
  const [gameSites, setGameSites] = useState<PilgrimageSite[]>(pilgrimageSites)
  const [score, setScore] = useState(0)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityResult, setActivityResult] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [journeyProgress, setJourneyProgress] = useState(0)
  const [collectedBlessings, setCollectedBlessings] = useState<string[]>([])

  useEffect(() => {
    const visitedSites = gameSites.filter((site) => site.visited).length
    setJourneyProgress((visitedSites / gameSites.length) * 100)
  }, [gameSites])

  const handleSiteSelect = (site: PilgrimageSite) => {
    setSelectedSite(site)
  }

  const handleActivityStart = (activity: Activity) => {
    if (activity.completed) return
    setCurrentActivity(activity)
    setShowActivityModal(true)
    setActivityResult(null)
  }

  const handleActivityAnswer = (answerIndex: number) => {
    if (!currentActivity || !selectedSite) return

    const isCorrect = answerIndex === currentActivity.task.correctAnswer
    const pointsEarned = isCorrect ? currentActivity.points : Math.floor(currentActivity.points * 0.5)

    setScore((prev) => prev + pointsEarned)
    setActivityResult({
      correct: isCorrect,
      explanation: currentActivity.task.explanation,
    })

    // Mark activity as completed
    setGameSites((prev) =>
      prev.map((site) =>
        site.id === selectedSite.id
          ? {
              ...site,
              activities: site.activities.map((act) =>
                act.id === currentActivity.id ? { ...act, completed: true } : act,
              ),
            }
          : site,
      ),
    )

    // Check if all activities are completed for this site
    const updatedSite = gameSites.find((s) => s.id === selectedSite.id)
    if (updatedSite) {
      const allActivitiesCompleted = updatedSite.activities.every(
        (act) => act.completed || act.id === currentActivity.id,
      )

      if (allActivitiesCompleted) {
        // Mark site as visited and collect blessings
        setGameSites((prev) => prev.map((site) => (site.id === selectedSite.id ? { ...site, visited: true } : site)))

        setCollectedBlessings((prev) => [...prev, ...selectedSite.blessings])
        onScoreUpdate(selectedSite.points)
        setScore((prev) => prev + selectedSite.points)
      }
    }
  }

  const closeActivityModal = () => {
    setShowActivityModal(false)
    setCurrentActivity(null)
    setActivityResult(null)
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "prayer":
        return Heart
      case "ritual":
        return Star
      case "learning":
        return Book
      case "meditation":
        return Clock
      default:
        return Star
    }
  }

  const visitedSites = gameSites.filter((site) => site.visited).length
  const totalSites = gameSites.length

  if (!selectedSite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
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
                <MapPin className="h-4 w-4 mr-2" />
                {visitedSites}/{totalSites} Sites
              </Badge>
            </div>
          </div>

          {/* Game Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <MapPin className="h-8 w-8 text-primary" />
                Sacred Pilgrimage Journey
              </CardTitle>
              <CardDescription className="text-lg">
                Embark on a virtual pilgrimage through Jharkhand's most sacred sites. Experience rituals, learn history,
                and collect divine blessings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Journey Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(journeyProgress)}% Complete</span>
                  </div>
                  <Progress value={journeyProgress} className="w-full h-3" />
                </div>

                {collectedBlessings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Collected Blessings:</h4>
                    <div className="flex flex-wrap gap-2">
                      {collectedBlessings.map((blessing, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800"
                        >
                          ✨ {blessing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sacred Sites Background */}
          <div className="relative mb-8">
            <img
src="/images/funscapes/baidyanath-dham-pilgrimage-journey-scene.jpg"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Journey of Faith</h3>
              <p className="text-lg opacity-90">Visit sacred sites and experience divine presence</p>
            </div>
          </div>

          {/* Pilgrimage Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameSites.map((site) => {
              const completedActivities = site.activities.filter((act) => act.completed).length
              const totalActivities = site.activities.length
              const siteProgress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

              return (
                <Card
                  key={site.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    site.visited ? "border-green-500 bg-green-50" : "hover:border-primary"
                  }`}
                  onClick={() => handleSiteSelect(site)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-purple-600" />
                        {site.name}
                      </CardTitle>
                      {site.visited && (
                        <Badge className="bg-green-600">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Visited
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm font-medium text-purple-700">{site.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{site.description}</p>

                    <div className="space-y-3">
                      <div className="text-xs text-purple-600 font-medium">{site.significance}</div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Activities:</span>
                          <span>
                            {completedActivities}/{totalActivities} completed
                          </span>
                        </div>
                        <Progress value={siteProgress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {site.points} points
                        </Badge>
                        <div className="text-xs text-muted-foreground">{site.blessings.length} blessings available</div>
                      </div>
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

  const completedActivities = selectedSite.activities.filter((act) => act.completed).length
  const totalActivities = selectedSite.activities.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setSelectedSite(null)}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sites
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {completedActivities}/{totalActivities} Activities
            </Badge>
          </div>
        </div>

        {/* Site Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-7 w-7 text-purple-600" />
              {selectedSite.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {selectedSite.location} • {selectedSite.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Site Image and Info */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-6">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/baidyanath-dham-pilgrimage-journey-scene.jpg"
                    alt={selectedSite.name}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{selectedSite.significance}</h3>
                    <p className="text-lg opacity-90">Experience the divine presence and sacred energy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  Historical Significance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{selectedSite.historicalInfo}</p>
              </CardContent>
            </Card>
          </div>

          {/* Activities Sidebar */}
          <div className="space-y-4">
            {/* Available Blessings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Divine Blessings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedSite.blessings.map((blessing, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-sm ${
                        selectedSite.visited ? "bg-yellow-100 text-yellow-800" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ✨ {blessing}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sacred Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sacred Activities</CardTitle>
                <CardDescription>Complete all activities to receive blessings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSite.activities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type)
                  return (
                    <div
                      key={activity.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        activity.completed
                          ? "bg-green-100 border-green-300"
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-primary"
                      }`}
                      onClick={() => handleActivityStart(activity)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${activity.completed ? "bg-green-500" : "bg-primary"}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${activity.completed ? "line-through text-green-700" : ""}`}>
                            {activity.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {activity.points} points
                            </Badge>
                            {activity.completed && <Star className="h-4 w-4 text-green-600 fill-green-600" />}
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
                <CardTitle className="text-lg">How to Experience</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Click on activities to participate in sacred rituals</p>
                <p>• Answer questions to demonstrate understanding</p>
                <p>• Complete all activities to receive divine blessings</p>
                <p>• Learn about the rich spiritual heritage</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Modal */}
        {showActivityModal && currentActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getActivityIcon(currentActivity.type), { className: "h-6 w-6 text-primary" })}
                  {currentActivity.name}
                </CardTitle>
                <CardDescription>{currentActivity.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!activityResult ? (
                  <>
                    <p className="font-medium text-lg">{currentActivity.task.question}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {currentActivity.task.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleActivityAnswer(index)}
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
                    <div className={`text-6xl ${activityResult.correct ? "text-green-500" : "text-orange-500"}`}>
                      {activityResult.correct ? "🙏" : "📿"}
                    </div>
                    <h3
                      className={`text-xl font-bold ${activityResult.correct ? "text-green-700" : "text-orange-700"}`}
                    >
                      {activityResult.correct ? "Blessed!" : "Learning Continues!"}
                    </h3>
                    <p className="text-muted-foreground">{activityResult.explanation}</p>
                    <Badge className={activityResult.correct ? "bg-green-600" : "bg-orange-600"}>
                      +{activityResult.correct ? currentActivity.points : Math.floor(currentActivity.points * 0.5)}{" "}
                      points
                    </Badge>
                    <Button onClick={closeActivityModal} className="mt-4">
                      Continue Journey
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Site Completion Modal */}
        {selectedSite.visited && completedActivities === totalActivities && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Sacred Journey Complete!</CardTitle>
                <CardDescription>You have received all blessings from {selectedSite.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-6xl">🕉️</div>
                <div className="space-y-2">
                  {selectedSite.blessings.map((blessing, index) => (
                    <Badge key={index} className="bg-yellow-600 text-white mr-2 mb-2">
                      ✨ {blessing}
                    </Badge>
                  ))}
                </div>
                <Badge className="bg-green-600 text-lg px-4 py-2">+{selectedSite.points} bonus points!</Badge>
                <Button onClick={() => setSelectedSite(null)} className="mt-4">
                  Continue Pilgrimage
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
