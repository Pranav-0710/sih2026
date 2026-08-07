import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProgressiveImage from "@/components/ProgressiveImage";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

/** Founding years and lineages match the sourced data in data/monasteries.ts. */
const monasteries = [
  { name: "Rumtek", meta: "1734 · Karma Kagyu", image: "/vr-assets/rumtek-monastery.jpg" },
  { name: "Pemayangtse", meta: "1705 · Nyingma", image: "/vr-assets/pemayangtse-monastery.jpg" },
  { name: "Tashiding", meta: "1641 · Nyingma", image: "/vr-assets/tashiding-monastery.jpg" },
  { name: "Enchey", meta: "1909 · Nyingma", image: "/vr-assets/enchey-monastery.jpg" },
];

const AUTOPLAY_MS = 4500;

/**
 * Auto-advancing monastery strip; each card links through to /explore.
 *
 * Controls sit under the strip rather than floating over the artwork as
 * circular glass buttons, and each slide is numbered — the aim is an
 * editorial index rather than a generic image carousel.
 */
const MonasteryShowcase = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api || paused) return;
    const timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [api, paused]);

  // Keep the slide counter in step with drags and autoplay alike.
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
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {monasteries.map((site, i) => (
            <CarouselItem
              key={site.name}
              className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <button
                type="button"
                onClick={() => navigate("/explore")}
                aria-label={`Explore ${site.name} Monastery`}
                className="group relative block w-full overflow-hidden rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <ScrollReveal className="aspect-[4/5]" delay={i * 0.08}>
                  <ProgressiveImage
                    src={site.image}
                    alt={site.name}
                    wrapperClassName="absolute inset-0"
                    className="h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <span className="absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-widest text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-display text-2xl leading-none text-white">
                      {site.name}
                    </h3>
                    {/* Rule expands on hover — the only motion on the card
                        besides the slow image push. */}
                    <span className="mt-3 block h-px w-8 bg-heritage transition-all duration-500 ease-out group-hover:w-16" />
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/65">
                      {site.meta}
                    </p>
                  </div>
                </ScrollReveal>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controls and progress, on a rule below the strip */}
      <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-4">
        <div className="flex items-center gap-2">
          {monasteries.map((site, i) => (
            <button
              key={site.name}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to ${site.name}`}
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
