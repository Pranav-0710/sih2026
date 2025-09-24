// src/pages/heritage.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Play, StopCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useWeather } from "@/hooks/useWeather";

const spots = [
  {
    name: "Baidhyanath Temple",
    top: "33.49%",
    left: "69.99%",
    img: "/images/spots/baidyanath.jpg",
    desc: "One of the 12 Jyotirlingas, an important pilgrimage site in Deoghar.",
    wiki: "https://en.wikipedia.org/wiki/Baidyanath_Temple",
    category: "Temple",
    lat: 24.49273,
    lon: 86.69991,
  },
  {
    name: "Netarhat",
    top: "55.93%",
    left: "29.45%",
    img: "/images/spots/netarhat.jpg",
    desc: "Known as the Queen of Chotanagpur, famous for sunrise and sunset views.",
    wiki: "https://en.wikipedia.org/wiki/Netarhat",
    category: "Nature",
    lat: 23.4833,
    lon: 84.2667,
  },
  {
    name: "Parasnath Hills",
    top: "40%",
    left: "55%",
    img: "/images/spots/parasnath.jpg",
    desc: "Highest peak in Jharkhand, a major Jain pilgrimage site.",
    wiki: "https://en.wikipedia.org/wiki/Parasnath",
    category: "Nature",
    lat: 23.9634,
    lon: 86.129,
  },
  {
    name: "Hazaribagh National Park",
    top: "44.08%",
    left: "48.55%",
    img: "/images/spots/hazaribagh.jpg",
    desc: "Wildlife sanctuary known for tigers, leopards, and rich flora.",
    wiki: "https://en.wikipedia.org/wiki/Hazaribagh_National_Park",
    category: "Park",
    lat: 24.016544,
    lon: 85.413133,
  },
  {
    name: "Betla National Park",
    top: "47.33%",
    left: "28.17%",
    img: "/images/spots/betla.jpg",
    desc: "Part of the Palamau Tiger Reserve, rich in wildlife and history.",
    wiki: "https://en.wikipedia.org/wiki/Betla_National_Park",
    category: "Park",
    lat: 23.87,
    lon: 84.19,
  },
  {
    name: "Jagannath Temple, Ranchi",
    top: "58%",
    left: "45%",
    img: "/images/spots/jagannath.jpg",
    desc: "A 17th-century temple resembling Puri's Jagannath Temple.",
    wiki: "https://en.wikipedia.org/wiki/Jagannath_Temple,_Ranchi",
    category: "Temple",
    lat: 23.3169,
    lon: 85.2817,
  },
  {
    name: "Hundru Falls",
    top: "55%",
    left: "54%",
    img: "/images/spots/hundru.jpg",
    desc: "A spectacular 98m waterfall on the Subarnarekha River.",
    wiki: "https://en.wikipedia.org/wiki/Hundru_Falls",
    category: "Waterfall",
    lat: 23.450839,
    lon: 85.666799,
  },
  {
    name: "Dassam Falls",
    top: "65%",
    left: "48%",
    img: "/images/spots/dassam.jpg",
    desc: "A beautiful waterfall near Ranchi, popular picnic spot.",
    wiki: "https://en.wikipedia.org/wiki/Dassam_Falls",
    category: "Waterfall",
    lat: 23.143358,
    lon: 85.466441,
  },
  {
    name: "Jonha Falls",
    top: "61%",
    left: "53%",
    img: "/images/spots/jonha.jpg",
    desc: "Also known as Gautamdhara, falls named after Lord Buddha.",
    wiki: "https://en.wikipedia.org/wiki/Jonha_Falls",
    category: "Waterfall",
    lat: 23.34167,
    lon: 85.60833,
  },
  {
    name: "Shikharji",
    top: "45.31%",
    left: "40%",
    img: "/images/spots/shikharji.jpg",
    desc: "Most important Jain pilgrimage site, located on Parasnath Hill.",
    wiki: "https://en.wikipedia.org/wiki/Shikharji",
    category: "Temple",
    lat: 23.96111,
    lon: 86.137083,
  },
];

const categories = ["All", "Temple", "Nature", "Park", "Waterfall"];

