import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import KoraPreview from "@/components/TripGeniePreview";
import MonasteryShowcase from "@/components/MonasteryShowcase";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

const Index = () => {

  return (
    <PageLayout noTopPadding={true} noBackground={true}>
      <main className="bg-transparent overflow-x-hidden">
        <HeroSection />
      
      <div className="relative">
        <WaveDivider className="-mt-20 md:-mt-32 text-white" />
        <div className="bg-background">
            <FeaturesSection />
        </div>
      </div>

      <section className="py-20 bg-background">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="container mx-auto px-4"
        >
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-12 text-foreground tracking-tight">Experience Sikkim's Monasteries</h2>
            <MonasteryShowcase />
        </motion.div>
      </section>

      <div className="relative">
        <WaveDivider className="text-white" />
        <div className="bg-gray-900">
            <KoraPreview />
        </div>
        <WaveDivider className="transform scale-y-[-1] text-gray-900" />
      </div>

      <Footer />
    </main>
    </PageLayout>
  );
};

export default Index;
