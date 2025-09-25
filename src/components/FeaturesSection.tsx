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
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bot,
    title: "Trip Genie AI",
    description:
      "Your personal AI travel assistant that creates customized itineraries based on your interests, budget, and travel style.",
    color: "primary",
    path: "/trip-genie",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&auto=format",
  },
  {
    icon: MapPin,
    title: "Cultural Heritage Hub",
    description:
      "Explore 50+ heritage sites with interactive maps, audio stories, and 360° virtual tours of ancient temples and tribal art.",
    color: "heritage",
    path: "/heritage",
    image:
      "https://imgs.search.brave.com/GPAAu6X5fBcNBUCSaH424zTqH1xqJUMESLteTPbCk-I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZ2VvZ3Jh/cGhpY2Jvb2suY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA3L0N1bHR1cmFs/LUhlcml0YWdlLmpw/ZWc_cmVzaXplPTEw/MjQsNTc2JnNzbD0x",
  },
  {
    icon: Award,
    title: "FunScapes",
    description:
      "Learn through interactive quizzes and earn badges for discovering Jharkhand's rich history and tribal traditions.",
    color: "accent",
    path: "/funscapes",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format",
  },
  {
    icon: Users,
    title: "Community Wall",
    description:
      "Connect with fellow travelers, share experiences, and discover hidden gems recommended by locals.",
    color: "nature",
    path: "/community",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format",
  },
  {
    icon: Shield,
    title: "Emergency Assistance",
    description:
      "24/7 safety support with SOS button, emergency contacts, and real-time location sharing for remote areas.",
    color: "destructive",
    path: "/emergency",
    image:
      "https://imgs.search.brave.com/vg0BOb22uwlcInV964a6S1m9UO9akXaL45Z1LhJvV2M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzExLzg4LzUyLzUw/LzM2MF9GXzExODg1/MjUwMDFfR1QzZTNy/NzBzYU1kMktheGV4/cGxwYkdDMmFQSjNZ/WkEuanBn",
  },
  {
    icon: Calendar,
    title: "Gen-Z Corner",
    description:
      "A vibrant space for the young and trendy, offering unique experiences, digital content, and interactive challenges tailored for Gen-Z travelers.",
    color: "cultural",
    path: "/genzcorner",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const FeatureCard = ({ feature, index }) => {
  const iconColorVariants = {
    primary: "bg-primary/10 text-primary",
    heritage: "bg-heritage/10 text-heritage",
    accent: "bg-accent/10 text-accent",
    nature: "bg-nature/10 text-nature",
    destructive: "bg-destructive/10 text-destructive",
    cultural: "bg-cultural/10 text-cultural",
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="group h-full [perspective:1000px]">
        <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front of card - Image */}
          <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-full">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                    iconColorVariants[feature.color]
                  )}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-sm opacity-90">
                  Hover to learn more
                </p>
              </div>
            </div>
          </div>

          {/* Back of card - Content */}
          <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl">
            <Card className="h-full flex flex-col rounded-2xl shadow-lg bg-white">
              <CardHeader className="pb-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center mb-4",
                    iconColorVariants[feature.color]
                  )}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>
                <div className="mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="font-semibold w-full"
                  >
                    <Link to={feature.path}>Explore</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-primary mb-4">
            <Compass className="h-5 w-5" />
            <span className="font-semibold">Explore Our Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Everything for Your Perfect Trip
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            From AI-powered planning to 24/7 safety, we've got you covered at
            every step of your cultural and natural exploration of Jharkhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="h-80">
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Button
            size="lg"
            asChild
            className="font-bold text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-nature text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <Link to="/explore">
              <Camera className="h-6 w-6 mr-3" />
              Start Exploring Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
