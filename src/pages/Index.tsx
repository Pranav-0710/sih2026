import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import KoraPreview from "@/components/TripGeniePreview";
import MonasteryShowcase from "@/components/MonasteryShowcase";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * Sections now butt directly against one another and are separated by
 * background weight and hairline rules. The decorative SVG wave dividers
 * that previously sat between them were the most template-looking element
 * on the page.
 */
const Index = () => {
  return (
    <PageLayout noTopPadding noBackground>
      <main className="overflow-x-hidden bg-transparent">
        <HeroSection />

        <div className="bg-background">
          <FeaturesSection />
        </div>

        <section className="bg-background pb-24 md:pb-32">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.25 }}
            >
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
            </motion.div>
          </div>
        </section>

        <KoraPreview />

        <Footer />
      </main>
    </PageLayout>
  );
};

export default Index;
