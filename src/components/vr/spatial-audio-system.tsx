import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX } from "lucide-react"
import * as THREE from "three"

interface SpatialAudioSystemProps {
  isEnabled: boolean
  userPosition: { x: number; y: number; z: number }
  userRotation: { x: number; y: number; z: number }
  locationId: string
  onToggle?: () => void
  isNarrationPlaying?: boolean
  hideControls?: boolean
  onCleanup?: () => void
}

export interface SpatialAudioSystemRef {
  cleanup: () => void
}

export const SpatialAudioSystem = forwardRef<SpatialAudioSystemRef, SpatialAudioSystemProps>(({
  isEnabled,
  userPosition,
  userRotation,
  locationId,
  onToggle,
  isNarrationPlaying = false,
  hideControls = false,
  onCleanup
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const audioRef = useRef<THREE.PositionalAudio | null>(null)
  const listenerRef = useRef<THREE.AudioListener | null>(null)
  const audioLoaderRef = useRef<THREE.AudioLoader | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)

  // Expose cleanup method via ref
  useImperativeHandle(ref, () => ({
    cleanup: () => {
      try {
        if (audioRef.current) {
          audioRef.current.stop()
          audioRef.current.disconnect()
          audioRef.current = null
        }
        if (listenerRef.current) {
          try {
            if (listenerRef.current.context && listenerRef.current.context.state !== 'closed') {
              listenerRef.current.context.suspend()
            }
          } catch (e) {
            // Ignore errors during cleanup
          }
          listenerRef.current = null
        }
        audioLoaderRef.current = null
        audioBufferRef.current = null
        sceneRef.current = null
        cameraRef.current = null
        setIsPlaying(false)
        setIsPaused(false)
        if (onCleanup) {
          onCleanup()
        }
      } catch (error) {
        console.error('Error during spatial audio manual cleanup:', error)
      }
    }
  }), [onCleanup])

  // Initialize Three.js audio system
  useEffect(() => {
    if (!isEnabled) return

    try {
      // Create audio listener
      const listener = new THREE.AudioListener()
      listenerRef.current = listener

      // Create audio loader
      const audioLoader = new THREE.AudioLoader()
      audioLoaderRef.current = audioLoader

      // Create a minimal scene for audio positioning
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Create camera for audio positioning
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.add(listener)
      cameraRef.current = camera

      // Load audio file
      audioLoader.load(
        '/assets/sound.mp3',
        (buffer) => {
          try {
            audioBufferRef.current = buffer
            createPositionalAudio(scene, camera, buffer)
          } catch (error) {
            console.error('Error creating positional audio:', error)
          }
        },
        undefined,
        (error) => {
          console.error('Failed to load spatial audio:', error)
        }
      )
    } catch (error) {
      console.error('Error initializing spatial audio system:', error)
    }

    return () => {
      // Cleanup
      try {
        if (audioRef.current) {
          audioRef.current.stop()
          audioRef.current.disconnect()
        }
        // AudioListener doesn't have disconnect method, just clear reference
        listenerRef.current = null
        audioLoaderRef.current = null
        audioBufferRef.current = null
        sceneRef.current = null
        cameraRef.current = null
        setIsPlaying(false)
        setIsPaused(false)
        if (onCleanup) {
          onCleanup()
        }
      } catch (error) {
        console.error('Error during spatial audio cleanup:', error)
      }
    }
  }, [isEnabled, locationId])

  // Additional cleanup effect for component unmounting
  useEffect(() => {
    return () => {
      // This runs when component unmounts
      try {
        if (audioRef.current) {
          audioRef.current.stop()
          audioRef.current.disconnect()
          audioRef.current = null
        }
        if (listenerRef.current) {
          // Try to stop any playing audio
          try {
            if (listenerRef.current.context && listenerRef.current.context.state !== 'closed') {
              listenerRef.current.context.suspend()
            }
          } catch (e) {
            // Ignore errors during cleanup
          }
          listenerRef.current = null
        }
        audioLoaderRef.current = null
        audioBufferRef.current = null
        sceneRef.current = null
        cameraRef.current = null
        setIsPlaying(false)
        setIsPaused(false)
        if (onCleanup) {
          onCleanup()
        }
      } catch (error) {
        console.error('Error during spatial audio unmount cleanup:', error)
      }
    }
  }, [])

  const createPositionalAudio = (scene: THREE.Scene, camera: THREE.Camera, buffer: AudioBuffer) => {
    try {
      if (!listenerRef.current) {
        console.error('Audio listener not available')
        return
      }

      // Create positional audio
      const positionalAudio = new THREE.PositionalAudio(listenerRef.current)
      audioRef.current = positionalAudio

      // Set audio properties
      positionalAudio.setBuffer(buffer)
      positionalAudio.setLoop(true)
      positionalAudio.setVolume(0.3) // Lower volume for ambient sound
      positionalAudio.setRefDistance(5)
      positionalAudio.setMaxDistance(50)
      positionalAudio.setRolloffFactor(1.2)

      // Position the audio source in 3D space (near a hotspot)
      const audioPosition = new THREE.Vector3(10, 0, 5) // Position near a hotspot
      const audioGeometry = new THREE.SphereGeometry(0.1, 8, 6)
      const audioMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false })
      const audioMesh = new THREE.Mesh(audioGeometry, audioMaterial)
      audioMesh.position.copy(audioPosition)
      audioMesh.add(positionalAudio)
      scene.add(audioMesh)

      // Start playing
      try {
        positionalAudio.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Failed to start spatial audio:', error)
        // Try to resume audio context if it's suspended
        if (listenerRef.current?.context?.state === 'suspended') {
          listenerRef.current.context.resume().then(() => {
            try {
              positionalAudio.play()
              setIsPlaying(true)
            } catch (retryError) {
              console.error('Failed to start spatial audio after context resume:', retryError)
            }
          }).catch((resumeError) => {
            console.error('Failed to resume audio context:', resumeError)
          })
        }
      }
    } catch (error) {
      console.error('Error in createPositionalAudio:', error)
    }
  }

  // Update camera position and rotation for audio positioning
  useEffect(() => {
    if (!cameraRef.current || !listenerRef.current) return

    // Update camera position
    cameraRef.current.position.set(userPosition.x, userPosition.y, userPosition.z)
    
    // Update camera rotation for audio orientation
    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(userRotation.x),
      THREE.MathUtils.degToRad(userRotation.y),
      0,
      'YXZ'
    )
    cameraRef.current.setRotationFromEuler(euler)
  }, [userPosition, userRotation])

  // Handle narration pause/resume
  useEffect(() => {
    if (!audioRef.current) return

    try {
      if (isNarrationPlaying) {
        // Pause spatial audio when narration is playing
        if (isPlaying && !isPaused) {
          audioRef.current.pause()
          setIsPaused(true)
        }
      } else {
        // Resume spatial audio when narration stops
        if (isPaused) {
          audioRef.current.play()
          setIsPaused(false)
        }
      }
    } catch (error) {
      console.error('Error handling narration pause/resume:', error)
    }
  }, [isNarrationPlaying, isPlaying, isPaused])

  // Handle manual toggle
  const handleToggle = () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        if (isPaused) {
          audioRef.current.play()
          setIsPaused(false)
        } else {
          audioRef.current.pause()
          setIsPaused(true)
        }
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }

      if (onToggle) {
        onToggle()
      }
    } catch (error) {
      console.error('Error in handleToggle:', error)
    }
  }

  // Hide controls if hideControls is true
  if (hideControls) {
    return null
  }

  // Minimal visible control so user can stop ambient audio
  return (
    <div className="absolute top-32 right-4 z-20">
      <Card className="bg-black/80 backdrop-blur-sm border-gray-700 text-white">
        <CardContent className="p-2 flex items-center gap-2">
          {isEnabled && isPlaying ? (
            <>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="text-sm">Spatial audio</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleToggle}>
                {isPaused ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-sm">Spatial audio off</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleToggle}>
                <Volume2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

SpatialAudioSystem.displayName = "SpatialAudioSystem"
