import { useState } from "react"
import { ArrowUpRight, BookOpen, Compass, HelpCircle } from "lucide-react"
import { PanoramaViewer } from "./panorama-viewer"
import { TriviaQuiz } from "./trivia-quiz"
import { StoryMode } from "./story-mode"
import { locations } from "@/data/monasteries"
import { getStory } from "@/data/stories"
import ScrollReveal from "@/components/ScrollReveal"

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
    <div className="min-h-screen bg-background py-20 md:py-28">
      <ScrollReveal className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="prayer-flags prayer-flags-lg" aria-hidden><span /><span /><span /><span /><span /></span>
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-heritage">
            Virtual Experience
          </span>
        </div>

        <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
          <h1 className="font-display text-4xl tracking-tight text-foreground md:col-span-7 md:text-5xl">
            Step inside four monasteries
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-2">
            Take a narrated story tour through each monastery's history, explore
            the photography up close, or test what you remember afterwards.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {locations.map((location, i) => {
            const story = getStory(location.id)
            const score = scores[location.id]

            return (
              <article key={location.id} className="group">
                <button
                  type="button"
                  onClick={() => story && setStoryLocationId(location.id)}
                  className="relative block w-full overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={`Begin the story tour of ${location.name}`}
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <span className="absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-widest text-white/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {score !== undefined && (
                      <span className="absolute right-4 top-4 border border-white/30 px-2.5 py-1 font-mono text-[10px] tabular-nums tracking-widest text-white/85">
                        {score} PTS
                      </span>
                    )}

                    <div className="absolute inset-x-4 bottom-4">
                      <h2 className="font-display text-2xl leading-none text-white md:text-3xl">
                        {location.name}
                      </h2>
                      <span className="mt-3 block h-px w-8 bg-heritage transition-all duration-500 ease-out group-hover:w-16" />
                      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/65">
                        {location.type}
                      </p>
                    </div>
                  </div>
                </button>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {location.description}
                </p>

                {/* Three explicit ways in, rather than one ambiguous CTA. */}
                <div className="mt-5 grid grid-cols-3 border-t border-foreground/10">
                  <EntryAction
                    icon={BookOpen}
                    label="Story"
                    detail={story ? `${story.chapters.length} chapters` : "Coming soon"}
                    disabled={!story}
                    onClick={() => story && setStoryLocationId(location.id)}
                  />
                  <EntryAction
                    icon={Compass}
                    label="Explore"
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
              </article>
            )
          })}
        </div>
      </ScrollReveal>
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
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="group/action flex flex-col items-start gap-1 border-r border-foreground/10 py-4 pr-4 text-left last:border-r-0 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <span className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-foreground/60" strokeWidth={1.5} />
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
        {label}
      </span>
      {!disabled && (
        <ArrowUpRight
          className="h-3 w-3 text-foreground/40 transition-transform duration-500 ease-out group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5"
          strokeWidth={1.5}
        />
      )}
    </span>
    <span className="text-[11px] text-muted-foreground">{detail}</span>
  </button>
)
