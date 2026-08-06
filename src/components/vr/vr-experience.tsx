import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  Volume2,
  Info,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Users,
  Clock,
  Award,
  Gamepad2,
  Trophy,
} from "lucide-react"
import { PanoramaViewer } from "./panorama-viewer"
import { TriviaQuiz } from "./trivia-quiz"
import { locations } from "@/data/monasteries"

export function VRExperience() {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [showHotspots, setShowHotspots] = useState(false)
  // Audio guide UI removed; we default to spatial ambience auto-on in viewer
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showTriviaQuiz, setShowTriviaQuiz] = useState(false)
  const [gameScores, setGameScores] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)

  const selectedLocation = currentLocation ? locations.find((loc) => loc.id === currentLocation) : null

  const handleCloseViewer = () => {
    setCurrentLocation(null)
    setShowHotspots(false)
    setAudioEnabled(false) // Reset audio state when closing VR
  }

  const handleShowHotspots = () => {
    setShowHotspots(!showHotspots)
  }

  const handleLocationChange = (locationId: string) => {
    setCurrentLocation(locationId)
    // Enable audio when entering VR
    setAudioEnabled(true)
  }

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }


  const handleStartTriviaQuiz = (locationId: string) => {
    setCurrentLocation(locationId)
    setShowTriviaQuiz(true)
  }

  const handleGameComplete = (gameType: string, locationId: string, score: number) => {
    const gameKey = `${gameType}-${locationId}`
    setGameScores((prev) => ({ ...prev, [gameKey]: score }))
    setTotalScore((prev) => prev + score)
    setShowTriviaQuiz(false)
  }

  const getTotalLocationScore = (locationId: string) => {
    const triviaScore = gameScores[`trivia-${locationId}`] || 0
    return triviaScore
  }


  if (showTriviaQuiz && selectedLocation) {
    return (
      <TriviaQuiz
        isVisible={showTriviaQuiz}
        onClose={() => setShowTriviaQuiz(false)}
        locationId={selectedLocation.id}
        locationName={selectedLocation.name}
        onComplete={(score) => handleGameComplete("trivia", selectedLocation.id, score)}
      />
    )
  }

  if (selectedLocation) {
    return (
      <PanoramaViewer
        location={selectedLocation}
        allLocations={locations}
        onLocationChange={handleLocationChange}
        onClose={handleCloseViewer}
        onShowHotspots={handleShowHotspots}
        audioEnabled={audioEnabled}
      />
    )
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>

        {/* Location Preview Cards */}
        <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-500 bg-clip-text text-transparent leading-tight">
              Explore Sikkim's Monasteries
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Step inside centuries-old monasteries across Sikkim — from the Karma Kagyu seat at Rumtek to the sacred chortens of Tashiding.
            </p>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {locations.map((location, index) => {
              const locationScore = getTotalLocationScore(location.id)
              return (
                <div
                  key={location.id}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => {
                    setCurrentLocation(location.id)
                    setAudioEnabled(true)
                  }}
                >
                  {/* Card Container */}
                  <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 bg-white dark:bg-slate-800">
                    {/* Image Container */}
                    <div className="relative h-3/5 overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Play Button */}
                      <div className="absolute top-6 right-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 bg-sky-400/20 rounded-full animate-pulse-glow"></div>
                          <Button
                            size="lg"
                            className="relative w-16 h-16 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 hover:animate-ripple"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentLocation(location.id)
                              setAudioEnabled(true)
                            }}
                          >
                            <Play className="h-6 w-6 text-sky-600 ml-1" />
                          </Button>
                        </div>
                      </div>

                      {/* Location Type Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-sky-400/90 to-emerald-400/90 backdrop-blur-sm text-white shadow-lg">
                          {location.type}
                        </span>
                      </div>

                      {/* Score Badge */}
                      {locationScore > 0 && (
                        <div className="absolute bottom-6 right-6">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-sm text-white shadow-lg">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-medium">{locationScore} pts</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Area with Glassmorphism */}
                    <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20">
                      <div className="p-6 h-full flex flex-col justify-between">
                        {/* Title and Description */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                            {location.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {location.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                            <span>360° Experience</span>
                            <span>•</span>
                            <span>{location.hotspots?.length || 0} Hotspots</span>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentLocation(location.id)
                                setAudioEnabled(true)
                              }}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Explore
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
