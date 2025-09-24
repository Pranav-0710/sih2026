"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, MapPin, Clock, Users, Camera } from "lucide-react"

interface HotspotData {
  id: string
  title: string
  description: string
  type: "landmark" | "wildlife" | "culture" | "nature"
  facts?: string[]
  historicalInfo?: string
  bestTime?: string
  position: { x: number; y: number }
}

interface HotspotProps {
  hotspot: HotspotData
  isActive: boolean
  onClick: () => void
  onClose: () => void
}

export function Hotspot({ hotspot, isActive, onClick, onClose }: HotspotProps) {
  const getIcon = () => {
    switch (hotspot.type) {
      case "landmark":
        return <MapPin className="h-4 w-4" />
      case "wildlife":
        return <Camera className="h-4 w-4" />
      case "culture":
        return <Users className="h-4 w-4" />
      case "nature":
        return <Clock className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (hotspot.type) {
      case "landmark":
        return "bg-blue-500"
      case "wildlife":
        return "bg-green-500"
      case "culture":
        return "bg-purple-500"
      case "nature":
        return "bg-orange-500"
      default:
        return "bg-primary"
    }
  }

  return (
    <>
      {/* Hotspot Marker */}
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20`}
        style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
        onClick={onClick}
      >
        <div
          className={`relative ${getTypeColor()} rounded-full p-3 shadow-lg animate-pulse hover:animate-none transition-all duration-300 hover:scale-110`}
        >
          <div className="text-white">{getIcon()}</div>

          {/* Ripple Effect */}
          <div className={`absolute inset-0 ${getTypeColor()} rounded-full animate-ping opacity-30`}></div>

          {/* Label */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {hotspot.title}
          </div>
        </div>
      </div>

      {/* Hotspot Info Panel */}
      {isActive && (
        <div className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto z-30">
          <Card className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`${getTypeColor()} p-2 rounded-full`}>{getIcon()}</div>
                  <CardTitle className="text-lg">{hotspot.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">{hotspot.description}</p>

              {hotspot.historicalInfo && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Historical Significance</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{hotspot.historicalInfo}</p>
                </div>
              )}

              {hotspot.facts && hotspot.facts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Interesting Facts</h4>
                  <ul className="space-y-1">
                    {hotspot.facts.map((fact, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hotspot.bestTime && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Best time to visit: {hotspot.bestTime}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
