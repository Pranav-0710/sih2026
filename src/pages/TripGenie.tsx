import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import { HfInference } from '@huggingface/inference';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

const TripGenie = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Trip Genie, your AI travel companion for exploring the beautiful state of Jharkhand. I can help you plan the perfect trip based on your interests, budget, and time. What would you like to discover today? 🌟",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: '',
    duration: '',
    interests: [] as string[],
    location: ''
  });
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const interestOptions = [
    'Heritage Sites', 'Nature & Wildlife', 'Adventure', 'Tribal Culture', 
    'Photography', 'Spiritual', 'Food & Cuisine', 'Festivals'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are Trip Genie, an AI travel assistant specialized in Jharkhand tourism. You help visitors discover the rich cultural heritage, natural beauty, and tribal traditions of Jharkhand.\n\nKey knowledge about Jharkhand:\n- Famous heritage sites: Jagannath Temple Ranchi, Rajrappa Temple, Deoghar Baidyanath Temple\n- Natural attractions: Hundru Falls, Dassam Falls, Betla National Park, Netarhat, Palamau Tiger Reserve\n- Tribal culture: Santhal, Munda, Oraon tribes with unique festivals like Karma, Sarhul, Tusu\n- Adventure activities: Trekking in Parasnath Hills, river rafting, wildlife safaris\n- Cultural experiences: Tribal dance performances, handicraft workshops, village stays\n- Best time: October to March for most places\n- Local cuisine: Thekua, Pittha, Dhuska, tribal honey, bamboo shoot dishes\n\nGuidelines:\n1. Always prioritize Jharkhand destinations and experiences\n2. Consider the user's budget, duration, and interests\n3. Provide practical information: costs, best times to visit, transportation\n4. Include cultural immersion opportunities\n5. Suggest heritage sites based on user interests\n6. Be enthusiastic and informative\n7. Format responses in a conversational, helpful manner\n8. Include approximate costs in INR\n9. Suggest 2-3 day itineraries when appropriate\n\nCurrent request context:\nBudget: ${preferences.budget || 'Not specified'}\nDuration: ${preferences.duration || 'Not specified'} \nInterests: ${preferences.interests.join(', ') || 'General tourism'}\nLocation preference: ${preferences.location || 'Anywhere in Jharkhand'}`;

      const response = await hf.chatCompletion({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: inputMessage }
        ],
        max_tokens: 1000,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.choices[0].message?.content || "Sorry, I couldn't generate a response.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Trip Genie error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from Trip Genie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const suggestedQuestions = [
    "Plan a 3-day heritage tour of Ranchi",
    "Best waterfalls to visit in monsoon",
    "Tribal culture experiences in Jharkhand",
    "Adventure activities under ₹5000",
    "Family-friendly places near Jamshedpur"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Preferences Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Trip Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Budget Range
                  </label>
                  <Select value={preferences.budget} onValueChange={(value) => setPreferences(prev => ({...prev, budget: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                      <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                      <SelectItem value="15000-30000">₹15,000 - ₹30,000</SelectItem>
                      <SelectItem value="above-30000">Above ₹30,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </label>
                  <Select value={preferences.duration} onValueChange={(value) => setPreferences(prev => ({...prev, duration: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="2-3-days">2-3 Days</SelectItem>
                      <SelectItem value="4-7-days">4-7 Days</SelectItem>
                      <SelectItem value="1-week+">1 Week+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Preferred Area
                  </label>
                  <Input
                    placeholder="e.g. Ranchi, Jamshedpur"
                    value={preferences.location}
                    onChange={(e) => setPreferences(prev => ({...prev, location: e.target.value}))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Badge
                        key={interest}
                        variant={preferences.interests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto p-2"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col min-h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Trip Genie - AI Travel Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-2 max-h-[calc(100vh-300px)]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isBot
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <div className={`text-sm prose dark:prose-invert max-w-none ${
                          !message.isBot && 'prose-white-text'
                        }`}>
                          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          Trip Genie is thinking...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me about places to visit, itineraries, costs, or anything about Jharkhand tourism..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripGenie;
