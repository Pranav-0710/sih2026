import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import ScrollReveal from "@/components/ScrollReveal";
import { locations } from "@/data/monasteries";
import { getStory } from "@/data/stories";

/**
 * The Buddhist Circuit index.
 *
 * Rebuilt to the editorial system used across the rest of the site: hairline
 * rules, mono numerals and plain imagery, in place of the blurred ambient
 * orbs, rounded-3xl cards on heavy shadows, and gradient-filled buttons that
 * were here before. Each entry now also links to its story tour, which is
 * the strongest thing to offer from a page whose whole job is "read more
 * about this monastery".
 */
const Explore = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-20 md:py-28">
        <ScrollReveal className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              The Buddhist Circuit
            </span>
          </div>

          <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
            <h1 className="font-display text-4xl tracking-tight text-foreground md:col-span-7 md:text-5xl">
              Four monasteries, four centuries of practice
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-2">
              The history, culture and geography behind each site — and a
              narrated tour through all of them.
            </p>
          </div>

          <div className="mt-16 space-y-20 md:space-y-28">
            {locations.map((site, index) => {
              const flipped = index % 2 === 1;
              const story = getStory(site.id);

              return (
                <article
                  key={site.id}
                  className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-12"
                >
                  <div
                    className={`md:col-span-6 ${flipped ? "md:order-2 md:col-start-7" : ""}`}
                  >
                    <div className="group relative overflow-hidden rounded-sm">
                      <ProgressiveImage
                        src={site.image}
                        alt={site.name}
                        className="aspect-[4/3] w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 font-mono text-[11px] tabular-nums tracking-widest text-white/75">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className={`md:col-span-6 ${flipped ? "md:order-1 md:col-start-1" : ""}`}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-primary">
                      {site.type}
                    </p>
                    <h2 className="mt-3 font-display text-3xl tracking-tight text-foreground md:text-4xl">
                      {site.name}
                    </h2>
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {site.educationalContent?.history}
                    </p>

                    <div className="mt-8 grid grid-cols-2 border-t border-foreground/10">
                      <Link
                        to="/vr-experience"
                        className="group/link flex flex-col gap-1 border-r border-foreground/10 py-4 pr-4"
                      >
                        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                          Story tour
                          <ArrowUpRight
                            className="h-3 w-3 text-foreground/40 transition-transform duration-500 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            strokeWidth={1.5}
                          />
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {story ? `${story.chapters.length} chapters` : "Virtual experience"}
                        </span>
                      </Link>
                      <Link
                        to="/report-condition"
                        className="group/link flex flex-col gap-1 py-4 pl-4"
                      >
                        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                          Report a condition
                          <ArrowUpRight
                            className="h-3 w-3 text-foreground/40 transition-transform duration-500 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            strokeWidth={1.5}
                          />
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Help preserve this site
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
  );
};

export default Explore;
