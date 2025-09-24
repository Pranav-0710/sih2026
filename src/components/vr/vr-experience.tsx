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
import Navigation from "../Navigation"

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
    <Navigation />
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
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-500 bg-clip-text text-transparent leading-tight">
              Explore Iconic Destinations
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Immerse yourself in 360-degree views of Jharkhand's most breathtaking locations, from bustling cities to serene natural wonders.
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

const locations = [
  {
    id: "ranchi",
    name: "Ranchi",
    type: "Capital City",
    description:
      "Explore the vibrant capital with its Rock Garden, serene lakes, and the magnificent Jagannath Temple.",
    image: "/vr-assets/public/ranchi-city-skyline-with-rock-garden-and-jagannath.png",
    panoramaImage: "https://skybox.blockadelabs.com/e/81d9645406fd4473fdfe69d9c41dbb33",
    audioTracks: [
      {
        id: "ranchi-intro",
        title: "Welcome to Ranchi",
        description: "Introduction to the capital city of Jharkhand",
        duration: "1:30",
        type: "introduction",
      },
      {
        id: "ranchi-history",
        title: "Historical Overview",
        description: "Learn about Ranchi's rich history and development",
        duration: "2:15",
        type: "location",
      },
      {
        id: "ranchi-culture",
        title: "Cultural Heritage",
        description: "Discover the cultural significance of Ranchi",
        duration: "1:45",
        type: "cultural",
      },
    ],
    educationalContent: {
      history:
        "Ranchi, the capital of Jharkhand, was established as a hill station by the British in 1899. The city derives its name from 'Archi', meaning bamboo sticks in the local language. It served as the summer capital of Bihar before Jharkhand's formation in 2000. The city has been a center of tribal movements and played a crucial role in India's independence struggle.",
      culture:
        "Ranchi is a melting pot of tribal and modern cultures. The city celebrates various tribal festivals like Sarhul, Karma, and Sohrai with great enthusiasm. The Jagannath Temple, built in the traditional Kalinga style, is a major pilgrimage site. The city is also known for its contribution to sports, particularly cricket and hockey.",
      geography:
        "Located on the Chota Nagpur Plateau at an elevation of 651 meters, Ranchi enjoys a pleasant climate throughout the year. The city is surrounded by hills and forests, with several lakes and waterfalls in the vicinity. The Subarnarekha River flows through the region, providing water resources for the city.",
      quiz: [
        {
          id: "q1",
          question: "What does the name 'Ranchi' originally mean?",
          options: ["Golden city", "Bamboo sticks", "Hill station", "Capital city"],
          correctAnswer: 1,
          explanation: "Ranchi derives its name from 'Archi', which means bamboo sticks in the local tribal language.",
        },
        {
          id: "q2",
          question: "In which year was Jharkhand formed as a separate state?",
          options: ["1999", "2000", "2001", "2002"],
          correctAnswer: 1,
          explanation: "Jharkhand was carved out of Bihar and formed as the 28th state of India on November 15, 2000.",
        },
      ],
    },
    hotspots: [
      {
        id: "rock-garden",
        title: "Rock Garden",
        description:
          "A beautiful garden featuring natural rock formations and landscaped areas perfect for relaxation.",
        type: "landmark" as const,
        facts: [
          "Created using natural rock formations",
          "Popular picnic spot for families",
          "Features walking trails and seating areas",
        ],
        bestTime: "Early morning or evening",
        position: { x: 25, y: 40 },
      },
      {
        id: "jagannath-temple",
        title: "Jagannath Temple",
        description: "A magnificent temple dedicated to Lord Jagannath, showcasing traditional architecture.",
        type: "culture" as const,
        historicalInfo:
          "Built in the traditional Kalinga style, this temple is a replica of the famous Puri Jagannath Temple.",
        facts: ["Annual Rath Yatra celebration", "Traditional Kalinga architecture", "Important pilgrimage site"],
        position: { x: 70, y: 30 },
      },
      {
        id: "ranchi-lake",
        title: "Ranchi Lake",
        description: "A serene artificial lake offering boating and peaceful surroundings in the heart of the city.",
        type: "nature" as const,
        facts: ["Artificial lake created for water supply", "Boating facilities available", "Surrounded by hills"],
        bestTime: "Sunset hours",
        position: { x: 50, y: 60 },
      },
    ],
  },
  {
    id: "netarhat",
    name: "Netarhat",
    type: "Hill Station",
    description:
      "Witness breathtaking sunrise views from the Queen of Chotanagpur, surrounded by rolling hills and valleys.",
    image: "/vr-assets/public/netarhat-sunrise-point-with-hills-and-valleys-gold.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/63ea828f078df2aaf7f997646152a55e",
    audioTracks: [
      {
        id: "netarhat-intro",
        title: "Queen of Chotanagpur",
        description: "Introduction to Netarhat hill station",
        duration: "1:20",
        type: "introduction",
      },
    ],
    educationalContent: {
      history:
        "Netarhat, known as the 'Queen of Chotanagpur', was discovered by the British as a hill station in the late 19th century. The area was developed as a summer retreat due to its pleasant climate and scenic beauty. It became famous for the Netarhat Residential School, established in 1954, which has produced many notable personalities.",
      culture:
        "The region is inhabited by various tribal communities including Oraon, Munda, and Ho tribes. These communities have preserved their traditional lifestyle, festivals, and customs. The area is known for its folk music, dance forms, and traditional handicrafts.",
      geography:
        "Situated at an elevation of 1,128 meters above sea level, Netarhat offers panoramic views of the surrounding valleys and hills. The region experiences a subtropical highland climate with cool summers and mild winters. The area is rich in flora and fauna, with dense forests covering the hills.",
      quiz: [
        {
          id: "q1",
          question: "What is Netarhat commonly known as?",
          options: ["King of Hills", "Queen of Chotanagpur", "Pearl of Jharkhand", "Crown of India"],
          correctAnswer: 1,
          explanation:
            "Netarhat is famously known as the 'Queen of Chotanagpur' due to its scenic beauty and pleasant climate.",
        },
      ],
    },
    hotspots: [
      {
        id: "sunrise-point",
        title: "Sunrise Point",
        description: "The most famous viewpoint offering spectacular sunrise views over the hills and valleys.",
        type: "nature" as const,
        facts: ["Best sunrise views in Jharkhand", "1,128 meters above sea level", "Popular trekking destination"],
        bestTime: "5:30 AM - 6:30 AM",
        position: { x: 60, y: 25 },
      },
      {
        id: "lodh-falls-viewpoint",
        title: "Lodh Falls Viewpoint",
        description: "Distant view of the magnificent Lodh Falls, Jharkhand's highest waterfall.",
        type: "nature" as const,
        facts: ["View of 143-meter high waterfall", "Best during monsoon season", "Trekking trail available"],
        bestTime: "July to October",
        position: { x: 30, y: 70 },
      },
    ],
  },
  {
    id: "betla",
    name: "Betla National Park",
    type: "Wildlife Sanctuary",
    description: "Embark on a virtual safari through dense forests home to tigers, elephants, and diverse wildlife.",
    image: "/vr-assets/public/betla-national-park-forest-with-tigers-and-elephan.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/7844f8170cf5ee2ff867e0974acd2c05",
    audioTracks: [
      {
        id: "betla-intro",
        title: "Welcome to Betla",
        description: "Introduction to Betla National Park",
        duration: "1:45",
        type: "introduction",
      },
    ],
    educationalContent: {
      history:
        "Betla National Park was established in 1986 as part of the Palamau Tiger Reserve. The area has a rich history dating back to the Paleolithic age, with several archaeological sites found within the park. The region was once ruled by the Chero dynasty and later came under British control.",
      culture:
        "The park is surrounded by tribal villages where communities like Oraon, Munda, and Kharia reside. These tribes have coexisted with wildlife for centuries and have traditional knowledge about forest conservation. Their festivals and rituals often revolve around nature worship.",
      geography:
        "Covering an area of 979 square kilometers, Betla National Park is part of the larger Palamau Tiger Reserve. The park features diverse landscapes including grasslands, forests, and hills. The Koel River flows through the park, providing water sources for wildlife.",
      wildlife:
        "The park is home to tigers, elephants, leopards, sloth bears, and over 174 bird species. It's part of Project Tiger and plays a crucial role in tiger conservation. The park also houses several endangered species and serves as an important corridor for wildlife movement.",
      quiz: [
        {
          id: "q1",
          question: "In which year was Betla National Park established?",
          options: ["1984", "1985", "1986", "1987"],
          correctAnswer: 2,
          explanation: "Betla National Park was established in 1986 as part of the Palamau Tiger Reserve.",
        },
      ],
    },
    hotspots: [
      {
        id: "tiger-territory",
        title: "Tiger Territory",
        description: "Dense forest area where Bengal tigers roam freely in their natural habitat.",
        type: "wildlife" as const,
        facts: ["Home to Bengal tigers", "Part of Project Tiger initiative", "Best tiger sighting chances"],
        bestTime: "Early morning safari",
        position: { x: 40, y: 35 },
      },
      {
        id: "elephant-corridor",
        title: "Elephant Corridor",
        description: "Migration path used by wild elephants moving through the forest.",
        type: "wildlife" as const,
        facts: ["Wild elephant herds frequent this area", "Important migration corridor", "Observe from safe distance"],
        bestTime: "Evening hours",
        position: { x: 65, y: 55 },
      },
      {
        id: "watchtower",
        title: "Forest Watchtower",
        description: "Elevated viewing platform for wildlife observation and forest monitoring.",
        type: "landmark" as const,
        facts: ["360-degree forest views", "Wildlife monitoring station", "Bird watching spot"],
        position: { x: 75, y: 20 },
      },
    ],
  },
  {
    id: "hazaribagh",
    name: "Hazaribagh",
    type: "Lake District",
    description: "Discover the tranquil beauty of Hazaribagh Lake surrounded by scenic hills and wildlife sanctuary.",
    image: "/vr-assets/public/hazaribagh-lake-with-surrounding-hills-and-peacefu.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/c0440d5e3eb80297993af103a3a20740",
    hotspots: [
      {
        id: "hazaribagh-lake",
        title: "Hazaribagh Lake",
        description: "A pristine lake surrounded by hills, perfect for boating and peaceful contemplation.",
        type: "nature" as const,
        facts: ["Artificial reservoir", "Boating and fishing available", "Migratory bird habitat"],
        bestTime: "Winter months",
        position: { x: 50, y: 50 },
      },
      {
        id: "canary-hill",
        title: "Canary Hill",
        description: "Scenic hilltop offering panoramic views of the lake and surrounding landscape.",
        type: "landmark" as const,
        facts: ["Popular sunset viewpoint", "Trekking trail to summit", "Photography hotspot"],
        bestTime: "Sunset hours",
        position: { x: 25, y: 30 },
      },
    ],
  },
  {
    id: "tribal-villages",
    name: "Tribal Villages",
    type: "Cultural Heritage",
    description: "Immerse yourself in authentic tribal life, traditional crafts, and age-old customs.",
    image: "/vr-assets/public/jharkhand-tribal-village-with-traditional-huts-and.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/5659f214dc39b2452317dc1d14810297",
    hotspots: [
      {
        id: "traditional-huts",
        title: "Traditional Huts",
        description: "Authentic tribal dwellings built using traditional materials and techniques.",
        type: "culture" as const,
        historicalInfo:
          "These huts represent centuries-old architectural traditions of Jharkhand's tribal communities.",
        facts: ["Built with mud, bamboo, and thatch", "Eco-friendly construction", "Adapted to local climate"],
        position: { x: 35, y: 45 },
      },
      {
        id: "craft-center",
        title: "Handicraft Center",
        description: "Workshop where tribal artisans create traditional crafts, textiles, and artwork.",
        type: "culture" as const,
        facts: ["Traditional weaving techniques", "Natural dyes and materials", "Passed down through generations"],
        position: { x: 65, y: 35 },
      },
      {
        id: "dance-ground",
        title: "Community Dance Ground",
        description: "Sacred space where tribal festivals and traditional dances are performed.",
        type: "culture" as const,
        historicalInfo: "This ground has witnessed countless celebrations and rituals that preserve tribal heritage.",
        facts: ["Traditional dance performances", "Festival celebrations", "Community gatherings"],
        bestTime: "During festivals",
        position: { x: 50, y: 70 },
      },
    ],
  },
  {
    id: "waterfalls",
    name: "Lodh Falls",
    type: "Natural Wonder",
    description: "Experience the thundering beauty of Jharkhand's highest waterfall cascading through lush forests.",
    image: "/vr-assets/public/lodh-falls-waterfall-cascading-through-green-fores.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/7cc0b02cfcdeeab983e00eedf2ed47b9",
    hotspots: [
      {
        id: "main-falls",
        title: "Main Waterfall",
        description: "The spectacular 143-meter high waterfall cascading down the rocky cliff.",
        type: "nature" as const,
        facts: ["Highest waterfall in Jharkhand", "143 meters tall", "Best flow during monsoon"],
        bestTime: "July to October",
        position: { x: 50, y: 40 },
      },
      {
        id: "rainbow-point",
        title: "Rainbow Viewpoint",
        description: "Perfect spot to witness rainbows formed by the waterfall's mist on sunny days.",
        type: "nature" as const,
        facts: ["Natural rainbow formation", "Best on sunny mornings", "Photography paradise"],
        bestTime: "Morning hours after rain",
        position: { x: 70, y: 60 },
      },
      {
        id: "base-pool",
        title: "Natural Pool",
        description: "Crystal clear pool formed at the base of the waterfall, perfect for a refreshing dip.",
        type: "nature" as const,
        facts: ["Natural swimming pool", "Crystal clear water", "Safe for swimming"],
        bestTime: "Post-monsoon season",
        position: { x: 45, y: 75 },
      },
    ],
  },
]
