"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Palette, Trophy, Star, Undo, RotateCcw, Download, Eye, EyeOff } from "lucide-react"

interface PaintingPattern {
  id: string
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  points: number
  completed: boolean
  culturalSignificance: string
  steps: string[]
  colors: string[]
}

interface CavePaintingProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const patterns: PaintingPattern[] = [
  {
    id: "elephant",
    name: "Sacred Elephant",
    description: "Traditional elephant motif representing strength and wisdom",
    difficulty: "Beginner",
    points: 30,
    completed: false,
    culturalSignificance:
      "Elephants in Sohrai art symbolize prosperity and are believed to bring good fortune to households. They represent the connection between humans and nature.",
    steps: [
      "Draw the basic elephant outline",
      "Add decorative patterns on the body",
      "Fill with traditional colors",
      "Add surrounding nature elements",
    ],
    colors: ["#8B4513", "#D2691E", "#F4A460", "#FFFFFF", "#000000"],
  },
  {
    id: "peacock",
    name: "Dancing Peacock",
    description: "Elegant peacock with spread feathers in traditional style",
    difficulty: "Intermediate",
    points: 40,
    completed: false,
    culturalSignificance:
      "Peacocks represent beauty, grace, and the arrival of monsoon. In tribal culture, they are associated with fertility and abundance.",
    steps: [
      "Sketch the peacock's body and neck",
      "Draw the magnificent tail feathers",
      "Add intricate feather patterns",
      "Color with vibrant traditional hues",
    ],
    colors: ["#4169E1", "#32CD32", "#FFD700", "#FF6347", "#8A2BE2"],
  },
  {
    id: "tree-of-life",
    name: "Tree of Life",
    description: "Sacred tree connecting earth and sky with intricate branches",
    difficulty: "Advanced",
    points: 50,
    completed: false,
    culturalSignificance:
      "The Tree of Life represents the connection between all living beings and the cycle of life, death, and rebirth in tribal philosophy.",
    steps: [
      "Draw the main trunk and root system",
      "Add spreading branches and leaves",
      "Include birds and animals in branches",
      "Add spiritual symbols and patterns",
    ],
    colors: ["#228B22", "#8B4513", "#FF4500", "#FFD700", "#DC143C"],
  },
  {
    id: "harvest-scene",
    name: "Harvest Celebration",
    description: "Community harvest scene with people, animals, and crops",
    difficulty: "Advanced",
    points: 60,
    completed: false,
    culturalSignificance:
      "Harvest scenes celebrate the community spirit and the relationship between humans, animals, and the land that sustains them.",
    steps: [
      "Draw human figures in traditional poses",
      "Add domestic animals like cows and goats",
      "Include crops and farming tools",
      "Create a festive, celebratory atmosphere",
    ],
    colors: ["#DAA520", "#CD853F", "#F0E68C", "#FF6347", "#32CD32"],
  },
]

