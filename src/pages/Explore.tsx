import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Compass, MapPin, Mountain } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import { StackedCards, StackCard } from "@/components/StackedCards";
import { locations } from "@/data/monasteries";
import { getStory } from "@/data/stories";
import { timelineEntries } from "@/data/games";

/**
 * The Buddhist Circuit.
 *
 * Rebuilt as a scroll-stacked deck: the first monastery fills the view on
 * arrival, and each subsequent one rides up over the last as you scroll.
 * The previous layout was a thin two-column text/image alternation which
 * read as an article rather than a place worth visiting — the imagery was
 * small and most of the screen was empty.
 */
const Explore = () => {
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
                The Buddhist Circuit
              </span>
            </div>

            <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
              <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground md:col-span-7 md:text-7xl">
                Four monasteries,
                <span className="block text-muted-foreground">
                  four centuries
                </span>
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-3">
                From Tashiding in 1641 to Enchey in 1909 — the history,
                practice and setting of every site on the circuit, and a
                narrated tour through each.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto mt-16 px-6 lg:px-8">
          <StackedCards>
            {locations.map((site, index) => {
              const story = getStory(site.id);
              const founded = timelineEntries.find((t) => t.id === site.id);

              return (
                <StackCard key={site.id} index={index}>
                  <article className="relative h-[74vh] min-h-[30rem] overflow-hidden rounded-sm border border-foreground/10 bg-card lamp-edge">
                    <ProgressiveImage
                      src={site.image}
                      alt={site.name}
                      wrapperClassName="absolute inset-0"
                      className="h-full w-full object-cover"
                    />
                    {/*
                      Legibility scrim, written as explicit stops rather than
                      Tailwind's three-stop from/via/to. The photographs vary
                      wildly in brightness — Pemayangtse's prayer flags are
                      near-white exactly where the headline sits — and the
                      coarser gradient left the type washed out over them.
                      Inline style keeps the stop positions exact instead of
                      fighting arbitrary-value escaping.
                    */}
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
                          {String(index + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="max-w-2xl">
                        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-heritage">
                          {site.type}
                        </p>
                        <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-6xl">
                          {site.name.replace(" Monastery", "")}
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                          {site.description}
                        </p>

                        {/* Concrete facts, not filler — each is sourced. */}
                        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-5">
                          {founded && (
                            <div>
                              <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                Founded
                              </dt>
                              <dd className="mt-1 font-mono text-lg tabular-nums text-white">
                                {founded.year}
                              </dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                              Hotspots
                            </dt>
                            <dd className="mt-1 font-mono text-lg tabular-nums text-white">
                              {site.hotspots?.length ?? 0}
                            </dd>
                          </div>
                          {story && (
                            <div>
                              <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                                Story
                              </dt>
                              <dd className="mt-1 font-mono text-lg tabular-nums text-white">
                                {story.chapters.length} ch.
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div className="mt-7 flex flex-wrap gap-3">
                          <Link
                            to="/vr-experience"
                            style={{ "--wipe": "hsl(var(--heritage))" } as React.CSSProperties}
                            className="btn-wipe group inline-flex items-center gap-2.5 border border-white/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white hover:border-transparent hover:text-[#1a1207]"
                          >
                            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Story tour
                          </Link>
                          <Link
                            to="/heritage"
                            className="group inline-flex items-center gap-2.5 border border-white/20 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white/50 hover:text-white"
                          >
                            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                            On the map
                            <ArrowUpRight
                              className="h-3 w-3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              strokeWidth={1.5}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </StackCard>
              );
            })}
          </StackedCards>
        </div>

        <div className="container mx-auto px-6 pb-24 lg:px-8">
          <div className="flex flex-col items-center gap-5 border-t border-foreground/10 pt-14 text-center">
            <Mountain className="h-5 w-5 text-heritage" strokeWidth={1.5} />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Every site on the circuit is a living monastery, not a museum.
              Visitors are asked to walk clockwise and to ask before
              photographing inside the shrine halls.
            </p>
            <Link
              to="/vr-experience"
              style={{ "--wipe": "hsl(var(--heritage))" } as React.CSSProperties}
              className="btn-wipe group mt-2 inline-flex items-center gap-3 border border-foreground/25 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground hover:border-transparent hover:text-[#1a1207]"
            >
              <Compass className="h-4 w-4" strokeWidth={1.5} />
              Enter the virtual circuit
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Explore;
