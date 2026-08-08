import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProgressiveImage from "@/components/ProgressiveImage";
import { localExperiences } from "@/data/localExperiences";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const AUTOPLAY_MS = 5000;

/**
 * An auto-advancing strip for local experiences.
 * Matches the premium design language of MonasteryShowcase but in a compact format.
 */
const LocalExperiencesCarousel = () => {
  const { t } = useTranslation();
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
          {localExperiences.map((exp, i) => (
            <CarouselItem key={exp.id} className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <a
                href={exp.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(event) => {
                  lastPointerType.current = event.pointerType;
                }}
                onClick={(e) => {
                  // Touch devices reveal the information first; a second tap goes to Maps.
                  if (lastPointerType.current === "touch" && revealedCard !== exp.id) {
                    e.preventDefault();
                    setRevealedCard(exp.id);
                  }
                }}
                aria-label={`${t("features.explore")} ${exp.title}`}
                aria-expanded={revealedCard === exp.id}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer",
                  revealedCard === exp.id && "is-revealed"
                )}
              >
                {/* 16:9 aspect ratio makes it roughly 40-50% shorter than the 4:5 Monastery cards */}
                <div className="relative aspect-video overflow-hidden">
                  <ProgressiveImage
                    src={exp.image}
                    alt={exp.title}
                    wrapperClassName="absolute inset-0"
                    className="h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.07] motion-reduce:transform-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-300 ease-in-out group-hover:bg-black/50 group-focus-visible:bg-black/50 group-[.is-revealed]:bg-black/50 motion-reduce:transition-none" />

                  <span className="absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-widest text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-display text-xl leading-none text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-5 group-focus-visible:-translate-y-5 group-[.is-revealed]:-translate-y-5 motion-reduce:transition-none">
                      {exp.title}
                    </h3>
                    <span className="mt-2 block h-px w-6 bg-heritage transition-all duration-500 ease-out group-hover:w-12 group-focus-visible:w-12 group-[.is-revealed]:w-12 motion-reduce:transition-none" />
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/65">
                      {exp.category}
                    </p>
                    <div className="max-h-0 translate-y-2 overflow-hidden opacity-0 transition-[max-height,opacity,transform] duration-300 ease-in-out group-hover:max-h-20 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:max-h-20 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-[.is-revealed]:max-h-20 group-[.is-revealed]:translate-y-0 group-[.is-revealed]:opacity-100 motion-reduce:transition-none">
                      <p className="mt-2 line-clamp-2 text-xs leading-snug text-white/90">{exp.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3">
        <div className="flex items-center gap-2">
          {localExperiences.map((exp, i) => (
            <button
              key={exp.id}
              onClick={() => api?.scrollTo(i)}
              aria-label={`${t("aria.goTo", "Go to")} ${exp.title}`}
              className={cn(
                "h-px transition-all duration-500 ease-out",
                i === selected ? "w-8 bg-primary" : "w-4 bg-foreground/25 hover:bg-foreground/50"
              )}
            />
          ))}
          <span className="ml-3 font-mono text-[11px] tabular-nums text-muted-foreground">
            {String(selected + 1).padStart(2, "0")} / {String(localExperiences.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => api?.scrollPrev()}
            aria-label={t("aria.previousExperience", "Previous experience")}
            className="flex h-8 w-8 items-center justify-center border border-foreground/15 text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            aria-label={t("aria.nextExperience", "Next experience")}
            className="flex h-8 w-8 items-center justify-center border border-foreground/15 text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalExperiencesCarousel;
