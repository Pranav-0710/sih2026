import { useState } from "react"
import { ArrowUpRight, BookOpen, Compass, HelpCircle } from "lucide-react"
import { PanoramaViewer } from "./panorama-viewer"
import { TriviaQuiz } from "./trivia-quiz"
import { StoryMode } from "./story-mode"
import { locations } from "@/data/monasteries"
import { getStory } from "@/data/stories"
import { StackedCards, StackCard } from "@/components/StackedCards"

/**
 * Virtual experience index.
 *
 * Rebuilt away from the previous gradient-text / glassmorphism / lift-and-
 * scale card treatment, which was the most template-looking screen left in
 * the app. Structure now comes from numerals, hairline rules and a plain
 * image grid, matching the editorial system used on the home page.
 *
 * Each monastery offers three ways in, listed explicitly rather than hidden
 * behind one ambiguous "Explore" button: the story tour, the panorama
 * viewer, and the quiz.
 */
export function VRExperience() {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showTriviaQuiz, setShowTriviaQuiz] = useState(false)
  const [storyLocationId, setStoryLocationId] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})

  const selectedLocation = currentLocation ? locations.find((l) => l.id === currentLocation) : null
  const storyLocation = storyLocationId ? locations.find((l) => l.id === storyLocationId) : null
  const activeStory = storyLocationId ? getStory(storyLocationId) : undefined

  if (storyLocation && activeStory) {
    return (
      <StoryMode
        story={activeStory}
        image={storyLocation.image}
        monasteryName={storyLocation.name}
        onClose={() => setStoryLocationId(null)}
      />
    )
  }

  if (showTriviaQuiz && selectedLocation) {
    return (
      <TriviaQuiz
        isVisible={showTriviaQuiz}
        onClose={() => {
          setShowTriviaQuiz(false)
          setCurrentLocation(null)
        }}
        locationId={selectedLocation.id}
        locationName={selectedLocation.name}
        onComplete={(score) => {
          setScores((prev) => ({ ...prev, [selectedLocation.id]: score }))
          setShowTriviaQuiz(false)
          setCurrentLocation(null)
        }}
      />
    )
  }

  if (selectedLocation) {
    return (
      <PanoramaViewer
        location={selectedLocation}
        allLocations={locations}
        onLocationChange={(id) => setCurrentLocation(id)}
        onClose={() => {
          setCurrentLocation(null)
          setAudioEnabled(false)
        }}
        onShowHotspots={() => undefined}
        audioEnabled={audioEnabled}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10 pt-24 md:pt-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="prayer-flags prayer-flags-lg" aria-hidden><span /><span /><span /><span /><span /></span>
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-heritage">
            Virtual Experience
          </span>
        </div>

        <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground md:col-span-7 md:text-7xl">
            Step inside
            <span className="block text-muted-foreground">four monasteries</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-3">
            Take a narrated story tour through each monastery's history, look
            around in 360°, or test what you remember afterwards.
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-16 px-6 lg:px-8">
        <StackedCards>
          {locations.map((location, i) => {
            const story = getStory(location.id)
            const score = scores[location.id]

            return (
              <StackCard key={location.id} index={i}>
                <article className="lamp-edge relative h-[74vh] min-h-[30rem] overflow-hidden rounded-sm border border-foreground/10 bg-card">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Same explicit-stop scrim as /explore — see the note
                      there on why Tailwind's three-stop gradient wasn't
                      enough over the brighter photographs. */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(8,6,5,0.97) 0%, rgba(8,6,5,0.90) 30%, rgba(8,6,5,0.62) 55%, rgba(8,6,5,0.20) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(8,6,5,0.85) 0%, rgba(8,6,5,0.15) 45%, rgba(8,6,5,0.55) 100%)",
                    }}
                  />

                  <div className="relative flex h-full flex-col justify-between p-7 md:p-12">
                    <div className="flex items-start justify-between">
                      <span className="prayer-flags prayer-flags-lg" aria-hidden>
                        <span /><span /><span /><span /><span />
                      </span>
                      <div className="flex items-center gap-3">
                        {score !== undefined && (
                          <span className="border border-heritage/50 px-2.5 py-1 font-mono text-[10px] tabular-nums tracking-widest text-heritage">
                            {score} PTS
                          </span>
                        )}
                        <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/55">
                          {String(i + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="max-w-2xl">
                      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-heritage">
                        {location.type}
                      </p>
                      <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-6xl">
                        {location.name.replace(" Monastery", "")}
                      </h2>
                      <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                        {location.description}
                      </p>

                      {/* Three explicit ways in, rather than one ambiguous CTA. */}
                      <div className="mt-8 grid max-w-xl grid-cols-3 border-t border-white/15">
                        <EntryAction
                          icon={BookOpen}
                          label="Story"
                          detail={story ? `${story.chapters.length} chapters` : "Coming soon"}
                          disabled={!story}
                          onClick={() => story && setStoryLocationId(location.id)}
                        />
                        <EntryAction
                          icon={Compass}
                          label="360° view"
                          detail={`${location.hotspots?.length ?? 0} hotspots`}
                          onClick={() => {
                            setCurrentLocation(location.id)
                            setAudioEnabled(true)
                          }}
                        />
                        <EntryAction
                          icon={HelpCircle}
                          label="Quiz"
                          detail={`${location.educationalContent?.quiz.length ?? 0} questions`}
                          onClick={() => {
                            setCurrentLocation(location.id)
                            setShowTriviaQuiz(true)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </StackCard>
            )
          })}
        </StackedCards>
      </div>
    </div>
  )
}

const EntryAction = ({
  icon: Icon,
  label,
  detail,
  onClick,
  disabled,
}: {
  icon: typeof BookOpen
  label: string
  detail: string
  onClick: () => void
  disabled?: boolean
}) => (
  // These now sit on dark photography rather than the page background, so
  // they use fixed white-alpha tones instead of foreground/muted tokens —
  // the tokens flip with the theme and would go dark-on-dark in light mode.
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="group/action flex flex-col items-start gap-1 border-r border-white/15 py-4 pr-4 text-left transition-colors last:border-r-0 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
  >
    <span className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-heritage" strokeWidth={1.5} />
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white">
        {label}
      </span>
      {!disabled && (
        <ArrowUpRight
          className="h-3 w-3 text-white/45 transition-transform duration-500 ease-out group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5"
          strokeWidth={1.5}
        />
      )}
    </span>
    <span className="text-[11px] text-white/55">{detail}</span>
  </button>
)
