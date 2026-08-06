import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroMediaCarousel } from "./HeroMediaCarousel";
import { useRef } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      <motion.div className="absolute inset-0 scale-110" style={{ y, opacity }}>
        <HeroMediaCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
                className="space-y-4"
              >
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
                  Discover the Soul of{" "}
                  <span className="block italic bg-gradient-to-r from-heritage to-accent bg-clip-text text-transparent">
                    Sikkim
                  </span>
                </h1>
                <p className="text-xl text-gray-200 max-w-xl leading-relaxed font-light">
                  Step inside centuries-old monasteries, explore Himalayan
                  Buddhist heritage, and help preserve it for the next generation.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={() => navigate("/trip-genie")}
                  size="lg"
                  className="group bg-heritage hover:bg-heritage/90 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/vr-experience")}
                  className="border-2 border-white/30 text-black hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Preview
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-heritage">4</div>
                  <div className="text-sm text-gray-300">Flagship Monasteries</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-heritage">360°</div>
                  <div className="text-sm text-gray-300">Virtual Tours</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-heritage">AI</div>
                  <div className="text-sm text-gray-300">Severity Triage</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - single focal card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className="hidden lg:flex lg:ml-auto max-w-sm"
            >
              <button
                onClick={() => navigate("/explore")}
                className="group w-full rounded-2xl border border-heritage/30 bg-gradient-to-br from-heritage/20 to-accent/20 p-8 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-heritage/50 hover:shadow-2xl"
              >
                <h3 className="font-display text-2xl font-semibold text-white">
                  Experience Sikkim's Living Heritage
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  From masked Cham dances to sacred chortens, discover the
                  four monasteries that define the Buddhist Circuit.
                </p>
                <div className="mt-6 flex items-center gap-2 font-semibold text-heritage">
                  <span>Explore Now</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center items-start pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-1.5 h-3 bg-white/60 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
        </motion.div>
      </div> */}
    </section>
  );
};

export default HeroSection;
