import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProgressiveImage from "@/components/ProgressiveImage";

const monasteries = [
  { name: "Rumtek Monastery", image: "/vr-assets/rumtek-monastery.jpg" },
  { name: "Pemayangtse Monastery", image: "/vr-assets/pemayangtse-monastery.jpg" },
  { name: "Tashiding Monastery", image: "/vr-assets/tashiding-monastery.jpg" },
  { name: "Enchey Monastery", image: "/vr-assets/enchey-monastery.jpg" },
];

const AUTOPLAY_MS = 4000;

/**
 * Auto-advancing monastery strip. Each card links through to /explore,
 * where the full history of every site lives.
 */
const MonasteryShowcase = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api || paused) return;
    const timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [api, paused]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: true }}
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CarouselContent className="-ml-4">
        {monasteries.map((site) => (
          <CarouselItem
            key={site.name}
            className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <button
              type="button"
              onClick={() => navigate("/explore")}
              aria-label={`Explore ${site.name}`}
              className="group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
            >
              <ProgressiveImage
                src={site.image}
                alt={site.name}
                wrapperClassName="absolute inset-0"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 font-semibold text-white drop-shadow">
                {site.name}
              </span>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-3 size-10 border-none bg-white/90 text-gray-900 shadow-lg hover:bg-white" />
      <CarouselNext className="right-3 size-10 border-none bg-white/90 text-gray-900 shadow-lg hover:bg-white" />
    </Carousel>
  );
};

export default MonasteryShowcase;
