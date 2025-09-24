"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star } from "lucide-react"

interface Game {
  id: string
  title: string
  description: string
  image: string
  difficulty: string
  points: number
  category: string
  icon: React.ComponentType<{ className?: string }>
}

interface GameCardProps {
  game: Game
  onPlay: () => void
}

export function GameCard({ game, onPlay }: GameCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "wildlife":
        return "bg-green-500"
      case "culture":
        return "bg-purple-500"
      case "adventure":
        return "bg-orange-500"
      case "education":
        return "bg-blue-500"
      case "environment":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const IconComponent = game.icon

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img
          src={game.image || "/placeholder.svg"}
          alt={game.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
          <Badge className={`${getCategoryColor(game.category)} text-white`}>{game.category}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{game.title}</CardTitle>
        <CardDescription className="text-sm">{game.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{game.points} points</span>
          </div>
        </div>

        <Button
          onClick={onPlay}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          Play Now
        </Button>
      </CardContent>
    </Card>
  )
}