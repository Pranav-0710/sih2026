"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, ZoomIn, ZoomOut, Home, Info, BookOpen, Gamepad2, Star } from "lucide-react"
import { Hotspot } from "./hotspot"
import { LocationNavigator } from "./location-navigator"
import { AudioGuide } from "./audio-guide"
import { EducationalPanel } from "./educational-panel"
import { SpatialAudioSystem } from "./spatial-audio-system"
import { TextToSpeech } from "./text-to-speech"
import { WildlifeSpottingGame } from "./wildlife-spotting-game"
import { TriviaQuiz } from "./trivia-quiz"

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

interface Location {
  id: string
  name: string
  type: string
  description: string
  image: string
  panoramaImage?: string
  hotspots?: HotspotData[]
  audioTracks?: any[]
  educationalContent?: any
}

interface PanoramaViewerProps {
  location: Location
  allLocations: Location[]
  onLocationChange: (locationId: string) => void
  onClose: () => void
  onShowHotspots?: () => void
  audioEnabled?: boolean
}

export function PanoramaViewer({
  location,
  allLocations,
  onLocationChange,
  onClose,
  onShowHotspots,
  audioEnabled = false,
}: PanoramaViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [showHotspots, setShowHotspots] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [showNavigator, setShowNavigator] = useState(false)
  const [audioGuideEnabled, setAudioGuideEnabled] = useState(audioEnabled)
  const [showEducationalPanel, setShowEducationalPanel] = useState(false)
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0, z: 0 })
  const [showWildlifeGame, setShowWildlifeGame] = useState(false)
  const [showTriviaQuiz, setShowTriviaQuiz] = useState(false)

  useEffect(() => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setShowHotspots(false)
    setActiveHotspot(null)
    setIsLoading(true)
    setShowEducationalPanel(false)
  }, [location.id])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setIsLoading(false)
      drawPanorama(ctx, img, canvas.width, canvas.height)
    }

    // Use the location's panorama image or fallback to regular image
    img.src = location.panoramaImage || location.image

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (!isLoading) {
        drawPanorama(ctx, img, canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [location, rotation, zoom, isLoading])

  useEffect(() => {
    setUserPosition({
      x: Math.sin(rotation.y * 0.01) * 10,
      y: rotation.x * 0.1,
      z: Math.cos(rotation.y * 0.01) * 10,
    })
  }, [rotation])

  const drawPanorama = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    // Apply transformations for 360-degree effect
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(zoom, zoom)
    ctx.rotate(rotation.y * 0.01)

    // Draw the panoramic image with wrapping effect
    const imgWidth = img.width * (height / img.height)
    const imgHeight = height

    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)

    // Draw additional copies for seamless wrapping
    ctx.drawImage(img, -imgWidth / 2 - imgWidth, -imgHeight / 2, imgWidth, imgHeight)
    ctx.drawImage(img, -imgWidth / 2 + imgWidth, -imgHeight / 2, imgWidth, imgHeight)

    ctx.restore()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }))

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, prev - 0.2))
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleToggleHotspots = () => {
    setShowHotspots(!showHotspots)
    setActiveHotspot(null)
    if (onShowHotspots) {
      onShowHotspots()
    }
  }

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(activeHotspot === hotspotId ? null : hotspotId)
  }

  const handleCloseHotspot = () => {
    setActiveHotspot(null)
  }

  const handleLocationChange = (locationId: string) => {
    onLocationChange(locationId)
  }

  const handleToggleNavigator = () => {
    setShowNavigator(!showNavigator)
  }

  const handleToggleAudioGuide = () => {
    setAudioGuideEnabled(!audioGuideEnabled)
  }

  const handleToggleEducationalPanel = () => {
    setShowEducationalPanel(!showEducationalPanel)
  }

  const handleToggleSpatialAudio = () => {
    setSpatialAudioEnabled(!spatialAudioEnabled)
  }

  const handleToggleTTS = () => {
    setTtsEnabled(!ttsEnabled)
  }

  const handleStartWildlifeGame = () => {
    setShowWildlifeGame(true)
  }

  const handleStartTriviaQuiz = () => {
    setShowTriviaQuiz(true)
  }

  const handleGameComplete = (score: number) => {
    // Game completed, could add score tracking here
    setShowWildlifeGame(false)
    setShowTriviaQuiz(false)
  }

  const spatialAudioSources =
    location.hotspots?.map((hotspot, index) => ({
      id: hotspot.id,
      name: hotspot.title,
      position: {
        x: (hotspot.position.x - 50) * 0.2, // Convert screen position to 3D space
        y: (hotspot.position.y - 50) * 0.1,
        z: Math.random() * 5 - 2.5, // Random depth
      },
      volume: 0.3,
      maxDistance: 15,
      rolloffFactor: 1.5,
      type: hotspot.type === "wildlife" ? "point" : hotspot.type === "nature" ? "ambient" : "directional",
    })) || []

  const ttsContent = [
    {
      id: `${location.id}-intro`,
      title: `Welcome to ${location.name}`,
      text: `Welcome to ${location.name}, ${location.description}. This ${location.type} offers a unique glimpse into Jharkhand's natural beauty and cultural heritage.`,
      category: "introduction" as const,
      priority: 10,
    },
    ...(location.hotspots?.map((hotspot, index) => ({
      id: `${location.id}-hotspot-${hotspot.id}`,
      title: hotspot.title,
      text: `${hotspot.description}. ${hotspot.historicalInfo || ""} ${hotspot.bestTime ? `Best time to visit: ${hotspot.bestTime}` : ""}`,
      category: "hotspot" as const,
      priority: 5 + index,
    })) || []),
    {
      id: `${location.id}-history`,
      title: `History of ${location.name}`,
      text: `${location.name} has been an important part of Jharkhand's landscape for centuries. This region showcases the rich biodiversity and cultural significance that makes Jharkhand a unique destination in eastern India.`,
      category: "history" as const,
      priority: 8,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading 360° Experience...</p>
            <p className="text-sm text-gray-400 mt-2">Preparing {location.name}</p>
          </div>
        </div>
      )}

      {/* Canvas for 360-degree view */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Location Navigator */}
      <LocationNavigator
        locations={allLocations}
        currentLocationId={location.id}
        onLocationChange={handleLocationChange}
        isVisible={showNavigator}
        onToggleVisibility={handleToggleNavigator}
      />

      <AudioGuide
        locationId={location.id}
        isEnabled={audioGuideEnabled}
        onToggle={handleToggleAudioGuide}
        tracks={location.audioTracks || []}
      />

      {location.educationalContent && (
        <EducationalPanel
          locationName={location.name}
          content={location.educationalContent}
          isVisible={showEducationalPanel}
          onClose={() => setShowEducationalPanel(false)}
        />
      )}

      {showHotspots && location.hotspots && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {location.hotspots.map((hotspot) => (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot === hotspot.id}
                onClick={() => handleHotspotClick(hotspot.id)}
                onClose={handleCloseHotspot}
              />
            ))}
          </div>
        </div>
      )}

      {/* Spatial Audio System */}
      <SpatialAudioSystem
        isEnabled={spatialAudioEnabled}
        onToggle={handleToggleSpatialAudio}
        userPosition={userPosition}
        userRotation={rotation}
        audioSources={spatialAudioSources}
        locationId={location.id}
      />

      {/* Text-to-Speech System */}
      <TextToSpeech
        isEnabled={ttsEnabled}
        onToggle={handleToggleTTS}
        content={ttsContent}
        locationId={location.id}
        autoPlay={true}
      />

      {/* Wildlife Spotting Game */}
      <WildlifeSpottingGame
        isVisible={showWildlifeGame}
        onClose={() => setShowWildlifeGame(false)}
        locationId={location.id}
        onComplete={handleGameComplete}
      />

      {/* Trivia Quiz */}
      <TriviaQuiz
        isVisible={showTriviaQuiz}
        onClose={() => setShowTriviaQuiz(false)}
        locationId={location.id}
        locationName={location.name}
        onComplete={handleGameComplete}
      />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Location Info */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-md">
          <h2 className="text-2xl font-bold mb-1">{location.name}</h2>
          <p className="text-primary text-sm mb-2">{location.type}</p>
          <p className="text-sm opacity-90 leading-relaxed">{location.description}</p>
          {location.hotspots && location.hotspots.length > 0 && (
            <p className="text-xs text-primary mt-2">{location.hotspots.length} interactive points available</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Location {allLocations.findIndex((loc) => loc.id === location.id) + 1} of {allLocations.length}
          </p>
        </div>

        {/* Close Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleReset} className="text-white hover:bg-white/20 rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {location.hotspots && location.hotspots.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleHotspots}
              className={`text-white hover:bg-white/20 rounded-full ${showHotspots ? "bg-primary/30" : ""}`}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}

          {location.educationalContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleEducationalPanel}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          )}

          {location.id === "betla" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartWildlifeGame}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Gamepad2 className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartTriviaQuiz}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Star className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <p className="text-sm opacity-75">
          Drag to look around • Scroll to zoom •{" "}
          {location.hotspots && location.hotspots.length > 0 ? "Click Info for hotspots • " : ""}
          {location.educationalContent ? "Click Book for learning • " : ""}
          {location.id === "betla" ? "Click Game for wildlife spotting • " : ""}
          Click Star for quiz • Use navigation panel to explore locations
        </p>
      </div>
    </div>
  )
}
