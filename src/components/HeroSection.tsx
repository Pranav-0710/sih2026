import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-jharkhand.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center lg:text-left">
        <div className="max-w-4xl mx-auto lg:mx-0">
          <div className="mb-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Experience Jharkhand's Hidden Treasures</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover the{" "}
            <span className="text-heritage">Soul</span>{" "}
            of Jharkhand
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Immerse yourself in tribal culture, explore ancient heritage sites, and experience 
            the untamed wilderness of Jharkhand with our AI-powered travel companion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="group">
              <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" onClick={() => navigate('/heritage')}>
              <MapPin className="h-5 w-5 mr-2" />
              Explore Heritage Sites
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm">Heritage Sites</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-white/80 text-sm">Tribal Communities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-white/80 text-sm">Local Guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;