import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Info, Moon, Sun, MapPin, ArrowUpRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import { StackedCards, StackCard } from "@/components/StackedCards";
import { festivals } from "@/data/festivals";

/**
 * Cultural calendar.
 *
 * Rebuilt onto the shared palette and the scroll-stacked deck. It previously
 * painted itself on a hardcoded #0a0e1a — a blue-black that matched nothing
 * else in the app — behind blurred colour orbs, which is the main reason
 * this page didn't look like it belonged to the same site.
 */
const CulturalCalendar = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-background pb-10 pt-24 md:pt-28">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="prayer-flags prayer-flags-lg" aria-hidden>
                <span /><span /><span /><span /><span />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-heritage">
                Cultural Calendar
              </span>
            </div>

            <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground md:col-span-7 md:text-7xl">
                The monastic
                <span className="block text-muted-foreground">year</span>
              </h1>
              <div className="md:col-span-5 md:pt-3">
                <p className="text-base leading-relaxed text-muted-foreground">
                  The rituals, masked dances and prophecies that mark the year
                  across Sikkim's monasteries.
                </p>

                {/* Honesty note — these dates genuinely cannot be pinned to a
                    Gregorian calendar without a lunar conversion table. */}
                <div className="mt-6 flex items-start gap-3 border-l-2 border-heritage/60 pl-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-heritage" strokeWidth={1.5} />
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    These follow the{" "}
                    <span className="text-foreground">Tibetan lunar calendar</span>,
                    so their position in the western year shifts annually.
                    Confirm exact dates with the monastery before travelling.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto mt-16 px-6 lg:px-8">
          <StackedCards>
            {festivals.map((festival, index) => (
              <StackCard key={festival.id} index={index}>
                <article className="lamp-edge relative h-[74vh] min-h-[30rem] overflow-hidden rounded-sm border border-foreground/10 bg-card">
                  <ProgressiveImage
                    src={festival.image}
                    alt={festival.monasteryName}
                    wrapperClassName="absolute inset-0"
                    className="h-full w-full object-cover"
                  />
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
                      <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/55">
                        {String(index + 1).padStart(2, "0")} / {String(festivals.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-heritage">
                          {festival.timingBasis === "lunar" ? (
                            <Moon className="h-3 w-3" strokeWidth={1.5} />
                          ) : (
                            <Sun className="h-3 w-3" strokeWidth={1.5} />
                          )}
                          {festival.timing}
                        </span>
                        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                          <MapPin className="h-3 w-3" strokeWidth={1.5} />
                          {festival.monasteryName}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-6xl">
                        {festival.name}
                      </h2>
                      <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
                        {festival.summary}
                      </p>
                      <p className="mt-4 max-w-xl border-t border-white/15 pt-4 text-sm leading-relaxed text-white/65">
                        {festival.detail}
                      </p>

                      <Link
                        to="/explore"
                        className="group mt-7 inline-flex items-center gap-2.5 border border-white/25 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-white/60 hover:text-white"
                      >
                        Read about {festival.monasteryName}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </StackCard>
            ))}
          </StackedCards>
        </div>
      </div>
    </PageLayout>
  );
};

export default CulturalCalendar;
