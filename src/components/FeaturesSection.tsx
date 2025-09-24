import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  MapPin, 
  Award, 
  Users, 
  Shield, 
  Calendar,
  Compass,
  Camera
} from "lucide-react";
import { Link } from "react-router-dom";
import heritageImage from "@/assets/heritage-site.png";
import tribalImage from "@/assets/tribal-culture.png";
import natureImage from "@/assets/nature-wildlife.png";
import { motion } from "framer-motion";

const colorMap = {
  heritage: {
    bg: "bg-orange-100",
    text: "text-orange-500",
  },
  cultural: {
    bg: "bg-blue-100",
    text: "text-blue-500",
  },
  accent: {
    bg: "bg-yellow-100",
    text: "text-yellow-500",
  },
  nature: {
    bg: "bg-green-100",
    text: "text-green-500",
  },
  destructive: {
    bg: "bg-red-100",
    text: "text-red-500",
  },
  primary: {
    bg: "bg-purple-100",
    text: "text-purple-500",
  },
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Trip Genie AI",
      description: "Your personal AI travel assistant that creates customized itineraries based on your interests, budget, and travel style.",
      color: "heritage",
      image: null,
      path: "/trip-genie"
    },
    {
      icon: MapPin,
      title: "Cultural Heritage Hub",
      description: "Explore 50+ heritage sites with interactive maps, audio stories, and 360° virtual tours of ancient temples and tribal art.",
      color: "cultural",
      image: heritageImage,
      path: "/heritage"
    },
    {
      icon: Award,
      title: "FunScapes",
      description: "Learn through interactive quizzes and earn badges for discovering Jharkhand's rich history and tribal traditions.",
      color: "accent",
      image: null,
      path: "/funscapes"
    },
    {
      icon: Users,
      title: "Community Wall",
      description: "Connect with fellow travelers, share experiences, and discover hidden gems recommended by locals.",
      color: "nature",
      image: tribalImage,
      path: "/community"
    },
    {
      icon: Shield,
      title: "Emergency Assistance",
      description: "24/7 safety support with SOS button, emergency contacts, and real-time location sharing for remote areas.",
      color: "destructive",
      image: null,
      path: "/emergency"
    },
    {
      icon: Calendar,
      title: "Gen-Z Corner",
      description: "A vibrant space for the young and trendy, offering unique experiences, digital content, and interactive challenges tailored for Gen-Z travelers.",
      color: "primary",
      image: natureImage,
      path: "/genzcorner"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 text-primary mb-4">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">Explore Our Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for the Perfect{" "}
            <span className="text-primary">Jharkhand Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI-powered trip planning to emergency assistance, we've got you covered 
            at every step of your cultural and natural exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group hover:shadow-strong transition-all duration-500 hover:-translate-y-1 border-0 shadow-soft overflow-hidden h-full"
              >
                {feature.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${colorMap[feature.color]?.bg}`}>
                      <feature.icon className={`h-5 w-5 ${colorMap[feature.color]?.text}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.path ? (
                    <Link to={feature.path}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-medium group"
                      >
                        Learn More
                        <Compass className="ml-1 h-3 w-3 group-hover:rotate-12 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-medium group"
                    >
                      Learn More
                      <Compass className="ml-1 h-3 w-3 group-hover:rotate-12 transition-transform" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="group">
            <Camera className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Start Exploring Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;