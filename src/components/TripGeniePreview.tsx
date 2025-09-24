import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, MessageCircle, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const TripGeniePreview = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-heritage/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Bot className="h-4 w-4 text-heritage" />
              <span className="text-sm font-medium text-heritage">AI-Powered Travel Planning</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Meet Your Personal{" "}
                <span className="text-heritage">Trip Genie</span>
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Our AI assistant understands your travel preferences and creates 
                personalized itineraries that blend adventure, culture, and nature 
                - perfectly tailored to your Jharkhand journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-heritage/20 p-2 rounded-lg">
                  <Star className="h-4 w-4 text-heritage" />
                </div>
                <span className="font-medium">Smart Recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-heritage/20 p-2 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-heritage" />
                </div>
                <span className="font-medium">24/7 Chat Support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-heritage/20 p-2 rounded-lg">
                  <Sparkles className="h-4 w-4 text-heritage" />
                </div>
                <span className="font-medium">Instant Itineraries</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-heritage/20 p-2 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-heritage" />
                </div>
                <span className="font-medium">Local Insights</span>
              </div>
            </div>

            <Link to="/trip-genie">
              <Button 
                variant="heritage" 
                size="lg" 
                className="group shadow-glow hover:shadow-strong"
              >
                <Bot className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Chat with Trip Genie
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Demo Chat Interface */}
          <div className="relative">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-strong">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-heritage p-2 rounded-full">
                    <Bot className="h-5 w-5 text-heritage-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Trip Genie</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-white/70">Online</span>
                    </div>
                  </div>
                </div>

                {/* Sample Messages */}
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ml-8">
                    <p className="text-white text-sm">
                      "I want to explore tribal culture and nature in 3 days with a ₹15,000 budget"
                    </p>
                  </div>
                  
                  <div className="bg-heritage/30 backdrop-blur-sm rounded-lg p-3 mr-8">
                    <p className="text-white text-sm">
                      Perfect! I've created a 3-day cultural immersion journey including:
                    </p>
                    <ul className="text-xs text-white/90 mt-2 space-y-1">
                      <li>🏛️ Jagannath Temple & Tribal Museum</li>
                      <li>🌿 Betla National Park Safari</li>
                      <li>🎭 Authentic Santali Village Experience</li>
                      <li>💰 Total cost: ₹14,500 (within budget!)</li>
                    </ul>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ml-8">
                    <p className="text-white text-sm">
                      "This looks amazing! Can you book it?"
                    </p>
                  </div>

                  <div className="bg-heritage/30 backdrop-blur-sm rounded-lg p-3 mr-8">
                    <p className="text-white text-sm">
                      Absolutely! I'll connect you with local verified guides and arrange everything. 
                      Ready to start your Jharkhand adventure? ✨
                    </p>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex items-center space-x-2 mt-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-white/70">Trip Genie is typing...</span>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-heritage p-3 rounded-full shadow-glow animate-pulse">
              <Sparkles className="h-6 w-6 text-heritage-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripGeniePreview;