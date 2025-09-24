"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Coffee,
  Film,
  Mountain,
  Waves,
  Sun,
  Palette,
  Droplets,
  X,
  Sparkles,
  Heart,
  Star,
  TreePine,
  Camera,
  Utensils,
  Building,
} from "lucide-react"
import "@/styles/GenzCorner.css";
import Navigation from "@/components/Navigation"

interface RoadmapSpot {
  id: number
  name: string
  location: string
  highlight: string
  description: string
  icon: React.ReactNode
  emoji: string
  gradient: string
  stickerColor: string
}

const roadmapSpots: RoadmapSpot[] = [
  {
    id: 1,
    name: "Patratu Valley Viewpoint",
    location: "Ramgarh",
    highlight: "Selfie Point",
    description: "Breathtaking valley views perfect for Instagram",
    icon: <Mountain className="w-5 h-5" />,
    emoji: "📸",
    gradient: "from-green-600 via-green-500 to-emerald-500",
    stickerColor: "bg-gradient-to-r from-green-500 to-emerald-400",
  },
  {
    id: 2,
    name: "Hundru Falls",
    location: "Ranchi",
    highlight: "Natural Spot",
    description: "Waterfall selfies with misty natural beauty",
    icon: <Waves className="w-5 h-5" />,
    emoji: "🌿",
    gradient: "from-blue-500 via-teal-500 to-green-500",
    stickerColor: "bg-gradient-to-r from-blue-400 to-teal-400",
  },
  {
    id: 3,
    name: "Tagore Hill Murals",
    location: "Ranchi",
    highlight: "Art Spot",
    description: "Colorful murals with panoramic city views",
    icon: <Palette className="w-5 h-5" />,
    emoji: "🎨",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    stickerColor: "bg-gradient-to-r from-orange-400 to-red-400",
  },
  {
    id: 4,
    name: "Café Coffee Day",
    location: "Ranchi",
    highlight: "Youth Hangout",
    description: "Popular coffee chain with cozy ambiance",
    icon: <Coffee className="w-5 h-5" />,
    emoji: "☕",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    stickerColor: "bg-gradient-to-r from-amber-400 to-orange-400",
  },
  {
    id: 5,
    name: "Netarhat Sunrise Point",
    location: "Latehar",
    highlight: "Golden Hour",
    description: "Hill station with stunning sunrise views",
    icon: <Sun className="w-5 h-5" />,
    emoji: "🌅",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    stickerColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
  },
  {
    id: 6,
    name: "Dassam Falls",
    location: "Near Ranchi",
    highlight: "Adventure Spot",
    description: "Cascading waterfall surrounded by lush greenery",
    icon: <Droplets className="w-5 h-5" />,
    emoji: "💧",
    gradient: "from-cyan-500 via-blue-500 to-teal-500",
    stickerColor: "bg-gradient-to-r from-cyan-400 to-blue-400",
  },
  {
    id: 7,
    name: "Urban Brava Café",
    location: "Jamshedpur",
    highlight: "Trendy Spot",
    description: "Modern café with Instagram-worthy interiors",
    icon: <Sparkles className="w-5 h-5" />,
    emoji: "✨",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    stickerColor: "bg-gradient-to-r from-emerald-400 to-teal-400",
  },
  {
    id: 8,
    name: "Betla National Park",
    location: "Latehar",
    highlight: "Movie Location",
    description: "Wildlife sanctuary featured in Bollywood films",
    icon: <Film className="w-5 h-5" />,
    emoji: "🎬",
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    stickerColor: "bg-gradient-to-r from-lime-400 to-green-400",
  },
  {
    id: 9,
    name: "Jonha Falls",
    location: "Ranchi District",
    highlight: "Sacred Spot",
    description: "Sacred waterfall with natural swimming pools",
    icon: <Heart className="w-5 h-5" />,
    emoji: "💖",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    stickerColor: "bg-gradient-to-r from-rose-400 to-pink-400",
  },
  {
    id: 10,
    name: "Rock Garden",
    location: "Ranchi",
    highlight: "Selfie Point",
    description: "Artistic rock formations and sculptures",
    icon: <Camera className="w-5 h-5" />,
    emoji: "📸",
    gradient: "from-stone-500 via-gray-500 to-slate-500",
    stickerColor: "bg-gradient-to-r from-stone-400 to-gray-400",
  },
  {
    id: 11,
    name: "Birsa Zoological Park",
    location: "Ranchi",
    highlight: "Natural Spot",
    description: "Wildlife photography and nature walks",
    icon: <TreePine className="w-5 h-5" />,
    emoji: "🌿",
    gradient: "from-green-600 via-forest-500 to-emerald-600",
    stickerColor: "bg-gradient-to-r from-green-500 to-forest-400",
  },
  {
    id: 12,
    name: "Kanke Dam",
    location: "Ranchi",
    highlight: "Natural Spot",
    description: "Serene lake perfect for sunset photography",
    icon: <Waves className="w-5 h-5" />,
    emoji: "🌿",
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
    stickerColor: "bg-gradient-to-r from-blue-500 to-indigo-400",
  },
  {
    id: 13,
    name: "Tribal Museum Café",
    location: "Ranchi",
    highlight: "Cultural Hangout",
    description: "Café showcasing tribal art and culture",
    icon: <Utensils className="w-5 h-5" />,
    emoji: "☕",
    gradient: "from-amber-600 via-yellow-500 to-orange-500",
    stickerColor: "bg-gradient-to-r from-amber-500 to-yellow-400",
  },
  {
    id: 14,
    name: "Deoghar Temple Complex",
    location: "Deoghar",
    highlight: "Movie Location",
    description: "Ancient temples featured in regional films",
    icon: <Building className="w-5 h-5" />,
    emoji: "🎬",
    gradient: "from-orange-600 via-red-500 to-pink-500",
    stickerColor: "bg-gradient-to-r from-orange-500 to-red-400",
  },
  {
    id: 15,
    name: "Dimna Lake",
    location: "Jamshedpur",
    highlight: "Selfie Point",
    description: "Picturesque lake with boating facilities",
    icon: <Camera className="w-5 h-5" />,
    emoji: "📸",
    gradient: "from-teal-600 via-cyan-500 to-blue-500",
    stickerColor: "bg-gradient-to-r from-teal-500 to-cyan-400",
  },
  {
    id: 16,
    name: "Jubilee Park Café",
    location: "Jamshedpur",
    highlight: "Youth Hangout",
    description: "Garden café with outdoor seating",
    icon: <Coffee className="w-5 h-5" />,
    emoji: "☕",
    gradient: "from-green-600 via-lime-500 to-yellow-500",
    stickerColor: "bg-gradient-to-r from-green-500 to-lime-400",
  },
]

