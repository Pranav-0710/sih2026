import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Leaf,
  Recycle,
  TreePine,
  Trophy,
  Star,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Home,
} from "lucide-react"

interface EcoMission {
  id: string
  title: string
  description: string
  type: "cleanup" | "planting" | "conservation" | "education"
  difficulty: "easy" | "medium" | "hard"
  points: number
  tasks: EcoTask[]
  completed: boolean
}

interface EcoTask {
  id: string
  description: string
  action: string
  points: number
  completed: boolean
  requiresPhoto?: boolean
  photoUploaded?: boolean
  photoVerified?: boolean
}

interface EcoExplorerProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
  onGameComplete: () => void
}

const ecoMissions: EcoMission[] = [
  {
    id: "cleanup1",
    title: "Forest Cleanup Drive",
    description: "Clean up plastic waste from the forest area",
    type: "cleanup",
    difficulty: "easy",
    points: 50,
    completed: false,
    tasks: [
      {
        id: "t1",
        description: "Collect plastic bottles",
        action: "collect",
        points: 10,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t2",
        description: "Pick up food wrappers",
        action: "collect",
        points: 10,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t3",
        description: "Remove plastic bags",
        action: "collect",
        points: 15,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t4",
        description: "Sort waste for recycling",
        action: "sort",
        points: 15,
        completed: false,
        requiresPhoto: true,
      },
    ],
  },
  {
    id: "planting1",
    title: "Tree Plantation",
    description: "Plant native trees to restore forest cover",
    type: "planting",
    difficulty: "medium",
    points: 75,
    completed: false,
    tasks: [
      {
        id: "t5",
        description: "Dig holes for saplings",
        action: "dig",
        points: 15,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t6",
        description: "Plant Sal tree saplings",
        action: "plant",
        points: 20,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t7",
        description: "Water the new plants",
        action: "water",
        points: 20,
        completed: false,
        requiresPhoto: true,
      },
      {
        id: "t8",
        description: "Add protective fencing",
        action: "protect",
        points: 20,
        completed: false,
        requiresPhoto: true,
      },
    ],
  },
  {
    id: "conservation1",
    title: "Wildlife Protection",
    description: "Set up camera traps to monitor wildlife",
    type: "conservation",
    difficulty: "hard",
    points: 100,
    completed: false,
    tasks: [
      { id: "t9", description: "Install camera trap", action: "install", points: 25, completed: false },
      { id: "t10", description: "Set up motion sensors", action: "setup", points: 25, completed: false },
      { id: "t11", description: "Create wildlife corridor", action: "create", points: 25, completed: false },
      { id: "t12", description: "Document animal tracks", action: "document", points: 25, completed: false },
    ],
  },
  {
    id: "education1",
    title: "Community Education",
    description: "Educate local community about conservation",
    type: "education",
    difficulty: "medium",
    points: 80,
    completed: false,
    tasks: [
      { id: "t13", description: "Distribute awareness pamphlets", action: "distribute", points: 20, completed: false },
      { id: "t14", description: "Conduct workshop on recycling", action: "teach", points: 20, completed: false },
      { id: "t15", description: "Organize nature walk", action: "organize", points: 20, completed: false },
      { id: "t16", description: "Create conservation pledge", action: "create", points: 20, completed: false },
    ],
  },
]

