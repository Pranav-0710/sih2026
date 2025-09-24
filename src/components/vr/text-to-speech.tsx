import { useState, useRef, useEffect, useCallback } from "react"
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
  headless?: boolean
  hideControls?: boolean
  onNarrationEnd?: () => void
  onPlayingStateChange?: (isPlaying: boolean) => void
}

export function TextToSpeech({ isEnabled, onToggle, content, locationId, autoPlay = true, headless = false, hideControls = false, onNarrationEnd, onPlayingStateChange }: TextToSpeechProps) {
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
  const isInitializingRef = useRef(false)
  const lastLocationRef = useRef<string>("")

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

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

  const cleanupSpeech = useCallback(() => {
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel()
      }
      setIsPlaying(false)
      setIsPaused(false)
      utteranceRef.current = null
    } catch (error) {
      console.debug("TTS cleanup completed")
    }
  }, [])

  useEffect(() => {
    if (isEnabled && autoPlay && content.length > 0 && locationId !== lastLocationRef.current) {
      cleanupSpeech()

      if (isInitializingRef.current) return

      lastLocationRef.current = locationId
      isInitializingRef.current = true

      const introContent =
        content.find((item) => item.category === "introduction") || content.sort((a, b) => b.priority - a.priority)[0]

      if (introContent) {
        setCurrentContent(introContent)
        setTimeout(() => {
          if (locationId === lastLocationRef.current) {
            handleSpeak(introContent)
          }
          isInitializingRef.current = false
        }, 1000)
      } else {
        isInitializingRef.current = false
      }
    }
  }, [isEnabled, locationId, content, autoPlay, cleanupSpeech])

  useEffect(() => {
    return () => {
      cleanupSpeech()
    }
  }, [cleanupSpeech])

  const handleSpeak = useCallback(
    (content: TTSContent) => {
      try {
        cleanupSpeech()

        if (!selectedVoice) {
          console.warn("No voice selected for TTS")
          return
        }

        setTimeout(() => {
          try {
            const utterance = new SpeechSynthesisUtterance(content.text)
            utterance.voice = selectedVoice
            utterance.rate = rate
            utterance.pitch = pitch
            utterance.volume = volume

            utterance.onstart = () => {
              setIsPlaying(true)
              setIsPaused(false)
              if (onPlayingStateChange) {
                onPlayingStateChange(true)
              }
            }

            utterance.onend = () => {
              setIsPlaying(false)
              setIsPaused(false)
              utteranceRef.current = null
              if (onPlayingStateChange) {
                onPlayingStateChange(false)
              }
              if (onNarrationEnd) {
                onNarrationEnd()
              }
            }

            utterance.onerror = (event) => {
              if (event.error !== "interrupted") {
                console.error("TTS Error:", event.error)
              }
              setIsPlaying(false)
              setIsPaused(false)
              utteranceRef.current = null
              if (onPlayingStateChange) {
                onPlayingStateChange(false)
              }
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
          } catch (error) {
            console.error("Failed to start TTS:", error)
            setIsPlaying(false)
            setIsPaused(false)
          }
        }, 100)
      } catch (error) {
        console.error("TTS initialization error:", error)
      }
    },
    [selectedVoice, rate, pitch, volume, cleanupSpeech],
  )

  const handlePlayPause = () => {
    if (!currentContent) return

    try {
      if (isPlaying && !isPaused) {
        speechSynthesis.pause()
      } else if (isPaused) {
        speechSynthesis.resume()
      } else {
        handleSpeak(currentContent)
      }
    } catch (error) {
      console.error("TTS control error:", error)
      cleanupSpeech()
    }
  }

  const handleStop = () => {
    cleanupSpeech()
  }

  const handleContentSelect = (content: TTSContent) => {
    handleSpeak(content)
  }

  // Hide controls if hideControls is true
  if (hideControls) {
    return null
  }

  // Compact UI similar to spatial audio
  return (
    <div className="absolute top-44 right-4 z-20">
      <Card className="bg-black/80 backdrop-blur-sm border-gray-700 text-white">
        <CardContent className="p-2 flex items-center gap-2">
          {isEnabled ? (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm">Narration</span>
              {isPlaying && !isPaused && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handlePlayPause}>
                {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onToggle}>
                <VolumeX className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-sm">Narration off</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onToggle}>
                <Volume2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
