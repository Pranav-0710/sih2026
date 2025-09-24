import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from "lucide-react"

interface AudioTrack {
  id: string
  title: string
  description: string
  duration: string
  type: "introduction" | "location" | "hotspot" | "cultural"
}

interface AudioGuideProps {
  locationId: string
  isEnabled: boolean
  onToggle: () => void
  tracks: AudioTrack[]
}

export function AudioGuide({ locationId, isEnabled, onToggle, tracks }: AudioGuideProps) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Auto-play location introduction when enabled
  useEffect(() => {
    if (isEnabled && tracks.length > 0) {
      const introTrack = tracks.find((track) => track.type === "introduction") || tracks[0]
      setCurrentTrack(introTrack)
    }
  }, [isEnabled, locationId, tracks])

  // Simulate audio playback (in a real app, you'd use actual audio files)
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          if (newTime >= duration) {
            setIsPlaying(false)
            return 0
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPlaying, currentTrack, duration])

  // Set duration when track changes
  useEffect(() => {
    if (currentTrack) {
      // Simulate different durations based on track type
      const durations = {
        introduction: 45,
        location: 90,
        hotspot: 30,
        cultural: 120,
      }
      setDuration(durations[currentTrack.type] || 60)
      setCurrentTime(0)
    }
  }, [currentTrack])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTrackSelect = (track: AudioTrack) => {
    setCurrentTrack(track)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleNext = () => {
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % tracks.length
    setCurrentTrack(tracks[nextIndex])
    setIsPlaying(false)
  }

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack?.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
    setCurrentTrack(tracks[prevIndex])
    setIsPlaying(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isEnabled) {
    return (
      <div className="absolute top-20 right-4 z-20">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Enable Audio Guide
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-20 right-4 w-80 z-20">
      <Card className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Audio Guide</h3>
            <Button variant="ghost" size="sm" onClick={onToggle} className="text-white hover:bg-white/20">
              <VolumeX className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Track Info */}
          {currentTrack && (
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <h4 className="font-medium mb-1">{currentTrack.title}</h4>
              <p className="text-sm text-gray-300 mb-2">{currentTrack.description}</p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrevious} className="text-white hover:bg-white/20">
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleNext} className="text-white hover:bg-white/20">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Track List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <h5 className="text-sm font-medium text-gray-300 mb-2">Available Tracks</h5>
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`p-2 rounded cursor-pointer transition-all duration-200 ${
                  currentTrack?.id === track.id ? "bg-primary/20 border border-primary" : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => handleTrackSelect(track)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h6 className="text-sm font-medium">{track.title}</h6>
                    <p className="text-xs text-gray-400">{track.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{track.duration}</span>
                    {currentTrack?.id === track.id && isPlaying && (
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
