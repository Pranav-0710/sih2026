import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, StopCircle, Search, ExternalLink, Compass, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useWeather } from "@/hooks/useWeather";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Marker positions are computed from each monastery's real coordinates against
// the bounds of the Sikkim location map (top 28.14, bottom 27.03, left 87.95,
// right 88.93) — see CREDITS.md. Founding dates, lineage and elevation are the
// same sourced values used in src/data/monasteries.ts; Tashiding has no
// elevation listed there, so it is deliberately left blank rather than guessed.
const spots = [
  {
    name: "Rumtek Monastery",
    top: "76.70%",
    left: "62.39%",
    img: "/vr-assets/rumtek-monastery.jpg",
    desc: "The Dharma Chakra Centre — largest monastery in Sikkim and principal seat of the Karma Kagyu lineage.",
    wiki: "https://en.wikipedia.org/wiki/Rumtek_Monastery",
    category: "Monastery",
    founded: "1734 · rebuilt 1966",
    order: "Karma Kagyu",
    district: "East Sikkim",
    elevation: "1,550 m",
    lat: 27.28861,
    lon: 88.56139,
  },
  {
    name: "Pemayangtse Monastery",
    top: "75.28%",
    left: "30.90%",
    img: "/vr-assets/pemayangtse-monastery.jpg",
    desc: "The 'Perfect Sublime Lotus', founded 1705 — head of Sikkim's Nyingma monasteries, home to the Zangdok Palri.",
    wiki: "https://en.wikipedia.org/wiki/Pemayangtse_Monastery",
    category: "Monastery",
    founded: "1705",
    order: "Nyingma",
    district: "West Sikkim",
    elevation: "2,085 m",
    lat: 27.30444,
    lon: 88.25278,
  },
  {
    name: "Tashiding Monastery",
    top: "74.92%",
    left: "35.52%",
    img: "/vr-assets/tashiding-monastery.jpg",
    desc: "Widely held to be Sikkim's holiest monastery, home to the sin-cleansing Thongwa Rangdrol chorten.",
    wiki: "https://en.wikipedia.org/wiki/Tashiding_Monastery",
    category: "Pilgrimage",
    founded: "1641",
    order: "Nyingma",
    district: "West Sikkim",
    elevation: "",
    lat: 27.30833,
    lon: 88.29806,
  },
  {
    name: "Enchey Monastery",
    top: "72.45%",
    left: "68.28%",
    img: "/vr-assets/enchey-monastery.jpg",
    desc: "'The Solitary Temple' above Gangtok, renowned for its masked Cham and Singhe Chaam dances.",
    wiki: "https://en.wikipedia.org/wiki/Enchey_Monastery",
    category: "Festival",
    founded: "1909",
    order: "Nyingma",
    district: "East Sikkim",
    elevation: "1,800 m",
    lat: 27.33583,
    lon: 88.61917,
  },
];

const categories = ["All", "Monastery", "Pilgrimage", "Festival"];

