import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TripGeniePreview from "@/components/TripGeniePreview";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoElement) {
            const currentSrc = videoElement.src;
            if (entry.isIntersecting) {
              if (!currentSrc.includes("autoplay=1")) {
                videoElement.src =
                  currentSrc.replace("autoplay=0", "autoplay=1") +
                  "&autoplay=1";
              }
            } else {
              if (currentSrc.includes("autoplay=1")) {
                videoElement.src = currentSrc.replace(
                  "autoplay=1",
                  "autoplay=0"
                );
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  useEffect(() => {
    if (videoContainerRef.current) {
      // GSAP animation for video container expansion
      gsap.fromTo(
        videoContainerRef.current,
        {
          width: "80%",
          borderRadius: "24px",
        },
        {
          width: "95%",
          borderRadius: "12px",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden pt-24">
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">
            Experience Jharkhand's Beauty
          </h2>
          <div className="flex justify-center items-center w-full">
            <div
              ref={videoContainerRef}
              className="relative shadow-2xl rounded-2xl overflow-hidden"
              style={{ paddingBottom: "45%", width: "80%", maxWidth: "1700px" }}
            >
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
          </div>
        </motion.div>
      </section>

      <div className="relative">
        {/* <WaveDivider /> */}
        <div className="bg-gray-900">
          <TripGeniePreview />
        </div>
        {/* <WaveDivider className="transform scale-y-[-1] text-gray-900" /> */}
      </div>

      <Footer />
    </main>
  );
};

export default Index;
