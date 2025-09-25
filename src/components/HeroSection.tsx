import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Calendar, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-jharkhand.png";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeWriter } from "./TypeWriter";
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
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${heroImage})`,
          y,
          opacity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-heritage/20 border border-heritage/30 rounded-full backdrop-blur-sm"
              >
                <Award className="h-4 w-4 text-heritage" />
                <span className="text-sm font-medium text-heritage">
                  Official Tourism Partner
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Discover the Soul of{" "}
                  <span className="block">
                    <TypeWriter
                      text="Jharkhand"
                      speed={150}
                      delay={1500}
                      className="bg-gradient-to-r from-heritage to-accent bg-clip-text text-transparent"
                    />
                  </span>
                </h1>
                <p className="text-xl text-gray-200 max-w-xl leading-relaxed">
                  Journey through ancient forests, discover tribal heritage, and
                  explore hidden waterfalls in India's untamed wilderness.
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
                  onClick={() => navigate("/heritage")}
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
                  <div className="text-2xl font-bold text-heritage">50+</div>
                  <div className="text-sm text-gray-300">Heritage Sites</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-heritage">15+</div>
                  <div className="text-sm text-gray-300">Tribal Villages</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-heritage">1000+</div>
                  <div className="text-sm text-gray-300">Happy Travelers</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="lg:ml-auto space-y-6 max-w-md"
            >
              {/* Quick Tour Card */}
              <div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/trip-genie")}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-heritage/20 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-heritage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Quick 3-Day Tour
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Perfect for first-time visitors
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Travel Card */}
              <div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/community")}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Group Adventures
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Join fellow travelers
                    </p>
                  </div>
                </div>
              </div>

              {/* Adventure Highlight */}
              <div className="bg-gradient-to-br from-heritage/20 to-accent/20 backdrop-blur-md rounded-2xl p-6 border border-heritage/30">
                <div className="text-center">
                  <h3 className="font-bold text-white text-lg mb-2">
                    Experience Authentic Jharkhand
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    From tribal festivals to hidden waterfalls
                  </p>
                  <div className="flex items-center justify-center gap-2 text-heritage font-semibold">
                    <span>Explore Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
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
