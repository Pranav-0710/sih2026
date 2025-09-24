"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Pause, RotateCcw, Settings } from "lucide-react"

interface TTSContent {
  id: string
  title: string
  text: string
  category: "introduction" | "history" | "culture" | "nature" | "hotspot"
  priority: number
}

interface TextToSpeechProps {
  isEnabled: boolean
  onToggle: () => void
  content: TTSContent[]
  locationId: string
  autoPlay?: boolean
}

export function TextToSpeech({ isEnabled, onToggle, content, locationId, autoPlay = true }: TextToSpeechProps) {
  const [currentContent, setCurrentContent] = useState<TTSContent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(0.9)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(0.8)
  const [showSettings, setShowSettings] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // Prefer English voices, then any available voice
      const englishVoice =
        availableVoices.find((voice) => voice.lang.startsWith("en") && voice.name.includes("Google")) ||
        availableVoices.find((voice) => voice.lang.startsWith("en"))

      if (englishVoice) {
        setSelectedVoice(englishVoice)
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0])
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [])

  // Auto-play introduction when location changes
  useEffect(() => {
    if (isEnabled && autoPlay && content.length > 0) {
      // Find introduction content or highest priority content
      const introContent =
        content.find((item) => item.category === "introduction") || content.sort((a, b) => b.priority - a.priority)[0]

      if (introContent) {
        setCurrentContent(introContent)
        // Small delay to ensure component is ready
        setTimeout(() => {
          handleSpeak(introContent)
        }, 500)
      }
    }
  }, [isEnabled, locationId, content, autoPlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  const handleSpeak = (content: TTSContent) => {
    // Stop any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }

    if (!selectedVoice) {
      console.warn("No voice selected for TTS")
      return
    }

    const utterance = new SpeechSynthesisUtterance(content.text)
    utterance.voice = selectedVoice
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = (event) => {
      console.error("TTS Error:", event.error)
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onpause = () => {
      setIsPaused(true)
    }

    utterance.onresume = () => {
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setCurrentContent(content)
  }

  const handlePlayPause = () => {
    if (!currentContent) return

    if (isPlaying && !isPaused) {
      speechSynthesis.pause()
    } else if (isPaused) {
      speechSynthesis.resume()
    } else {
      handleSpeak(currentContent)
    }
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handleContentSelect = (content: TTSContent) => {
    handleSpeak(content)
  }

  if (!isEnabled) {
    return (
      <div className="absolute top-44 right-4 z-20">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Enable Narration
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-44 right-4 w-80 z-20">
      <Card className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Narration</h3>
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

          {/* Current Content */}
          {currentContent && (
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <h4 className="font-medium mb-1">{currentContent.title}</h4>
              <p className="text-xs text-gray-300 mb-3 capitalize">{currentContent.category}</p>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleStop} className="text-white hover:bg-white/20">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2">
                {isPlaying && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">{isPaused ? "Paused" : "Speaking"}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Voice Settings</h4>

              {/* Voice Selection */}
              <div className="mb-3">
                <label className="text-xs text-gray-300 mb-1 block">Voice</label>
                <select
                  value={selectedVoice?.name || ""}
                  onChange={(e) => {
                    const voice = voices.find((v) => v.name === e.target.value)
                    setSelectedVoice(voice || null)
                  }}
                  className="w-full p-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Control */}
              <div className="mb-3">
                <label className="text-xs text-gray-300 mb-1 block">Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Slow</span>
                  <span>{rate}x</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="mb-3">
                <label className="text-xs text-gray-300 mb-1 block">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{Math.round(volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Content List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Available Content</h5>
            {content.map((item) => (
              <div
                key={item.id}
                className={`p-2 rounded cursor-pointer transition-all duration-200 ${
                  currentContent?.id === item.id
                    ? "bg-primary/20 border border-primary"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => handleContentSelect(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h6 className="text-sm font-medium">{item.title}</h6>
                    <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentContent?.id === item.id && isPlaying && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
