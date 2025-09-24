import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, ZoomIn, ZoomOut, Home, Info, BookOpen, Gamepad2, Star } from "lucide-react"
import { Hotspot } from "./hotspot"
import { LocationNavigator } from "./location-navigator"
// AudioGuide removed per requirements (no guide audio UI)
import { EducationalPanel } from "./educational-panel"
import { SpatialAudioSystem, SpatialAudioSystemRef } from "./spatial-audio-system"
import { TextToSpeech } from "./text-to-speech"
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
  const [rotation, setRotation] = useState({ pitch: 0, yaw: 0 })
  const [zoom, setZoom] = useState(75) // Field of view in degrees
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [showHotspots, setShowHotspots] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [showNavigator, setShowNavigator] = useState(false)
  // Guide audio removed; narration control kept minimal, spatial audio auto-enabled
  const [showEducationalPanel, setShowEducationalPanel] = useState(false)
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true)
  const [ttsEnabled, setTtsEnabled] = useState(audioEnabled) // Use prop to control narration
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false)
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0, z: 0 })
  const [showTriviaQuiz, setShowTriviaQuiz] = useState(false)
  const spatialAudioRef = useRef<SpatialAudioSystemRef>(null)

  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const sphereBufferRef = useRef<{
    position: WebGLBuffer | null
    texCoord: WebGLBuffer | null
    indices: WebGLBuffer | null
    indexCount: number
  }>({ position: null, texCoord: null, indices: null, indexCount: 0 })

  useEffect(() => {
    setRotation({ pitch: 0, yaw: 0 })
    setZoom(75)
    setShowHotspots(false)
    setActiveHotspot(null)
    setIsLoading(true)
    setShowEducationalPanel(false)
    // Auto-start spatial audio, use prop for narration
    setSpatialAudioEnabled(true)
    setTtsEnabled(audioEnabled)
  }, [location.id, audioEnabled])

  // Auto-stop audio when VR closes
  useEffect(() => {
    return () => {
      // Cleanup function runs when component unmounts (VR closes)
      setSpatialAudioEnabled(false)
      setTtsEnabled(false)
    }
  }, [])

  const handleSpatialAudioCleanup = () => {
    setSpatialAudioEnabled(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
    if (!gl) {
      console.error("[v0] WebGL not supported, falling back to 2D canvas")
      return
    }

    // Check for WebGL errors
    const error = gl.getError()
    if (error !== gl.NO_ERROR) {
      console.error("[v0] WebGL error during initialization:", error)
    }

    glRef.current = gl

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec2 a_texCoord;
      uniform mat4 u_viewMatrix;
      uniform mat4 u_projectionMatrix;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 v_texCoord;
      
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      console.error("[v0] Failed to create shaders")
      return
    }

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
      console.error("[v0] Failed to create program")
      return
    }

    programRef.current = program
    gl.useProgram(program)

    createSphereGeometry(gl)

    // Ensure we clear with black to avoid flashes
    gl.clearColor(0, 0, 0, 1)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (!isLoading && textureRef.current) {
        render360View(gl)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const gl = glRef.current
    if (!gl || !programRef.current) return

    const img = new Image()
    // local assets do not need CORS; setting crossOrigin can cause taint issues on some setups

    img.onload = () => {
      try {
        const texture = gl.createTexture()
        if (!texture) {
          console.error("[v0] Failed to create texture")
          setIsLoading(false)
          return
        }

        gl.bindTexture(gl.TEXTURE_2D, texture)
        // NPOT textures must use CLAMP_TO_EDGE on both axes and no mipmaps
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

        // Check for WebGL errors after texture operations
        const error = gl.getError()
        if (error !== gl.NO_ERROR) {
          console.error("[v0] WebGL error during texture creation:", error)
        }

        textureRef.current = texture
        setIsLoading(false)
        // render once texture is ready
        render360View(gl)
      } catch (error) {
        console.error("[v0] Error loading texture:", error)
        setIsLoading(false)
      }
    }

    img.onerror = () => {
      console.error("[v0] Failed to load 360-degree image:", location.panoramaImage || location.image)
      setIsLoading(false)
    }

    img.src = location.panoramaImage || location.image
  }, [location.id])

  useEffect(() => {
    const gl = glRef.current
    if (!gl || !programRef.current || !textureRef.current || isLoading) return

    render360View(gl)
  }, [rotation, zoom, isLoading])

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("[v0] Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null => {
    const program = gl.createProgram()
    if (!program) return null

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[v0] Program linking error:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    return program
  }

  const createSphereGeometry = (gl: WebGLRenderingContext) => {
    const radius = 1
    const widthSegments = 64
    const heightSegments = 32

    const positions: number[] = []
    const texCoords: number[] = []
    const indices: number[] = []

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments
      const phi = v * Math.PI

      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments
        const theta = u * Math.PI * 2

        const px = -radius * Math.cos(theta) * Math.sin(phi)
        const py = radius * Math.cos(phi)
        const pz = radius * Math.sin(theta) * Math.sin(phi)

        positions.push(px, py, pz)
        texCoords.push(u, 1 - v)
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = y * (widthSegments + 1) + x
        const b = a + widthSegments + 1
        const c = a + 1
        const d = b + 1

        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    sphereBufferRef.current = {
      position: positionBuffer,
      texCoord: texCoordBuffer,
      indices: indexBuffer,
      indexCount: indices.length,
    }
  }

  const render360View = (gl: WebGLRenderingContext) => {
    if (!programRef.current || !textureRef.current || !sphereBufferRef.current.position) return

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    // Ensure we're rendering interior of the sphere
    gl.disable(gl.CULL_FACE)

    const canvas = gl.canvas as HTMLCanvasElement
    const aspect = canvas.width / canvas.height
    const fov = (zoom * Math.PI) / 180
    const projectionMatrix = createPerspectiveMatrix(fov, aspect, 0.1, 100)

    const viewMatrix = createViewMatrix(rotation.pitch, rotation.yaw)

    gl.useProgram(programRef.current)
    const projectionLocation = gl.getUniformLocation(programRef.current, "u_projectionMatrix")
    const viewLocation = gl.getUniformLocation(programRef.current, "u_viewMatrix")
    const textureLocation = gl.getUniformLocation(programRef.current, "u_texture")

    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix)
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix)
    gl.uniform1i(textureLocation, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)

    const positionLocation = gl.getAttribLocation(programRef.current, "a_position")
    const texCoordLocation = gl.getAttribLocation(programRef.current, "a_texCoord")

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBufferRef.current.position)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBufferRef.current.texCoord)
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBufferRef.current.indices)
    gl.drawElements(gl.TRIANGLES, sphereBufferRef.current.indexCount, gl.UNSIGNED_SHORT, 0)
  }

  const createPerspectiveMatrix = (fov: number, aspect: number, near: number, far: number): Float32Array => {
    const f = 1.0 / Math.tan(fov / 2)
    const rangeInv = 1 / (near - far)

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ])
  }

  const createViewMatrix = (pitch: number, yaw: number): Float32Array => {
    const pitchRad = (pitch * Math.PI) / 180
    const yawRad = (yaw * Math.PI) / 180

    const cosPitch = Math.cos(pitchRad)
    const sinPitch = Math.sin(pitchRad)
    const cosYaw = Math.cos(yawRad)
    const sinYaw = Math.sin(yawRad)

    return new Float32Array([
      cosYaw,
      0,
      sinYaw,
      0,
      sinYaw * sinPitch,
      cosPitch,
      -cosYaw * sinPitch,
      0,
      -sinYaw * cosPitch,
      sinPitch,
      cosYaw * cosPitch,
      0,
      0,
      0,
      0,
      1,
    ])
  }

  useEffect(() => {
    const yawRad = (rotation.yaw * Math.PI) / 180
    const pitchRad = (rotation.pitch * Math.PI) / 180

    setUserPosition({
      x: Math.sin(yawRad) * Math.cos(pitchRad) * 10,
      y: Math.sin(pitchRad) * 10,
      z: Math.cos(yawRad) * Math.cos(pitchRad) * 10,
    })
  }, [rotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setRotation((prev) => ({
      pitch: Math.max(-90, Math.min(90, prev.pitch - deltaY * 0.2)),
      yaw: prev.yaw + deltaX * 0.2,
    }))

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.max(30, prev - 10))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.min(120, prev + 10))
  }

  const handleReset = () => {
    setRotation({ pitch: 0, yaw: 0 })
    setZoom(75)
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

  const handleToggleEducationalPanel = () => {
    setShowEducationalPanel(!showEducationalPanel)
  }

  // Narration vs Spatial exclusivity
  const handleToggleNarration = () => {
    setTtsEnabled((prev) => {
      const next = !prev
      setSpatialAudioEnabled(!next)
      return next
    })
  }


  const handleStartTriviaQuiz = () => {
    setShowTriviaQuiz(true)
  }

  const handleGameComplete = (score: number) => {
    setShowTriviaQuiz(false)
  }

  const spatialAudioSources =
    location.hotspots?.map((hotspot, index) => {
      const u = hotspot.position.x / 100
      const v = hotspot.position.y / 100

      const theta = u * Math.PI * 2
      const phi = v * Math.PI

      return {
        id: hotspot.id,
        name: hotspot.title,
        position: {
          x: -Math.cos(theta) * Math.sin(phi) * 8,
          y: Math.cos(phi) * 8,
          z: Math.sin(theta) * Math.sin(phi) * 8,
        },
        volume: 0.4,
        maxDistance: 20,
        rolloffFactor: 1.2,
        type: hotspot.type === "wildlife" ? "point" : hotspot.type === "nature" ? "ambient" : "directional",
      }
    }) || []

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

  // Check if we should use iframe for Skybox content
  const isSkyboxUrl = location.panoramaImage && location.panoramaImage.startsWith('http')

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading 360° Experience...</p>
            <p className="text-sm text-gray-400 mt-2">Preparing immersive view of {location.name}</p>
          </div>
        </div>
      )}

      {isSkyboxUrl ? (
        <iframe
          src={location.panoramaImage}
          className="w-full h-full border-0"
          allow="fullscreen"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: "none" }}
        />
      )}

      <LocationNavigator
        locations={allLocations}
        currentLocationId={location.id}
        onLocationChange={handleLocationChange}
        isVisible={showNavigator}
        onToggleVisibility={handleToggleNavigator}
      />

      {/* Guide audio removed intentionally */}

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

      <SpatialAudioSystem
        ref={spatialAudioRef}
        isEnabled={spatialAudioEnabled}
        onToggle={() => {
          setSpatialAudioEnabled((prev) => !prev)
        }}
        userPosition={userPosition}
        userRotation={{ x: rotation.pitch, y: rotation.yaw, z: 0 }}
        locationId={location.id}
        isNarrationPlaying={isNarrationPlaying}
        hideControls={true}
        onCleanup={handleSpatialAudioCleanup}
      />

      <TextToSpeech
        isEnabled={ttsEnabled}
        onToggle={handleToggleNarration}
        content={ttsContent}
        locationId={location.id}
        autoPlay={true}
        headless={true}
        hideControls={true}
        onPlayingStateChange={setIsNarrationPlaying}
        onNarrationEnd={() => {
          setTtsEnabled(false)
          // Keep spatial audio enabled and looping
          setSpatialAudioEnabled(true)
        }}
      />


      <TriviaQuiz
        isVisible={showTriviaQuiz}
        onClose={() => setShowTriviaQuiz(false)}
        locationId={location.id}
        locationName={location.name}
        onComplete={handleGameComplete}
      />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
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

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            // Cleanup spatial audio before closing
            if (spatialAudioRef.current) {
              spatialAudioRef.current.cleanup()
            }
            setSpatialAudioEnabled(false)
            setTtsEnabled(false)
            onClose()
          }}
          className="bg-black/80 backdrop-blur-sm hover:bg-black/90"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

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


          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartTriviaQuiz}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Star className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              // Cleanup spatial audio before closing
              if (spatialAudioRef.current) {
                spatialAudioRef.current.cleanup()
              }
              setSpatialAudioEnabled(false)
              setTtsEnabled(false)
              onClose()
            }} 
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <p className="text-sm opacity-75">
          Drag to explore 360° • Scroll or zoom controls to adjust view •{" "}
          {location.hotspots && location.hotspots.length > 0 ? "Click Info for hotspots • " : ""}
          {location.educationalContent ? "Click Book for learning • " : ""}
          Click Star for quiz • Full spherical immersion enabled
        </p>
      </div>
    </div>
  )
}