export const Heritage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSpot, setSelectedSpot] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTourRunning, setIsTourRunning] = useState(false);
  const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-1, 1], [10, -10]);
  const rotateY = useTransform(x, [-1, 1], [-10, 10]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!mapWrapperRef.current) return;

    const rect = mapWrapperRef.current.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;

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
    }, 4000);
  };

  const stopTour = () => {
    setIsTourRunning(false);
    if (tourIntervalRef.current) {
      clearInterval(tourIntervalRef.current);
    }
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

  const selected = selectedSpot !== null ? spots[selectedSpot] : null;

  const { weather, loading, error } = useWeather(
    selected ? selected.lat : null,
    selected ? selected.lon : null
  );

  return (
    <PageLayout noTopPadding noBackground>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Ambient light — keeps the dark canvas from reading as empty space */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute -bottom-32 right-0 h-[28rem] w-[28rem] translate-x-1/4 rounded-full bg-heritage/20 blur-[130px]" />
          <div className="absolute left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-16">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <Compass className="h-3.5 w-3.5" />
              {t("heritage.label")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {t("heritage.title")}{" "}
              <span className="bg-gradient-to-r from-heritage to-accent bg-clip-text text-transparent">
                {t("heritage.titleHighlight")}
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              {t("heritage.subtitle")}
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-12">
            {/* ---------- Left: search, filters, site list ---------- */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card p-4 backdrop-blur-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("heritage.searchPlaceholder", "Search monasteries...")}
                    className="border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-heritage/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isTourRunning}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      disabled={isTourRunning}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-all disabled:opacity-40",
                        activeCategory === category
                          ? "bg-heritage text-black"
                          : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {t(`heritage.category${category}`, category)}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={isTourRunning ? stopTour : startTour}
                  className={cn(
                    "mt-4 w-full font-semibold",
                    isTourRunning
                      ? "bg-destructive text-white hover:bg-destructive/90"
                      : "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                  )}
                >
                  {isTourRunning ? (
                    <>
                      <StopCircle className="mr-2 h-4 w-4" /> {t("heritage.stopTour", "Stop Tour")}
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> {t("heritage.startGuidedTour", "Start Guided Tour")}
                    </>
                  )}
                </Button>
              </div>

              {/* Site list */}
              <div className="space-y-2">
                {filteredSpots.length === 0 && (
                  <p className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                    {t("heritage.noResults", "No monasteries match that search.")}
                  </p>
                )}
                {filteredSpots.map((spot) => {
                  const originalIndex = spots.findIndex(
                    (s) => s.name === spot.name
                  );
                  const isActive = selectedSpot === originalIndex;
                  const spotId = spot.name.split(" ")[0].toLowerCase();
                  return (
                    <button
                      key={spot.name}
                      onClick={() => setSelectedSpot(originalIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all",
                        isActive
                          ? "border-heritage/60 bg-heritage/10 shadow-[0_0_24px_-6px] shadow-heritage/40"
                          : "border-border bg-card hover:border-foreground/30 hover:bg-muted"
                      )}
                    >
                      <img
                        src={spot.img}
                        alt={t("monasteries." + spotId + ".name", spot.name)}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {t("monasteries." + spotId + ".name", spot.name).replace(" Monastery", "").replace(" मठ", "")}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {spot.founded} · {t("monasteries." + spotId + ".sect", spot.order)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------- Centre: the map ---------- */}
            <div className="lg:col-span-5">
              <div className="relative flex justify-center">
                <div
                  aria-hidden
                  className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-heritage/10 blur-[90px]"
                />
                <motion.div
                  ref={mapWrapperRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    aspectRatio: "218.34467 / 268.94427",
                    backgroundImage: "url(/images/sikkim-map.svg)",
                  }}
                  className="relative h-[clamp(340px,52vh,540px)] rounded-2xl bg-contain bg-center bg-no-repeat"
                >
                  {filteredSpots.map((spot) => {
                    const originalIndex = spots.findIndex(
                      (s) => s.name === spot.name
                    );
                    const isActive = selectedSpot === originalIndex;
                    return (
                      <button
                        key={spot.name}
                        onClick={() => setSelectedSpot(originalIndex)}
                        aria-label={spot.name}
                        className="group absolute"
                        style={{
                          top: spot.top,
                          left: spot.left,
                          transform: "translate(-50%, -50%) translateZ(24px)",
                        }}
                      >
                        <span className="relative flex h-4 w-4 items-center justify-center">
                          <span
                            className={cn(
                              "absolute inline-flex h-full w-full rounded-full opacity-75",
                              isActive
                                ? "animate-ping bg-heritage"
                                : "animate-pulse bg-primary"
                            )}
                          />
                          <span
                            className={cn(
                              "relative inline-flex rounded-full border-2 border-white shadow-lg transition-all",
                              isActive
                                ? "h-5 w-5 bg-heritage"
                                : "h-3.5 w-3.5 bg-primary group-hover:h-4 group-hover:w-4"
                            )}
                          />
                        </span>
                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur transition-opacity",
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          {spot.name.replace(" Monastery", "")}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* ---------- Right: detail panel ---------- */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-2xl border border-border bg-card backdrop-blur-xl"
                  >
                    {(() => {
                      const spotId = selected.name.split(" ")[0].toLowerCase();
                      return (
                        <>
                          <div className="relative h-44">
                            <img
                              src={selected.img}
                              alt={t("monasteries." + spotId + ".name", selected.name)}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                              {t("heritage.category" + selected.category, selected.category)}
                            </span>
                          </div>

                          <div className="p-5">
                            <h2 className="font-display text-2xl font-semibold text-foreground">
                              {t("monasteries." + spotId + ".name", selected.name)}
                            </h2>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {[
                                { label: t("heritage.founded", "Founded"), value: selected.founded },
                                { label: t("heritage.order", "Order"), value: t("monasteries." + spotId + ".sect", selected.order) },
                                { label: t("heritage.district", "District"), value: selected.district },
                                { label: t("heritage.elevation", "Elevation"), value: selected.elevation },
                              ]
                                .filter((f) => f.value)
                                .map((f) => (
                                  <div
                                    key={f.label}
                                    className="rounded-lg border border-border bg-card px-3 py-2"
                                  >
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                      {f.label}
                                    </p>
                                    <p className="text-xs font-medium text-foreground/90">
                                      {f.value}
                                    </p>
                                  </div>
                                ))}
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                              {t("monasteries." + spotId + ".history", selected.desc)}
                            </p>

                            {/* Live weather */}
                            <div className="mt-4 rounded-xl border border-border bg-card p-3">
                              <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                                {t("heritage.conditionsNow", "Conditions right now")}
                              </p>
                              {loading && (
                                <p className="text-sm text-muted-foreground">
                                  {t("heritage.loadingWeather", "Loading weather...")}
                                </p>
                              )}
                              {error && (
                                <p className="text-sm text-muted-foreground">
                                  {t("heritage.weatherUnavailable", "Weather unavailable right now.")}
                                </p>
                              )}
                              {weather && (
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                                    alt={weather.weather[0].description}
                                    className="h-10 w-10"
                                  />
                                  <div>
                                    <p className="text-lg font-semibold text-foreground">
                                      {Math.round(weather.main.temp)}°C
                                    </p>
                                    <p className="text-xs capitalize text-muted-foreground">
                                      {weather.weather[0].description} · {t("heritage.feelsLike", "feels like")}{" "}
                                      {Math.round(weather.main.feels_like)}°C
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button
                              className="mt-4 w-full bg-muted font-semibold text-foreground hover:bg-muted"
                              onClick={() => window.open(selected.wiki, "_blank")}
                            >
                              {t("common.learnMore", "Learn more")}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
                    <MapPin className="mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("heritage.selectMarker", "Select a marker on the map to see its story.")}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
