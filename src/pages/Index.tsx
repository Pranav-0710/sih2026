import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PopularDestinations from "@/components/PopularDestinations";
import TripGeniePreview from "@/components/TripGeniePreview";
import Footer from "@/components/Footer";
import { useRef, useEffect } from "react";

const Index = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            const currentSrc = videoRef.current.src;
            if (entry.isIntersecting) {
              // If not already playing, add autoplay
              if (!currentSrc.includes("autoplay=1")) {
                videoRef.current.src = currentSrc.replace("autoplay=0", "autoplay=1").replace("autoplay=0", "autoplay=1") + "&autoplay=1";
              }
            } else {
              // If playing, pause or reset
              if (currentSrc.includes("autoplay=1")) {
                videoRef.current.src = currentSrc.replace("autoplay=1", "autoplay=0");
              }
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the video is visible
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
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Experience Jharkhand's Beauty</h2>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
            src="https://www.youtube.com/embed/eDIJv93S_tQ?autoplay=0&loop=1&playlist=eDIJv93S_tQ" // Start with autoplay=0
            title="Jharkhand Scenery Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      <TripGeniePreview />
      <Footer />
    </main>
  );
};

export default Index;
