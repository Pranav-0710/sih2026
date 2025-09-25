import { Button } from "@/components/ui/button";
import { Sparkles, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-jharkhand.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-sm"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 text-center text-white"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-soft">
          <Sparkles className="h-5 w-5 text-heritage" />
          <span className="text-sm font-medium">Experience Jharkhand's Hidden Treasures</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          Discover the <span className="text-heritage">Soul</span> of Jharkhand
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Immerse yourself in tribal culture, explore ancient heritage sites, and experience the untamed wilderness with our AI-powered travel companion.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={() => navigate('/trip-genie')}
            className="font-bold text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-nature text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-button-glow"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            Plan Your Magical Trip
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="font-bold text-lg px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            onClick={() => navigate('/heritage')}
          >
            <MapPin className="h-6 w-6 mr-3" />
            Explore Heritage
          </Button>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-soft">
            <div className="text-4xl font-bold text-heritage">50+</div>
            <div className="text-white/80 mt-2">Heritage Sites</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-soft">
            <div className="text-4xl font-bold text-heritage">15+</div>
            <div className="text-white/80 mt-2">Tribal Communities</div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-soft">
            <div className="text-4xl font-bold text-heritage">200+</div>
            <div className="text-white/80 mt-2">Local Guides</div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center items-start pt-2">
          <motion.div 
            className="w-1.5 h-3 bg-white/80 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