function getLocationImage(placeName: string): string {
  const imageMap: { [key: string]: string } = {
    "Patratu Valley Viewpoint":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center",
    "Hundru Falls": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop&crop=center",
    "Tagore Hill Murals":
      "https://images.unsplash.com/photo-1578662996442-ac426a4a7cbb?w=400&h=200&fit=crop&crop=center",
    "Café Coffee Day": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&crop=center",
    "Netarhat Sunrise Point":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center",
    "Dassam Falls": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop&crop=center",
    "Urban Brava Café": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&crop=center",
    "Betla National Park": "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=200&fit=crop&crop=center",
    "Jonha Falls": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop&crop=center",
    "Rock Garden": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center",
    "Birsa Zoological Park":
      "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=200&fit=crop&crop=center",
    "Kanke Dam": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center",
    "Tribal Museum Café":
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&crop=center",
    "Deoghar Temple Complex":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=center",
    "Dimna Lake": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center",
    "Jubilee Park Café": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&crop=center",
  }
  return imageMap[placeName] || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(placeName)}`
}

const JourneyPath = ({ spots }: { spots: RoadmapSpot[] }) => {
  const getCircularPosition = (index: number) => {
    const centerX = 50
    const centerY = 50

    // Center icon (index 0)
    if (index === 0) {
      return { x: centerX, y: centerY }
    }

    // Inner ring (indices 1-5) - 5 icons
    if (index >= 1 && index <= 5) {
      const innerRadius = 28
      const angle = ((index - 1) * 72 - 90) * (Math.PI / 180) // 72 degrees apart, starting from top
      return {
        x: centerX + innerRadius * Math.cos(angle),
        y: centerY + innerRadius * Math.sin(angle),
      }
    }

    // Outer ring (indices 6-15) - 10 icons
    if (index >= 6 && index <= 15) {
      const outerRadius = 45
      const angle = ((index - 6) * 36 - 90) * (Math.PI / 180) // 36 degrees apart, starting from top
      return {
        x: centerX + outerRadius * Math.cos(angle),
        y: centerY + outerRadius * Math.sin(angle),
      }
    }

    return { x: 50, y: 50 }
  }

  const createCurvyZigZagPath = (
    fromPos: { x: number; y: number },
    toPos: { x: number; y: number },
    zigzagIntensity = 15,
  ) => {
    const midX = (fromPos.x + toPos.x) / 2
    const midY = (fromPos.y + toPos.y) / 2

    // Create zig-zag control points
    const controlX1 = midX + Math.sin(zigzagIntensity) * zigzagIntensity
    const controlY1 = midY - Math.cos(zigzagIntensity) * zigzagIntensity
    const controlX2 = midX - Math.sin(zigzagIntensity) * (zigzagIntensity * 0.7)
    const controlY2 = midY + Math.cos(zigzagIntensity) * (zigzagIntensity * 0.7)

    return `M ${fromPos.x}% ${fromPos.y}% C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${toPos.x}% ${toPos.y}%`
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: "100%" }}>
      <defs>
        <linearGradient id="earthy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="25%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#059669" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <marker id="arrowhead" markerWidth="20" markerHeight="15" refX="18" refY="7" orient="auto">
          <polygon points="0 0, 20 7, 0 14" fill="url(#earthy-gradient)" stroke="#ffffff" strokeWidth="2" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[1, 2, 3, 4, 5].map((currentIndex) => {
        const nextIndex = currentIndex === 5 ? 1 : currentIndex + 1 // Loop back to 1 after 5
        const fromPos = getCircularPosition(currentIndex)
        const toPos = getCircularPosition(nextIndex)
        const zigzagIntensity = 12 + (currentIndex % 3) * 4

        return (
          <g key={`inner-ring-${currentIndex}-${nextIndex}`}>
            <path
              d={createCurvyZigZagPath(fromPos, toPos, zigzagIntensity)}
              stroke="url(#earthy-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.8"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />
            <path
              d={createCurvyZigZagPath(fromPos, toPos, zigzagIntensity)}
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        )
      })}

      {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((currentIndex) => {
        const nextIndex = currentIndex === 15 ? 6 : currentIndex + 1 // Loop back to 6 after 15
        const fromPos = getCircularPosition(currentIndex)
        const toPos = getCircularPosition(nextIndex)
        const zigzagIntensity = 10 + (currentIndex % 4) * 3

        return (
          <g key={`outer-ring-${currentIndex}-${nextIndex}`}>
            <path
              d={createCurvyZigZagPath(fromPos, toPos, zigzagIntensity)}
              stroke="url(#earthy-gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.7"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
            <path
              d={createCurvyZigZagPath(fromPos, toPos, zigzagIntensity)}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )
      })}

      {[1, 2, 3, 4, 5].map((targetIndex) => {
        const centerPos = getCircularPosition(0)
        const targetPos = getCircularPosition(targetIndex)

        // Create flowing curved path
        const midX = (centerPos.x + targetPos.x) / 2
        const midY = (centerPos.y + targetPos.y) / 2
        const controlX1 = midX + Math.sin(targetIndex) * 8
        const controlY1 = midY + Math.cos(targetIndex) * 8
        const controlX2 = midX - Math.sin(targetIndex) * 6
        const controlY2 = midY - Math.cos(targetIndex) * 6

        return (
          <g key={`center-to-inner-${targetIndex}`}>
            <path
              d={`M ${centerPos.x}% ${centerPos.y}% C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${targetPos.x}% ${targetPos.y}%`}
              stroke="url(#earthy-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.8"
              markerEnd="url(#arrowhead)"
            />
            <path
              d={`M ${centerPos.x}% ${centerPos.y}% C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${targetPos.x}% ${targetPos.y}%`}
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        )
      })}

      {[
        { from: 1, to: 6 },
        { from: 1, to: 15 },
        { from: 2, to: 7 },
        { from: 2, to: 8 },
        { from: 3, to: 9 },
        { from: 3, to: 10 },
        { from: 4, to: 11 },
        { from: 4, to: 12 },
        { from: 5, to: 13 },
        { from: 5, to: 14 },
      ].map(({ from, to }, index) => {
        const fromPos = getCircularPosition(from)
        const toPos = getCircularPosition(to)

        // Create more dramatic wavy curved path
        const midX = (fromPos.x + toPos.x) / 2
        const midY = (fromPos.y + toPos.y) / 2
        const waveAmplitude = 15 + (index % 3) * 5
        const controlX1 = midX + Math.sin(index * 0.8) * waveAmplitude
        const controlY1 = midY + Math.cos(index * 0.8) * waveAmplitude
        const controlX2 = midX - Math.sin(index * 1.2) * (waveAmplitude * 0.7)
        const controlY2 = midY - Math.cos(index * 1.2) * (waveAmplitude * 0.7)

        return (
          <g key={`inner-to-outer-${from}-${to}`}>
            <path
              d={`M ${fromPos.x}% ${fromPos.y}% C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${toPos.x}% ${toPos.y}%`}
              stroke="url(#earthy-gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.7"
              markerEnd="url(#arrowhead)"
            />
            <path
              d={`M ${fromPos.x}% ${fromPos.y}% C ${controlX1}% ${controlY1}%, ${controlX2}% ${controlY2}%, ${toPos.x}% ${toPos.y}%`}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )
      })}
    </svg>
  )
}

export default function GenzCorner() {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null)
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null)
  const [animatedSpots, setAnimatedSpots] = useState<Set<number>>(new Set())

  useEffect(() => {
    roadmapSpots.forEach((spot, index) => {
      setTimeout(() => {
        setAnimatedSpots((prev) => new Set([...prev, spot.id]))
      }, index * 150)
    })
  }, [])

  const getCircularPosition = (index: number) => {
    const centerX = 50
    const centerY = 50

    // Center icon (index 0)
    if (index === 0) {
      return { x: centerX, y: centerY }
    }

    // Inner ring (indices 1-5) - 5 icons
    if (index >= 1 && index <= 5) {
      const innerRadius = 28
      const angle = ((index - 1) * 72 - 90) * (Math.PI / 180) // 72 degrees apart, starting from top
      return {
        x: centerX + innerRadius * Math.cos(angle),
        y: centerY + innerRadius * Math.sin(angle),
      }
    }

    // Outer ring (indices 6-15) - 10 icons
    if (index >= 6 && index <= 15) {
      const outerRadius = 45
      const angle = ((index - 6) * 36 - 90) * (Math.PI / 180) // 36 degrees apart, starting from top
      return {
        x: centerX + outerRadius * Math.cos(angle),
        y: centerY + outerRadius * Math.sin(angle),
      }
    }

    return { x: 50, y: 50 }
  }

  return (
    <>
    <Navigation />
    <section className="py-16 gen-z-bg min-h-screen relative overflow-hidden genz-corner-theme">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <Star className="absolute top-20 right-1/3 w-8 h-8 text-yellow-500 opacity-60 animate-wiggle" />
        <Sparkles
          className="absolute bottom-32 right-10 w-6 h-6 text-green-500 opacity-60 animate-wiggle"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="text-center mb-16 px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-orange-600 to-yellow-600 mb-4 animate-bounce-in">
          Gen Z Corner
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Jharkhand's{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">
            Instagrammable Hub
          </span>
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg text-balance">
          Your ultimate journey through the most photogenic spots! 🌿📸
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div
          className={`relative transition-opacity duration-300 ${selectedSpot ? "opacity-30" : "opacity-100"}`}
          style={{ minHeight: "900px", position: "relative" }}
        >
          {!selectedSpot && <JourneyPath spots={roadmapSpots} />}

          {roadmapSpots.map((spot, index) => {
            const position = getCircularPosition(index)
            const isCenter = index === 0
            const isInnerRing = index >= 1 && index <= 5
            const iconSize = isCenter ? "w-20 h-20" : isInnerRing ? "w-16 h-16" : "w-14 h-14"
            const textSize = isCenter ? "text-base" : "text-sm"

            return (
              <div
                key={spot.id}
                className={`absolute flex flex-col items-center z-10 transform -translate-x-1/2 -translate-y-1/2 ${
                  animatedSpots.has(spot.id) ? "animate-bounce-in" : "opacity-0"
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <button
                    className={`
                      relative ${iconSize} rounded-full sticker-badge
                      flex items-center justify-center text-white font-black ${textSize}
                      transition-all duration-300 ease-out cursor-pointer z-20
                      transform-gpu shadow-lg hover:shadow-xl
                      ${hoveredSpot === spot.id ? "scale-110 animate-earthy-glow" : ""}
                      ${selectedSpot === spot.id ? "scale-115 animate-earthy-border" : ""}
                      ${isCenter ? "ring-4 ring-white ring-opacity-50" : ""}
                    `}
                    onMouseEnter={() => setHoveredSpot(spot.id)}
                    onMouseLeave={() => setHoveredSpot(null)}
                    onClick={() => setSelectedSpot(selectedSpot === spot.id ? null : spot.id)}
                  >
                    <div className="flex flex-col items-center relative z-10">
                      {spot.icon}
                      <span className={isCenter ? "text-sm mt-1" : "text-xs mt-1"}>{spot.emoji}</span>
                    </div>

                    <div
                      className={`absolute -top-2 -right-2 ${isCenter ? "w-8 h-8" : "w-6 h-6"} ${spot.stickerColor} rounded-full flex items-center justify-center text-white font-black ${isCenter ? "text-sm" : "text-xs"} border-2 border-white shadow-md transform rotate-12`}
                    >
                      {spot.id}
                    </div>
                  </button>

                  <div className="text-center max-w-24">
                    <h3
                      className={`font-black ${isCenter ? "text-sm" : "text-xs"} text-gray-800 text-balance leading-tight mb-1`}
                    >
                      {spot.name}
                    </h3>
                    <p className={`${isCenter ? "text-xs" : "text-[10px]"} text-gray-600 font-medium mb-2`}>
                      {spot.location}
                    </p>
                    <Badge className={`${spot.stickerColor} text-white border-0 font-bold text-[10px] px-2 py-0.5`}>
                      {spot.highlight}
                    </Badge>
                  </div>
                </div>

                {hoveredSpot === spot.id && selectedSpot !== spot.id && (
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 gen-z-card rounded-xl p-4 shadow-xl animate-bounce-in z-[50] w-72 border-2 border-white">
                    <h4 className="font-bold text-gray-800 text-balance mb-1">{spot.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 font-medium">{spot.highlight}</p>
                    <p className="text-sm text-gray-700 font-medium">{spot.description}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedSpot && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[99998]"
              onClick={() => setSelectedSpot(null)}
            />

            {/* Enhanced Card positioned above everything with ultra-high z-index */}
            <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 gen-z-card animate-bounce-in z-[99999] border-4 border-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <CardContent className="p-0">
                {(() => {
                  const spot = roadmapSpots.find((s) => s.id === selectedSpot)
                  if (!spot) return null

                  return (
                    <>
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getLocationImage(spot.name) || "/placeholder.svg"}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=160&width=384&text=${encodeURIComponent(spot.name)}`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSpot(null)
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:scale-105 z-10"
                        >
                          <X className="w-5 h-5 text-gray-800" />
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${spot.gradient} text-white shadow-lg`}>
                            {spot.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black text-xl text-gray-800 mb-2 text-balance">{spot.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                              <MapPin className="w-4 h-4" />
                              {spot.location}
                            </p>
                            <Badge className={`${spot.stickerColor} text-white border-0 font-bold text-xs px-3 py-1`}>
                              {spot.highlight}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-6 font-medium">{spot.description}</p>

                        <div className="flex justify-center">
                          <button
                            className={`bg-gradient-to-r ${spot.gradient} text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg`}
                          >
                            Visit Now! 🚀
                          </button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
    </>
  )
}
