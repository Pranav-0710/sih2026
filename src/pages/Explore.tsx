import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, Headphones, ShieldAlert } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { locations } from "@/data/monasteries";

const Explore = () => {
  return (
    <PageLayout noTopPadding noBackground>
      <div className="relative min-h-screen overflow-hidden bg-[#0a0e1a]">
        {/* Ambient light */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute top-1/2 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-heritage/15 blur-[130px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">
          {/* Header */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <Compass className="h-3.5 w-3.5" />
              The Buddhist Circuit
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Explore Sikkim's{" "}
              <span className="text-gradient-heritage">Monasteries</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              A closer look at the history, culture and geography behind each
              site.
            </p>
          </div>

          {/* Sites */}
          <div className="space-y-24">
            {locations.map((site, index) => {
              const flipped = index % 2 === 1;
              return (
                <motion.article
                  key={site.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 items-center gap-10 md:grid-cols-2"
                >
                  {/* Image */}
                  <div
                    className={`relative ${flipped ? "md:order-2" : ""}`}
                  >
                    <div
                      aria-hidden
                      className="absolute -inset-4 rounded-[2rem] bg-heritage/10 blur-2xl"
                    />
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                      <ProgressiveImage
                        src={site.image}
                        alt={site.name}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                        {site.type}
                      </span>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className={flipped ? "md:order-1" : ""}>
                    <span className="font-display text-6xl font-semibold leading-none text-white/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
                      {site.name}
                    </h2>
                    <p className="mt-4 leading-relaxed text-white/65">
                      {site.educationalContent?.history}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-primary to-accent font-semibold text-white hover:opacity-90"
                      >
                        <Link to="/vr-experience">
                          <Headphones className="mr-2 h-4 w-4" />
                          Take the virtual tour
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/20 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link to="/report-condition">
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Report a condition issue
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Explore;