export function CavePainting({ onBack, onScoreUpdate }: CavePaintingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPattern, setSelectedPattern] = useState<PaintingPattern | null>(null)
  const [gamePatterns, setGamePatterns] = useState<PaintingPattern[]>(patterns)
  const [score, setScore] = useState(0)
  const [currentColor, setCurrentColor] = useState("#8B4513")
  const [brushSize, setBrushSize] = useState(5)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showReference, setShowReference] = useState(true)
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [paintingComplete, setPaintingComplete] = useState(false)

  useEffect(() => {
    if (selectedPattern && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Set canvas background to cave wall texture
        ctx.fillStyle = "#D2B48C"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add some texture
        ctx.fillStyle = "#C19A6B"
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
        }

        saveToHistory()
      }
    }
  }, [selectedPattern])

  const saveToHistory = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        setDrawingHistory((prev) => [...prev.slice(-9), imageData])
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.globalCompositeOperation = "source-over"
    ctx.lineCap = "round"
    ctx.lineWidth = brushSize
    ctx.strokeStyle = currentColor

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.beginPath()
          saveToHistory()
        }
      }
    }
  }

  const undo = () => {
    if (drawingHistory.length > 1 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const previousState = drawingHistory[drawingHistory.length - 2]
        ctx.putImageData(previousState, 0, 0)
        setDrawingHistory((prev) => prev.slice(0, -1))
      }
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current && selectedPattern) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#D2B48C"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Add texture again
        ctx.fillStyle = "#C19A6B"
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(Math.random() * canvasRef.current.width, Math.random() * canvasRef.current.height, 2, 2)
        }

        saveToHistory()
        setCurrentStep(0)
        setPaintingComplete(false)
      }
    }
  }

  const completePainting = () => {
    if (!selectedPattern) return

    const pointsEarned = selectedPattern.points
    setScore((prev) => prev + pointsEarned)
    onScoreUpdate(pointsEarned)

    setGamePatterns((prev) =>
      prev.map((pattern) => (pattern.id === selectedPattern.id ? { ...pattern, completed: true } : pattern)),
    )

    setPaintingComplete(true)
  }

  const downloadPainting = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `sohrai-${selectedPattern?.name.replace(/\s+/g, "_")}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const handlePatternSelect = (pattern: PaintingPattern) => {
    if (pattern.completed) return
    setSelectedPattern(pattern)
    setCurrentStep(0)
    setPaintingComplete(false)
    setCurrentColor(pattern.colors[0])
  }

  const completedPatterns = gamePatterns.filter((pattern) => pattern.completed).length
  const totalPatterns = gamePatterns.length

  if (!selectedPattern) {
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
                <Palette className="h-4 w-4 mr-2" />
                {completedPatterns}/{totalPatterns} Paintings
              </Badge>
            </div>
          </div>

          {/* Game Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Palette className="h-8 w-8 text-primary" />
                Sohrai Cave Painting AR Experience
              </CardTitle>
              <CardDescription className="text-lg">
                Create traditional Sohrai cave paintings using AR technology. Learn about tribal art and cultural
                significance while expressing your creativity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(completedPatterns / totalPatterns) * 100} className="w-full h-3" />
              <p className="text-sm text-muted-foreground mt-2">Complete all patterns to become a Sohrai art master</p>
            </CardContent>
          </Card>

          {/* Cave Wall Background */}
          <div className="relative mb-8">
            <img
              src="/images/funscapes/sohrai-cave-painting-art-creation-scene.jpg"
              alt="Cave painting scene"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Ancient Art Comes Alive</h3>
              <p className="text-lg opacity-90">Experience the sacred tradition of Sohrai cave painting</p>
            </div>
          </div>

          {/* Pattern Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamePatterns.map((pattern) => (
              <Card
                key={pattern.id}
                className={`cursor-pointer hover:shadow-lg transition-all ${
                  pattern.completed ? "border-green-500 bg-green-50" : "hover:border-primary"
                }`}
                onClick={() => handlePatternSelect(pattern)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    {pattern.completed && (
                      <Badge className="bg-green-600">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          pattern.difficulty === "Beginner"
                            ? "border-green-500 text-green-700"
                            : pattern.difficulty === "Intermediate"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-red-500 text-red-700"
                        }`}
                      >
                        {pattern.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {pattern.points} points
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      {pattern.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {pattern.steps.length} steps • Traditional Sohrai style
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setSelectedPattern(null)}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patterns
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Step {currentStep + 1}/{selectedPattern.steps.length}
            </Badge>
          </div>
        </div>

        {/* Painting Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Palette className="h-6 w-6 text-primary" />
                    {selectedPattern.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setShowReference(!showReference)} variant="outline" size="sm">
                      {showReference ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      Reference
                    </Button>
                    <Button onClick={undo} variant="outline" size="sm" disabled={drawingHistory.length <= 1}>
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button onClick={clearCanvas} variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="border-2 border-amber-300 rounded-lg cursor-crosshair bg-stone-200"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />

                  {showReference && (
                    <div className="absolute top-4 right-4 w-48 h-36 bg-white/90 rounded-lg p-2 border">
                      <h4 className="text-sm font-medium mb-2">Reference Pattern</h4>
                      <div className="w-full h-24 bg-amber-100 rounded flex items-center justify-center text-xs text-muted-foreground">
                        Traditional {selectedPattern.name} Pattern
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Sidebar */}
          <div className="space-y-4">
            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traditional Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {selectedPattern.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        currentColor === color ? "border-primary scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brush Size */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brush Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">Size: {brushSize}px</div>
                </div>
              </CardContent>
            </Card>

            {/* Steps Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Painting Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPattern.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : index < currentStep
                            ? "bg-green-100 text-green-800"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}. {step}
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {currentStep < selectedPattern.steps.length - 1 ? (
                    <Button onClick={() => setCurrentStep((prev) => prev + 1)} className="w-full">
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={completePainting}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={paintingComplete}
                    >
                      {paintingComplete ? "Painting Complete!" : "Complete Painting"}
                    </Button>
                  )}

                  {paintingComplete && (
                    <Button
                      onClick={downloadPainting}
                      variant="outline"
                      className="w-full flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Download Art
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cultural Significance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{selectedPattern.culturalSignificance}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion Modal */}
        {paintingComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Masterpiece Created!</CardTitle>
                <CardDescription>You've successfully completed the {selectedPattern.name} painting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-6xl">🎨</div>
                <Badge className="bg-green-600 text-lg px-4 py-2">+{selectedPattern.points} points earned!</Badge>
                <p className="text-sm text-muted-foreground">
                  Your artwork has been saved and you can download it anytime
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setSelectedPattern(null)}>Create Another</Button>
                  <Button onClick={downloadPainting} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
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
