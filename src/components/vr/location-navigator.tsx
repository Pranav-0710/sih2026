import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, MapPin, Navigation } from "lucide-react"

interface Location {
  id: string
  name: string
  type: string
  description: string
  image: string
  panoramaImage?: string
  hotspots?: any[]
}

interface LocationNavigatorProps {
  locations: Location[]
  currentLocationId: string
  onLocationChange: (locationId: string) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export function LocationNavigator({
  locations,
  currentLocationId,
  onLocationChange,
  isVisible,
  onToggleVisibility,
}: LocationNavigatorProps) {
  const currentIndex = locations.findIndex((loc) => loc.id === currentLocationId)
  const [showFullList, setShowFullList] = useState(false)

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : locations.length - 1
    onLocationChange(locations[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = currentIndex < locations.length - 1 ? currentIndex + 1 : 0
    onLocationChange(locations[nextIndex].id)
  }

  const handleLocationSelect = (locationId: string) => {
    onLocationChange(locationId)
    setShowFullList(false)
  }

  if (!isVisible) {
    return (
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleVisibility}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white min-w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Navigate Locations</h3>
          <Button variant="ghost" size="sm" onClick={onToggleVisibility} className="text-white hover:bg-white/20">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Location Info */}
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Current Location</span>
          </div>
          <h4 className="font-semibold">{locations[currentIndex]?.name}</h4>
          <p className="text-xs text-gray-300">{locations[currentIndex]?.type}</p>
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="text-white hover:bg-white/20 flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-gray-300">
            {currentIndex + 1} of {locations.length}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="text-white hover:bg-white/20 flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Toggle Full List */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFullList(!showFullList)}
          className="w-full mb-4 border-gray-600 text-white hover:bg-white/10"
        >
          {showFullList ? "Hide" : "Show"} All Locations
        </Button>

        {/* Full Location List */}
        {showFullList && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {locations.map((location, index) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all duration-200 ${
                  location.id === currentLocationId
                    ? "bg-primary/20 border-primary"
                    : "bg-white/5 border-gray-600 hover:bg-white/10"
                }`}
                onClick={() => handleLocationSelect(location.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={location.image || "/placeholder.svg"}
                      alt={location.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-white text-sm">{location.name}</h5>
                      <p className="text-xs text-gray-400">{location.type}</p>
                      {location.hotspots && <p className="text-xs text-primary">{location.hotspots.length} hotspots</p>}
                    </div>
                    {location.id === currentLocationId && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
