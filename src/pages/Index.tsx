import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import KoraPreview from "@/components/TripGeniePreview";
import MonasteryShowcase from "@/components/MonasteryShowcase";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * Sections now butt directly against one another and are separated by
 * background weight and hairline rules. The decorative SVG wave dividers
 * that previously sat between them were the most template-looking element
 * on the page.
 *
 * Each section's content rises into place as it enters the viewport (see
 * ScrollReveal). This used to be a continuous parallax driven by overall
 * page scroll progress (useScroll against the whole <main>, mapped over
 * fixed fractions like [0.25, 0.72]) — on a page this long that fraction
 * range covers a lot of vertical distance, so the resulting motion per
 * section was often just a few px and easy to miss entirely. A per-section
 * "enters viewport → rises into place" reveal is what was actually asked
 * for, and it can't go unnoticed the way a slow whole-page fraction can.
 */
const Index = () => {
  return (
    <PageLayout noTopPadding noBackground>
      <main className="overflow-x-hidden bg-transparent">
        <HeroSection />

        <div className="bg-background">
          <FeaturesSection />
        </div>

        <section className="relative z-10 bg-background pb-24 md:pb-32">
          <ScrollReveal className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
                The Circuit
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-foreground/10 pt-8">
              <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
                Four monasteries,
                <span className="block text-muted-foreground">
                  four centuries of practice
                </span>
              </h2>
              <Link
                to="/explore"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
              >
                All monasteries
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            <div className="mt-12">
              <MonasteryShowcase />
            </div>
          </ScrollReveal>
        </section>

        <KoraPreview />

        <Footer />
      </main>
    </PageLayout>
  );
};

export default Index;