export function EcoExplorer({ onBack, onScoreUpdate, onGameComplete }: EcoExplorerProps) {
  const [missions, setMissions] = useState<EcoMission[]>(ecoMissions)
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<"selecting" | "playing" | "completed">("selecting")
  const [level, setLevel] = useState(1)
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0)
  const [selectedTaskForPhoto, setSelectedTaskForPhoto] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentMission = missions[currentMissionIndex]
  const completedMissions = missions.filter((m) => m.completed).length

  useEffect(() => {
    const newLevel = Math.floor(totalTasksCompleted / 4) + 1
    setLevel(newLevel)
  }, [totalTasksCompleted])

  const startMission = (missionIndex: number) => {
    setCurrentMissionIndex(missionIndex)
    setGameStatus("playing")
  }

  const completeTask = (taskId: string) => {
    const task = currentMission.tasks.find((t) => t.id === taskId)

    if (task?.requiresPhoto && !task.photoVerified) {
      setSelectedTaskForPhoto(taskId)
      fileInputRef.current?.click()
      return
    }

    setMissions((prev) =>
      prev.map((mission, mIndex) => {
        if (mIndex === currentMissionIndex) {
          const updatedTasks = mission.tasks.map((task) => {
            if (task.id === taskId && !task.completed) {
              setScore((prevScore) => prevScore + task.points)
              setTotalTasksCompleted((prev) => prev + 1)
              return { ...task, completed: true }
            }
            return task
          })

          const allTasksCompleted = updatedTasks.every((task) => task.completed)
          if (allTasksCompleted) {
            setTimeout(() => completeMission(true), 1000)
          }

          return { ...mission, tasks: updatedTasks }
        }
        return mission
      }),
    )
  }

  const completeMission = (success: boolean) => {
    setMissions((prev) =>
      prev.map((mission, mIndex) => {
        if (mIndex === currentMissionIndex) {
          const bonusPoints = success ? mission.points : Math.floor(mission.points * 0.3)
          setScore((prevScore) => prevScore + bonusPoints)
          return { ...mission, completed: true }
        }
        return mission
      }),
    )

    setGameStatus("selecting")

    if (completedMissions + 1 >= missions.length) {
      setGameStatus("completed")
      onScoreUpdate(score)
      onGameComplete()
    }
  }

  const GameOverScreen = ({
    message,
    onRestart,
    onBackToMenu,
  }: { message: string; onRestart: () => void; onBackToMenu: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">⏳ {message}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={onRestart} className="flex-1 flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Restart Game
            </Button>
            <Button onClick={onBackToMenu} variant="outline" className="flex-1 flex items-center gap-2 bg-transparent">
              <Home className="h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const getMissionIcon = (type: string) => {
    switch (type) {
      case "cleanup":
        return <Recycle className="h-5 w-5" />
      case "planting":
        return <TreePine className="h-5 w-5" />
      case "conservation":
        return <Leaf className="h-5 w-5" />
      case "education":
        return <Star className="h-5 w-5" />
      default:
        return <Leaf className="h-5 w-5" />
    }
  }

  const getMissionColor = (type: string) => {
    switch (type) {
      case "cleanup":
        return "bg-blue-500"
      case "planting":
        return "bg-green-500"
      case "conservation":
        return "bg-purple-500"
      case "education":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const verifyPhoto = async (taskId: string) => {
    setIsUploading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isVerified = Math.random() > 0.1

    setMissions((prev) =>
      prev.map((mission, mIndex) => {
        if (mIndex === currentMissionIndex) {
          const updatedTasks = mission.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                photoUploaded: true,
                photoVerified: isVerified,
                completed: isVerified,
              }
            }
            return task
          })
          return { ...mission, tasks: updatedTasks }
        }
        return mission
      }),
    )

    if (isVerified) {
      const task = currentMission.tasks.find((t) => t.id === taskId)
      if (task) {
        setScore((prevScore) => prevScore + task.points)
        setTotalTasksCompleted((prev) => prev + 1)
      }
    }

    setIsUploading(false)
    setSelectedTaskForPhoto(null)
    setPhotoPreview(null)
  }

  if (gameStatus === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl">Eco Champion!</CardTitle>
            <CardDescription>You've completed all environmental missions!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{completedMissions}</div>
                <div className="text-sm text-muted-foreground">Missions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{totalTasksCompleted}</div>
                <div className="text-sm text-muted-foreground">Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-3">Level {level}</div>
                <div className="text-sm text-muted-foreground">Eco Level</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onBack} className="flex-1">
                Back to Games
              </Button>
              <Button
                onClick={() => {
                  setMissions(
                    ecoMissions.map((m) => ({
                      ...m,
                      completed: false,
                      tasks: m.tasks.map((t) => ({ ...t, completed: false })),
                    })),
                  )
                  setCurrentMissionIndex(0)
                  setScore(0)
                  setTotalTasksCompleted(0)
                  setLevel(1)
                  setGameStatus("selecting")
                }}
                variant="outline"
                className="flex-1"
              >
                Explore Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameStatus === "selecting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="container mx-auto max-w-6xl">
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
                <Leaf className="h-4 w-4 mr-2" />
                Level {level}
              </Badge>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                Eco-Friendly Explorer
              </CardTitle>
              <CardDescription>
                Complete environmental missions to protect Jharkhand's natural heritage. Choose a mission to start!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Progress:</span>
                  <Progress value={(completedMissions / missions.length) * 100} className="w-48" />
                  <span className="text-sm text-muted-foreground">
                    {completedMissions}/{missions.length} missions
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map((mission, index) => (
              <Card
                key={mission.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  mission.completed ? "bg-green-50 border-green-200" : "hover:-translate-y-1"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${getMissionColor(mission.type)} text-white`}>
                        {getMissionIcon(mission.type)}
                      </div>
                      <Badge variant={mission.completed ? "default" : "secondary"}>{mission.difficulty}</Badge>
                    </div>
                    <Badge variant="outline">{mission.points} pts</Badge>
                  </div>
                  <CardTitle className={`text-lg ${mission.completed ? "text-green-800" : ""}`}>
                    {mission.title}
                    {mission.completed && <Star className="inline h-5 w-5 ml-2 text-green-600 fill-green-600" />}
                  </CardTitle>
                  <CardDescription>{mission.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {mission.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.description}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => startMission(index)}
                    disabled={mission.completed}
                    className="w-full"
                    variant={mission.completed ? "outline" : "default"}
                  >
                    {mission.completed ? "Completed" : "Start Mission"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setGameStatus("selecting")}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Missions
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-full ${getMissionColor(currentMission.type)} text-white`}>
                {getMissionIcon(currentMission.type)}
              </div>
              <CardTitle className="text-xl">{currentMission.title}</CardTitle>
            </div>
            <CardDescription>{currentMission.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={(currentMission.tasks.filter((t) => t.completed).length / currentMission.tasks.length) * 100}
              className="w-full"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMission.tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "bg-green-50 border-green-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${task.completed ? "text-green-800 line-through" : ""}`}>
                    {task.description}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.points} pts</Badge>
                    {task.requiresPhoto && (
                      <Badge variant="secondary" className="text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        Photo
                      </Badge>
                    )}
                  </div>
                </div>

                {task.requiresPhoto && task.photoUploaded && (
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    {task.photoVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Photo verified!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Photo verification failed. Try again.</span>
                      </>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => completeTask(task.id)}
                  disabled={task.completed}
                  className="w-full"
                  size="sm"
                  variant={task.completed ? "outline" : "default"}
                >
                  {task.completed ? (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : task.requiresPhoto ? (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  ) : (
                    `Complete ${task.action}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTaskForPhoto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Verification Photo
                </CardTitle>
                <CardDescription>Take a photo showing your completed environmental action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {photoPreview && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Photo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                  </Button>

                  {photoPreview && (
                    <Button onClick={() => verifyPhoto(selectedTaskForPhoto)} disabled={isUploading} className="flex-1">
                      {isUploading ? "Verifying..." : "Verify Photo"}
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => {
                    setSelectedTaskForPhoto(null)
                    setPhotoPreview(null)
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
