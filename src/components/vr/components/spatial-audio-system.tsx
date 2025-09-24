"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX, Settings } from "lucide-react"

interface SpatialAudioSource {
  id: string
  name: string
  position: { x: number; y: number; z: number }
  audioUrl?: string
  volume: number
  maxDistance: number
  rolloffFactor: number
  type: "ambient" | "point" | "directional"
}

interface SpatialAudioSystemProps {
  isEnabled: boolean
  onToggle: () => void
  userPosition: { x: number; y: number; z: number }
  userRotation: { x: number; y: number; z: number }
  audioSources: SpatialAudioSource[]
  locationId: string
}

export function SpatialAudioSystem({
  isEnabled,
  onToggle,
  userPosition,
  userRotation,
  audioSources,
  locationId,
}: SpatialAudioSystemProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const audioNodesRef = useRef<Map<string, { source: AudioBufferSourceNode; panner: PannerNode; gain: GainNode }>>(
    new Map(),
  )
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Web Audio API
  useEffect(() => {
    if (isEnabled && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)
      setIsInitialized(true)
    }
  }, [isEnabled, audioContext])

  // Calculate distance between two 3D points
  const calculateDistance = useCallback(
    (pos1: { x: number; y: number; z: number }, pos2: { x: number; y: number; z: number }) => {
      return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2))
    },
    [],
  )

  // Update spatial audio based on user position and rotation
  useEffect(() => {
    if (!audioContext || !isEnabled) return

    audioSources.forEach((source) => {
      const audioNode = audioNodesRef.current.get(source.id)
      if (!audioNode) return

      const distance = calculateDistance(userPosition, source.position)
      const normalizedDistance = Math.min(distance / source.maxDistance, 1)

      // Calculate volume based on distance
      const distanceVolume = Math.max(0, 1 - Math.pow(normalizedDistance, source.rolloffFactor))
      audioNode.gain.gain.setValueAtTime(source.volume * distanceVolume * masterVolume, audioContext.currentTime)

      // Set 3D position for spatial audio
      if (audioNode.panner.positionX) {
        audioNode.panner.positionX.setValueAtTime(source.position.x, audioContext.currentTime)
        audioNode.panner.positionY.setValueAtTime(source.position.y, audioContext.currentTime)
        audioNode.panner.positionZ.setValueAtTime(source.position.z, audioContext.currentTime)
      }

      // Update listener position and orientation
      if (audioContext.listener.positionX) {
        audioContext.listener.positionX.setValueAtTime(userPosition.x, audioContext.currentTime)
        audioContext.listener.positionY.setValueAtTime(userPosition.y, audioContext.currentTime)
        audioContext.listener.positionZ.setValueAtTime(userPosition.z, audioContext.currentTime)

        // Set listener orientation based on user rotation
        const forward = {
          x: Math.sin(userRotation.y) * Math.cos(userRotation.x),
          y: -Math.sin(userRotation.x),
          z: -Math.cos(userRotation.y) * Math.cos(userRotation.x),
        }

        audioContext.listener.forwardX.setValueAtTime(forward.x, audioContext.currentTime)
        audioContext.listener.forwardY.setValueAtTime(forward.y, audioContext.currentTime)
        audioContext.listener.forwardZ.setValueAtTime(forward.z, audioContext.currentTime)
      }
    })
  }, [userPosition, userRotation, audioSources, audioContext, isEnabled, masterVolume, calculateDistance])

  // Initialize audio sources for current location
  useEffect(() => {
    if (!audioContext || !isEnabled) return

    // Clear existing audio nodes
    audioNodesRef.current.forEach((node) => {
      node.source.stop()
      node.source.disconnect()
      node.panner.disconnect()
      node.gain.disconnect()
    })
    audioNodesRef.current.clear()

    // Create new audio nodes for current location
    audioSources.forEach(async (source) => {
      try {
        // Create audio nodes
        const gainNode = audioContext.createGain()
        const pannerNode = audioContext.createPanner()

        // Configure panner node for 3D audio
        pannerNode.panningModel = "HRTF"
        pannerNode.distanceModel = "inverse"
        pannerNode.refDistance = 1
        pannerNode.maxDistance = source.maxDistance
        pannerNode.rolloffFactor = source.rolloffFactor
        pannerNode.coneInnerAngle = 360
        pannerNode.coneOuterAngle = 0
        pannerNode.coneOuterGain = 0

        // For demo purposes, create a simple oscillator instead of loading audio files
        const sourceNode = audioContext.createOscillator()

        // Different frequencies for different audio types
        const frequencies = {
          ambient: 200 + Math.random() * 100, // Low ambient sounds
          point: 400 + Math.random() * 200, // Mid-range point sounds
          directional: 600 + Math.random() * 300, // Higher directional sounds
        }

        sourceNode.frequency.setValueAtTime(frequencies[source.type], audioContext.currentTime)
        sourceNode.type = "sine"

        // Connect audio graph
        sourceNode.connect(gainNode)
        gainNode.connect(pannerNode)
        pannerNode.connect(audioContext.destination)

        // Store references
        audioNodesRef.current.set(source.id, {
          source: sourceNode,
          panner: pannerNode,
          gain: gainNode,
        })

        // Start the audio source
        sourceNode.start()
      } catch (error) {
        console.error(`Failed to initialize audio source ${source.id}:`, error)
      }
    })

    return () => {
      // Cleanup on unmount or location change
      audioNodesRef.current.forEach((node) => {
        try {
          node.source.stop()
          node.source.disconnect()
          node.panner.disconnect()
          node.gain.disconnect()
        } catch (error) {
          // Ignore errors during cleanup
        }
      })
      audioNodesRef.current.clear()
    }
  }, [audioContext, isEnabled, locationId, audioSources])

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume)
  }

  if (!isEnabled) {
    return (
      <div className="absolute top-32 right-4 z-20">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Enable Spatial Audio
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-32 right-4 w-80 z-20">
      <Card className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Spatial Audio</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggle} className="text-white hover:bg-white/20">
                <VolumeX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
            <p className="text-xs text-gray-300">{audioSources.length} audio sources active • 3D positioning enabled</p>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Audio Settings</h4>

              {/* Master Volume */}
              <div className="mb-3">
                <label className="text-xs text-gray-300 mb-1 block">Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={masterVolume}
                  onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Audio Sources */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Active Audio Sources</h5>
            {audioSources.map((source) => {
              const distance = calculateDistance(userPosition, source.position)
              const isAudible = distance <= source.maxDistance

              return (
                <div
                  key={source.id}
                  className={`p-2 rounded transition-all duration-200 ${
                    isAudible ? "bg-green-500/10 border border-green-500/30" : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h6 className="text-sm font-medium">{source.name}</h6>
                      <p className="text-xs text-gray-400 capitalize">{source.type} audio</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{distance.toFixed(1)}m</span>
                      {isAudible && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
