import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, Info, Moon, Sun, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { festivals } from "@/data/festivals";

const CulturalCalendar = () => {
  return (
    <PageLayout noTopPadding noBackground>
      <div className="relative min-h-screen overflow-hidden bg-[#0a0e1a]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-heritage/15 blur-[130px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5" />
              Cultural Calendar
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Festivals of the{" "}
              <span className="text-gradient-heritage">Buddhist Circuit</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              The rituals, masked dances and prophecies that mark the monastic
              year across Sikkim.
            </p>
          </div>

          {/* Honesty note — these dates genuinely cannot be pinned to a
              Gregorian calendar without a lunar conversion table. */}
          <div className="mx-auto mb-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-heritage/25 bg-heritage/10 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-heritage" />
            <p className="text-sm leading-relaxed text-white/70">
              These festivals follow the{" "}
              <span className="font-medium text-white">
                Tibetan lunar calendar
              </span>
              , so their position in the western year shifts annually. The
              traditional timing is shown below — please confirm exact dates
              with the monastery or Sikkim tourism before travelling.
            </p>
          </div>

          {/* Festivals */}
          <div className="mx-auto max-w-4xl space-y-6">
            {festivals.map((festival, index) => (
              <motion.article
                key={festival.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl md:flex"
              >
                <ProgressiveImage
                  src={festival.image}
                  alt={festival.monasteryName}
                  wrapperClassName="md:w-64 shrink-0"
                  className="h-48 w-full object-cover md:h-full"
                />

                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-heritage/15 px-3 py-1 text-[11px] font-medium text-heritage">
                      {festival.timingBasis === "lunar" ? (
                        <Moon className="h-3 w-3" />
                      ) : (
                        <Sun className="h-3 w-3" />
                      )}
                      {festival.timing}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
                      <MapPin className="h-3 w-3" />
                      {festival.monasteryName}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                    {festival.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-white/80">
                    {festival.summary}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {festival.detail}
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-5 border-white/20 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/explore">Read about {festival.monasteryName}</Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CulturalCalendar;