export const Heritage: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTourRunning, setIsTourRunning] = useState(false);
  const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-1, 1], [20, -20]);
  const rotateY = useTransform(x, [-1, 1], [-20, 20]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mapWrapperRef.current) return;

    const rect = mapWrapperRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const startTour = () => {
    setIsTourRunning(true);
    setSelectedSpot(0);
    let currentSpot = 1;
    tourIntervalRef.current = setInterval(() => {
      setSelectedSpot(currentSpot);
      currentSpot = (currentSpot + 1) % spots.length;
    }, 3000);
  };

  const stopTour = () => {
    setIsTourRunning(false);
    if (tourIntervalRef.current) {
      clearInterval(tourIntervalRef.current);
    }
    setSelectedSpot(null);
  };

  useEffect(() => {
    return () => {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
      }
    };
  }, []);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchesCategory =
        activeCategory === "All" || spot.category === activeCategory;
      const matchesSearch = spot.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const { weather, loading, error } = useWeather(
    selectedSpot !== null ? spots[selectedSpot].lat : null,
    selectedSpot !== null ? spots[selectedSpot].lon : null
  );

  return (
    <>
    <Navigation />
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/images/map.png)" }}
    >
      <div className="relative z-10 flex flex-col w-full h-full min-h-screen">
        <div className="w-full mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mt-8 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Explore the Heritage of Jharkhand
            </h1>
            <p className="text-lg text-white mb-8">
                Discover the rich culture and natural beauty of Jharkhand.
            </p>
        </div>

        <div className="w-full mx-auto bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Search for a location..."
                    className="w-full md:w-1/3 bg-white/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isTourRunning}
                />
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`${ activeCategory === category ? "bg-blue-600 text-white" : "bg-white/80 text-black" } hover:bg-blue-500 hover:text-white`}
                            disabled={isTourRunning}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <div className="flex-grow" />
                {!isTourRunning ? (
                    <Button onClick={startTour} className="bg-green-500 hover:bg-green-600 text-white">
                        <Play className="mr-2" size={16}/>
                        Start Guided Tour
                    </Button>
                ) : (
                    <Button onClick={stopTour} className="bg-red-500 hover:bg-red-600 text-white">
                        <StopCircle className="mr-2" size={16}/>
                        Stop Tour
                    </Button>
                )}
            </div>
        </div>

        <motion.div
          ref={mapWrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full bg-cover bg-center rounded-lg shadow-2xl"
          
        >
          <div style={{ aspectRatio: '1088 / 960', transform: "translateZ(0)" }}>
            {/* Markers */}
            {filteredSpots.map((spot, index) => {
              const originalIndex = spots.findIndex(s => s.name === spot.name);
              return (
              <div
                key={originalIndex}
                className="absolute"
                style={{ top: spot.top, left: spot.left, transform: "translateZ(20px)" }}
                onClick={() => setSelectedSpot(originalIndex)}
              >
                <motion.div
                  className="w-5 h-5 bg-pink-500 rounded-full shadow-lg cursor-pointer border-2 border-white animate-pulse"
                  whileHover={{ scale: 1.3 }}
                />
              </div>
            )})}

            {/* Card */}
            {selectedSpot !== null && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-[100] w-72"
                  style={{
                      top: `calc(${spots[selectedSpot].top} - 10rem)`,
                      left: `calc(${spots[selectedSpot].left} + 2rem)`,
                      transform: "translateZ(50px)"
                  }}
              >
                <Card className="shadow-xl border-2 border-blue-500 relative">
                  <Button
                      onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 z-[110]"
                  >
                      <X size={16} />
                  </Button>
                  <CardContent className="p-2">
                    <img
                      src={spots[selectedSpot].img}
                      alt={spots[selectedSpot].name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mt-2">{spots[selectedSpot].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{spots[selectedSpot].desc}</p>

                    {loading && <p className="text-sm text-gray-500">Loading weather...</p>}
                    {error && <p className="text-sm text-red-500">Error: {error}</p>}
                    {weather && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>Temperature: {weather.main.temp}°C</p>
                        <p>Feels like: {weather.main.feels_like}°C</p>
                        <p>Condition: {weather.weather[0].description}</p>
                        <img
                          src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                          alt={weather.weather[0].description}
                          className="inline-block w-8 h-8"
                        />
                        <p className="mt-2 font-semibold">Weather Suggestion:</p>
                        <p>{getWeatherSuggestion(weather.weather[0].main)}</p>
                      </div>
                    )}

                    <Button
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => window.open(spots[selectedSpot].wiki, "_blank")}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

const weatherSuggestions: { [key: string]: string[] } = {
  Rain: [
    "Carry an umbrella or raincoat.",
    "Wear waterproof footwear.",
    "Be cautious of slippery roads.",
  ],
  Clouds: [
    "A good day for outdoor activities, but keep an eye on the sky.",
    "Comfortable weather, ideal for sightseeing.",
  ],
  Clear: [
    "Perfect weather for exploring! Don't forget your sunglasses.",
    "Enjoy the clear skies, ideal for photography.",
    "Stay hydrated and use sunscreen.",
  ],
  Drizzle: [
    "Light rain expected, an umbrella might be useful.",
    "Roads might be slightly wet, drive carefully.",
  ],
  Thunderstorm: [
    "Seek shelter indoors immediately.",
    "Avoid open areas and tall objects.",
    "Stay updated with weather alerts.",
  ],
  Snow: [
    "Dress warmly in layers.",
    "Be careful of icy conditions.",
    "Enjoy the snowy landscapes, but prioritize safety.",
  ],
  Mist: [
    "Visibility might be reduced, drive carefully.",
    "A mystical atmosphere, great for serene walks.",
  ],
  Fog: [
    "Visibility will be low, exercise extreme caution if driving.",
    "Consider delaying travel until fog lifts.",
  ],
  Haze: [
    "Air quality might be affected, consider wearing a mask if sensitive.",
    "Visibility might be slightly reduced.",
  ],
  Smoke: [
    "Air quality is poor, limit outdoor activities.",
    "Wear a mask to protect against smoke inhalation.",
  ],
  Dust: [
    "Expect dusty conditions, protect your eyes and respiratory system.",
    "Visibility might be reduced due to dust.",
  ],
  Sand: [
    "Similar to dust, protect yourself from sand particles.",
    "Strong winds might carry sand, secure loose items.",
  ],
  Ash: [
    "Volcanic ash can be hazardous, stay indoors if possible.",
    "Wear protective gear if you must go outside.",
  ],
  Squall: [
    "Expect sudden, strong winds and heavy precipitation.",
    "Seek immediate shelter.",
  ],
  Tornado: [
    "This is a severe weather event. Seek immediate shelter in a sturdy building or basement.",
    "Stay away from windows.",
  ],
  // Default or less common conditions
  default: [
    "Check local advisories for best experience.",
    "Enjoy your visit!",
  ],
};

const getWeatherSuggestion = (weatherMain: string): string => {
  const suggestions = weatherSuggestions[weatherMain] || weatherSuggestions.default;
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
