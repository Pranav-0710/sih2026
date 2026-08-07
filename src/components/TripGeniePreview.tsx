import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

/**
 * Kora preview.
 *
 * The mock conversation mirrors what the deployed edge function actually
 * answers — grounded in the four monasteries, no invented sites. Emoji
 * bullets were removed: they read as filler, and the real assistant
 * replies in prose.
 */
const KoraPreview = () => {
  return (
    <section className="bg-gray-900 py-24 md:py-32">
      <ScrollReveal className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-heritage" />
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-heritage">
                AI Monastery Guide
              </span>
            </div>

            <h2 className="mt-8 font-display text-4xl leading-[1.1] tracking-tight text-white md:text-5xl">
              Meet Kora,
              <span className="block text-white/55">your circuit guide</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/60">
              Named for the ritual circuit walked clockwise around a monastery.
              Kora answers questions on history, lineage, festivals and
              etiquette — and plans a route across the four sites.
            </p>

            {/* Concrete capabilities with real answers behind them, rather
                than the previous generic "24/7 support" style claims. */}
            <dl className="mt-10 space-y-0 border-t border-white/10">
              {[
                { term: "Grounded", detail: "Answers limited to the four monasteries — it says so when it doesn't know." },
                { term: "Streaming", detail: "Replies arrive word by word, first token in under a second." },
                { term: "Contextual", detail: "Remembers your budget, dates and interests across the conversation." },
              ].map((item) => (
                <div
                  key={item.term}
                  className="grid grid-cols-3 gap-4 border-b border-white/10 py-4"
                >
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-heritage">
                    {item.term}
                  </dt>
                  <dd className="col-span-2 text-sm leading-relaxed text-white/60">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              to="/trip-genie"
              style={{ "--wipe": "hsl(var(--heritage))" } as React.CSSProperties}
              className="btn-wipe group mt-10 inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-white hover:border-transparent hover:text-[#1a1207]"
            >
              Chat with Kora
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-sm border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-display text-lg text-white">Kora</span>
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-heritage" />
                  Online
                </span>
              </div>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-sm bg-white/10 px-4 py-3 text-white/85">
                    I only have 2 days and I'm starting in Gangtok — which
                    monastery should I visit first?
                  </p>
                </div>

                <div className="max-w-[92%] border-l-2 border-heritage pl-4">
                  <p className="leading-relaxed text-white/75">
                    Start with the two closest to Gangtok. Rumtek, the seat of
                    the Karma Kagyu lineage, sits about 24&nbsp;km out across the
                    valley. Enchey is barely 3&nbsp;km from town and is known for
                    its masked Cham dances. Both fit comfortably into one day.
                  </p>
                </div>

                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-sm bg-white/10 px-4 py-3 text-white/85">
                    Perfect, and what about day two?
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-heritage" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-heritage [animation-delay:0.15s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-heritage [animation-delay:0.3s]" />
                  <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Kora is typing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default KoraPreview;
