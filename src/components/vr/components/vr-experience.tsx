"use client"

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
import { WildlifeSpottingGame } from "./wildlife-spotting-game"
import { TriviaQuiz } from "./trivia-quiz"

export function VRExperience() {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [showHotspots, setShowHotspots] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showWildlifeGame, setShowWildlifeGame] = useState(false)
  const [showTriviaQuiz, setShowTriviaQuiz] = useState(false)
  const [gameScores, setGameScores] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)

  const selectedLocation = currentLocation ? locations.find((loc) => loc.id === currentLocation) : null

  const handleCloseViewer = () => {
    setCurrentLocation(null)
    setShowHotspots(false)
  }

  const handleShowHotspots = () => {
    setShowHotspots(!showHotspots)
  }

  const handleLocationChange = (locationId: string) => {
    setCurrentLocation(locationId)
  }

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const handleStartWildlifeGame = (locationId: string) => {
    setCurrentLocation(locationId)
    setShowWildlifeGame(true)
  }

  const handleStartTriviaQuiz = (locationId: string) => {
    setCurrentLocation(locationId)
    setShowTriviaQuiz(true)
  }

  const handleGameComplete = (gameType: string, locationId: string, score: number) => {
    const gameKey = `${gameType}-${locationId}`
    setGameScores((prev) => ({ ...prev, [gameKey]: score }))
    setTotalScore((prev) => prev + score)
    setShowWildlifeGame(false)
    setShowTriviaQuiz(false)
  }

  const getTotalLocationScore = (locationId: string) => {
    const wildlifeScore = gameScores[`wildlife-${locationId}`] || 0
    const triviaScore = gameScores[`trivia-${locationId}`] || 0
    return wildlifeScore + triviaScore
  }

  if (showWildlifeGame && selectedLocation) {
    return (
      <WildlifeSpottingGame
        isVisible={showWildlifeGame}
        onClose={() => setShowWildlifeGame(false)}
        locationId={selectedLocation.id}
        onComplete={(score) => handleGameComplete("wildlife", selectedLocation.id, score)}
      />
    )
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section with Introduction */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <img
          src="/vr-assets/public/jharkhand-landscape-with-lush-green-forests-waterf.png"
          alt="Jharkhand Landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">Discover Jharkhand</h1>
          <p className="text-xl md:text-2xl mb-4 text-balance opacity-90">A Virtual Journey</p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Welcome to Jharkhand! Step into the heart of India's tribal land, a place where nature's beauty meets rich
            cultural heritage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
              onClick={() => setCurrentLocation("ranchi")}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Virtual Tour
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`border-white text-white hover:bg-white hover:text-foreground px-8 py-4 text-lg bg-transparent ${audioEnabled ? "bg-primary/20 border-primary" : ""}`}
              onClick={handleToggleAudio}
            >
              <Volume2 className="mr-2 h-5 w-5" />
              {audioEnabled ? "Audio Guide Enabled" : "Enable Audio Guide"}
            </Button>
          </div>

          {totalScore > 0 && (
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 mb-4 inline-block">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-semibold">Total Score: {totalScore} points</span>
              </div>
              <p className="text-sm text-gray-300">Keep exploring to earn more points!</p>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Location Preview Cards */}
      <section className="py-20 px-4 bg-white/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">Explore Iconic Destinations</h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto text-pretty">
            Immerse yourself in 360-degree views of Jharkhand's most breathtaking locations, from bustling cities to
            serene natural wonders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => {
              const locationScore = getTotalLocationScore(location.id)
              return (
                <Card
                  key={location.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={location.src || "/vr-assets/public/"}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{location.name}</h3>
                      <p className="text-sm opacity-90 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location.type}
                      </p>
                      {locationScore > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-500 font-medium">{locationScore} points</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="opacity-90"
                        onClick={() => setCurrentLocation(location.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-pretty leading-relaxed mb-4">{location.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-primary font-medium">
                        360° Experience • {location.hotspots?.length || 0} Hotspots
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentLocation(location.id)}>
                        <Info className="h-4 w-4 mr-1" />
                        Explore
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {location.id === "betla" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleStartWildlifeGame(location.id)}
                        >
                          <Gamepad2 className="h-3 w-3 mr-1" />
                          Wildlife Game
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleStartTriviaQuiz(location.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Games Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Interactive Experiences</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty">
            Test your knowledge and observation skills with our engaging mini-games while exploring Jharkhand's natural
            wonders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Wildlife Spotting Challenge</h3>
                <p className="text-muted-foreground mb-6">
                  Test your observation skills by finding hidden animals in Betla National Park. Click on tigers,
                  elephants, and other wildlife to earn points!
                </p>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleStartWildlifeGame("betla")}
                >
                  Start Wildlife Game
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Location Trivia Quiz</h3>
                <p className="text-muted-foreground mb-6">
                  Challenge your knowledge about Jharkhand's history, culture, and geography with location-specific
                  trivia questions.
                </p>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleStartTriviaQuiz("ranchi")}
                >
                  Start Quiz Challenge
                </Button>
              </CardContent>
            </Card>
          </div>

          {Object.keys(gameScores).length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(gameScores).map(([gameKey, score]) => {
                    const [gameType, locationId] = gameKey.split("-")
                    const location = locations.find((loc) => loc.id === locationId)
                    return (
                      <div key={gameKey} className="text-center">
                        <div className="text-2xl font-bold text-primary">{score}</div>
                        <div className="text-sm text-muted-foreground">
                          {gameType === "wildlife" ? "Wildlife" : "Trivia"} - {location?.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-yellow-500/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{totalScore}</div>
                    <div className="text-sm text-muted-foreground">Total Points Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Rich Tribal Heritage</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty">
            Experience the vibrant traditions, music, and dance of Jharkhand's indigenous communities through immersive
            cultural showcases.
          </p>

          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img
              src="/vr-assets/public/jharkhand-tribal-dance-festival-with-traditional-c.png"
              alt="Tribal Culture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                onClick={() => setCurrentLocation("tribal-villages")}
              >
                <Play className="mr-2 h-6 w-6" />
                Experience Tribal Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Ready to Experience Jharkhand in Reality?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto text-pretty">
              Transform your virtual journey into an unforgettable real adventure. Discover the authentic beauty,
              culture, and hospitality of Jharkhand with our expert-guided tours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Plan Your Visit
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                <Phone className="mr-2 h-5 w-5" />
                Contact Travel Expert
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
                <p className="text-muted-foreground text-sm">
                  Local tribal guides with deep knowledge of culture and traditions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Experience</h3>
                <p className="text-muted-foreground text-sm">
                  Carefully curated itineraries for authentic cultural immersion
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Tours</h3>
                <p className="text-muted-foreground text-sm">
                  2-day weekend trips to 10-day comprehensive explorations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
                <p className="text-muted-foreground text-sm">
                  Recognized for sustainable and responsible tourism practices
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Popular Tour Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/vr-assets/public/ranchi-city-skyline-with-rock-garden-and-jagannath.png"
                    alt="Cultural Heritage Tour"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      3 Days
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">Cultural Heritage Tour</h4>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Explore Ranchi's temples, tribal villages, and traditional craft centers with cultural performances.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹12,999</span>
                    <Button size="sm">
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/vr-assets/public/betla-national-park-forest-with-tigers-and-elephan.png"
                    alt="Wildlife Safari Adventure"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      5 Days
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">Wildlife Safari Adventure</h4>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Tiger safaris at Betla National Park with nature walks and bird watching experiences.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹24,999</span>
                    <Button size="sm">
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src="/vr-assets/public/lodh-falls-waterfall-cascading-through-green-fores.png"
                    alt="Complete Jharkhand Experience"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      7 Days
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">Complete Jharkhand Experience</h4>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Comprehensive tour covering all major destinations, waterfalls, and cultural sites.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹39,999</span>
                    <Button size="sm">
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Start Planning Your Journey</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our travel experts are ready to help you create the perfect Jharkhand experience. From customized
                  itineraries to group bookings, we handle every detail.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <p className="text-muted-foreground">tours@discoverjharkhand.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Available</p>
                      <p className="text-muted-foreground">Mon-Sat, 9 AM - 7 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-6">Quick Inquiry</h4>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Select Tour Package</option>
                      <option>Cultural Heritage Tour (3 Days)</option>
                      <option>Wildlife Safari Adventure (5 Days)</option>
                      <option>Complete Jharkhand Experience (7 Days)</option>
                      <option>Custom Package</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Special Requirements or Questions"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                    Send Inquiry
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of travelers who have discovered the magic of Jharkhand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Adventure Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                Download Travel Guide
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
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
        type: "landmark",
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
        type: "culture",
        historicalInfo:
          "Built in the traditional Kalinga style, this temple is a replica of the famous Puri Jagannath Temple.",
        facts: ["Annual Rath Yatra celebration", "Traditional Kalinga architecture", "Important pilgrimage site"],
        position: { x: 70, y: 30 },
      },
      {
        id: "ranchi-lake",
        title: "Ranchi Lake",
        description: "A serene artificial lake offering boating and peaceful surroundings in the heart of the city.",
        type: "nature",
        facts: ["Artificial lake created for water supply", "Boating facilities available", "Surrounded by hills"],
        bestTime: "Sunset hours",
        position: { x: 50, y: 60 },
      },
    ],
  },
  {
    id: " hat",
    name: "Netarhat",
    type: "Hill Station",
    description:
      "Witness breathtaking sunrise views from the Queen of Chotanagpur, surrounded by rolling hills and valleys.",
    image: "/vr-assets/public/netarhat-sunrise-point-with-hills-and-valleys-gold.png",
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
        type: "nature",
        facts: ["Best sunrise views in Jharkhand", "1,128 meters above sea level", "Popular trekking destination"],
        bestTime: "5:30 AM - 6:30 AM",
        position: { x: 60, y: 25 },
      },
      {
        id: "lodh-falls-viewpoint",
        title: "Lodh Falls Viewpoint",
        description: "Distant view of the magnificent Lodh Falls, Jharkhand's highest waterfall.",
        type: "nature",
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
    src: "/vr-assets/public/betla-national-park-forest-with-tigers-and-elephan.png",
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
        type: "wildlife",
        facts: ["Home to Bengal tigers", "Part of Project Tiger initiative", "Best tiger sighting chances"],
        bestTime: "Early morning safari",
        position: { x: 40, y: 35 },
      },
      {
        id: "elephant-corridor",
        title: "Elephant Corridor",
        description: "Migration path used by wild elephants moving through the forest.",
        type: "wildlife",
        facts: ["Wild elephant herds frequent this area", "Important migration corridor", "Observe from safe distance"],
        bestTime: "Evening hours",
        position: { x: 65, y: 55 },
      },
      {
        id: "watchtower",
        title: "Forest Watchtower",
        description: "Elevated viewing platform for wildlife observation and forest monitoring.",
        type: "landmark",
        facts: ["360-degree forest views", "Wildlife monitoring station", "Bird watching spot"],
        position: { x: 75, y: 20 },
      },
    ],
  },
  {
    id: "hazaribagh",
    name: "Hazaribagh",
  type: "nature",
    description: "Discover the tranquil beauty of Hazaribagh Lake surrounded by scenic hills and wildlife sanctuary.",
    image: "/vr-assets/public/hazaribagh-lake-with-surrounding-hills-and-peacefu.png",
    hotspots: [
      {
        id: "hazaribagh-lake",
        title: "Hazaribagh Lake",
        description: "A pristine lake surrounded by hills, perfect for boating and peaceful contemplation.",
        type: "nature",
        facts: ["Artificial reservoir", "Boating and fishing available", "Migratory bird habitat"],
        bestTime: "Winter months",
        position: { x: 50, y: 50 },
      },
      {
        id: "canary-hill",
        title: "Canary Hill",
        description: "Scenic hilltop offering panoramic views of the lake and surrounding landscape.",
        type: "landmark",
        facts: ["Popular sunset viewpoint", "Trekking trail to summit", "Photography hotspot"],
        bestTime: "Sunset hours",
        position: { x: 25, y: 30 },
      },
    ],
  },
  {
    id: "tribal-villages",
    name: "Tribal Villages",
  type: "culture",
    description: "Immerse yourself in authentic tribal life, traditional crafts, and age-old customs.",
    src: "/vr-assets/public/jharkhand-tribal-village-with-traditional-huts-and.png",
    hotspots: [
      {
        id: "traditional-huts",
        title: "Traditional Huts",
        description: "Authentic tribal dwellings built using traditional materials and techniques.",
        type: "culture",
        historicalInfo:
          "These huts represent centuries-old architectural traditions of Jharkhand's tribal communities.",
        facts: ["Built with mud, bamboo, and thatch", "Eco-friendly construction", "Adapted to local climate"],
        position: { x: 35, y: 45 },
      },
      {
        id: "craft-center",
        title: "Handicraft Center",
        description: "Workshop where tribal artisans create traditional crafts, textiles, and artwork.",
        type: "culture",
        facts: ["Traditional weaving techniques", "Natural dyes and materials", "Passed down through generations"],
        position: { x: 65, y: 35 },
      },
      {
        id: "dance-ground",
        title: "Community Dance Ground",
        description: "Sacred space where tribal festivals and traditional dances are performed.",
        type: "culture",
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
  type: "nature",
    description: "Experience the thundering beauty of Jharkhand's highest waterfall cascading through lush forests.",
    src: "/vr-assets/public/lodh-falls-waterfall-cascading-through-green-fores.png",
    hotspots: [
      {
        id: "main-falls",
        title: "Main Waterfall",
        description: "The spectacular 143-meter high waterfall cascading down the rocky cliff.",
        type: "nature",
        facts: ["Highest waterfall in Jharkhand", "143 meters tall", "Best flow during monsoon"],
        bestTime: "July to October",
        position: { x: 50, y: 40 },
      },
      {
        id: "rainbow-point",
        title: "Rainbow Viewpoint",
        description: "Perfect spot to witness rainbows formed by the waterfall's mist on sunny days.",
        type: "nature",
        facts: ["Natural rainbow formation", "Best on sunny mornings", "Photography paradise"],
        bestTime: "Morning hours after rain",
        position: { x: 70, y: 60 },
      },
      {
        id: "base-pool",
        title: "Natural Pool",
        description: "Crystal clear pool formed at the base of the waterfall, perfect for a refreshing dip.",
        type: "nature",
        facts: ["Natural swimming pool", "Crystal clear water", "Safe for swimming"],
        bestTime: "Post-monsoon season",
        position: { x: 45, y: 75 },
      },
    ],
  },
]
