import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProgressiveImage from "@/components/ProgressiveImage";
import { locations } from "@/data/monasteries";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

const monasteries = locations.map((site) => ({
  ...site,
  displayName: site.name.replace(" Monastery", ""),
}));

/**
 * An auto-advancing editorial strip. Card content comes from the shared
 * monastery data so the homepage never drifts from the detailed experiences.
 */
const MonasteryShowcase = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const [revealedCard, setRevealedCard] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastPointerType = useRef<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (!api || paused || prefersReducedMotion) return;
    // A new selected index follows any drag, control, pagination, or autoplay move.
    const timer = window.setTimeout(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [api, paused, prefersReducedMotion, selected]);

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    return () => {
      api.off("select", sync);
    };
  }, [api]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {monasteries.map((site, i) => (
            <CarouselItem key={site.id} className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3">
              <button
                type="button"
                onPointerDown={(event) => {
                  lastPointerType.current = event.pointerType;
                }}
                onClick={() => {
                  // Touch devices reveal the information first; a second tap keeps the existing action.
                  if (lastPointerType.current === "touch" && revealedCard !== site.id) {
                    setRevealedCard(site.id);
                    return;
                  }
                  navigate("/explore");
                }}
                aria-label={`Explore ${site.name} Monastery`}
                aria-expanded={revealedCard === site.id}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  revealedCard === site.id && "is-revealed"
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProgressiveImage
                    src={site.image}
                    alt={site.name}
                    wrapperClassName="absolute inset-0"
                    className="h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.07] motion-reduce:transform-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-300 ease-in-out group-hover:bg-black/50 group-focus-visible:bg-black/50 group-[.is-revealed]:bg-black/50 motion-reduce:transition-none" />

                  <span className="absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-widest text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-display text-2xl leading-none text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-6 group-focus-visible:-translate-y-6 group-[.is-revealed]:-translate-y-6 motion-reduce:transition-none">
                      {site.displayName}
                    </h3>
                    <span className="mt-3 block h-px w-8 bg-heritage transition-all duration-500 ease-out group-hover:w-16 group-focus-visible:w-16 group-[.is-revealed]:w-16 motion-reduce:transition-none" />
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/65">
                      {site.foundingYear} · {site.sect}
                    </p>
                    <div className="max-h-0 translate-y-2 overflow-hidden opacity-0 transition-[max-height,opacity,transform] duration-300 ease-in-out group-hover:max-h-24 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-[.is-revealed]:max-h-24 group-[.is-revealed]:translate-y-0 group-[.is-revealed]:opacity-100 motion-reduce:transition-none">
                      <p className="mt-3 line-clamp-2 text-sm leading-snug text-white/90">{site.description}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/75">
                        {site.openingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-4">
        <div className="flex items-center gap-2">
          {monasteries.map((site, i) => (
            <button
              key={site.id}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to ${site.displayName}`}
              className={cn(
                "h-px transition-all duration-500 ease-out",
                i === selected ? "w-10 bg-primary" : "w-5 bg-foreground/25 hover:bg-foreground/50"
              )}
            />
          ))}
          <span className="ml-3 font-mono text-[11px] tabular-nums text-muted-foreground">
            {String(selected + 1).padStart(2, "0")} / {String(monasteries.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => api?.scrollPrev()}
            aria-label="Previous monastery"
            className="flex h-10 w-10 items-center justify-center border border-foreground/15 text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            aria-label="Next monastery"
            className="flex h-10 w-10 items-center justify-center border border-foreground/15 text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonasteryShowcase;
