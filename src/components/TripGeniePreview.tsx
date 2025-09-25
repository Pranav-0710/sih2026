import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, MessageCircle, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TripGeniePreview = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-primary">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI-Powered Travel Planning</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-800 tracking-tight">
                Meet Your Personal <span className="text-primary">Trip Genie</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our AI assistant creates personalized itineraries that blend adventure, culture, and nature—perfectly tailored for your Jharkhand journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {[ { icon: Star, text: "Smart Recommendations" },
                 { icon: MessageCircle, text: "24/7 Chat Support" },
                 { icon: Sparkles, text: "Instant Itineraries" },
                 { icon: ArrowRight, text: "Local Insights" } ].map(item => (
                <div key={item.text} className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button 
                size="lg"
                asChild
                className="font-bold text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-nature text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-button-glow"
              >
                <Link to="/trip-genie">
                  <Bot className="h-6 w-6 mr-3" />
                  Chat with Trip Genie
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, ease: "easeOut" }} 
            viewport={{ once: true, amount: 0.4 }}
            className="relative"
          >
            <Card className="bg-gray-800/90 backdrop-blur-2xl border-white/10 shadow-2xl shadow-black/30 rounded-3xl text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-heritage p-3 rounded-full shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Trip Genie</h4>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/70">Online</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 ml-8 max-w-xs self-end rounded-br-none">
                    <p>I want to explore tribal culture and nature in 3 days with a ₹15,000 budget.</p>
                  </div>
                  
                  <div className="bg-heritage/20 backdrop-blur-sm rounded-xl p-4 mr-8 max-w-md self-start rounded-bl-none">
                    <p className="font-semibold mb-2">Perfect! Here is your 3-day cultural immersion:</p>
                    <ul className="text-white/90 space-y-1.5 text-xs">
                      <li>🏛️ Jagannath Temple & Tribal Museum</li>
                      <li>🌿 Betla National Park Safari</li>
                      <li>🎭 Authentic Santali Village Experience</li>
                      <li className="font-bold pt-1">💰 Total cost: ₹14,500 (within budget!)</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 ml-8 max-w-xs self-end rounded-br-none">
                    <p>This looks amazing! Can you book it?</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-heritage rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                  <span className="text-xs text-white/60">Trip Genie is typing...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TripGeniePreview;
