import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TripGeniePreview from "@/components/TripGeniePreview";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            const currentSrc = videoRef.current.src;
            if (entry.isIntersecting) {
              if (!currentSrc.includes("autoplay=1")) {
                videoRef.current.src = currentSrc.replace("autoplay=0", "autoplay=1") + "&autoplay=1";
              }
            } else {
              if (currentSrc.includes("autoplay=1")) {
                videoRef.current.src = currentSrc.replace("autoplay=1", "autoplay=0");
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden">
      <Navigation />
      <HeroSection />
      
      <div className="relative">
        <WaveDivider className="-mt-20 md:-mt-32" />
        <FeaturesSection />
      </div>
      
      <section className="py-20">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="container mx-auto px-4"
        >
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">Experience Jharkhand's Beauty</h2>
            <div className="relative w-full shadow-2xl rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/eDIJv93S_tQ?autoplay=0&loop=1&playlist=eDIJv93S_tQ&controls=0&modestbranding=1&rel=0"
                title="Jharkhand Scenery Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            </div>
        </motion.div>
      </section>

      <div className="relative">
        <WaveDivider />
        <div className="bg-gray-900">
            <TripGeniePreview />
        </div>
        <WaveDivider className="transform scale-y-[-1] text-gray-900" />
      </div>

      <Footer />
    </main>
  );
};

export default Index;
