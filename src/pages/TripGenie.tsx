import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, MapPin, Clock, DollarSign, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

/**
 * Streams Kora's reply token-by-token from the edge function.
 *
 * Resolves `true` once any text has been delivered, `false` when streaming
 * isn't usable at all — the caller then retries via the function's plain
 * JSON mode rather than leaving the user with nothing.
 */
async function streamReply(
  body: Record<string, unknown>,
  onChunk: (chunk: string) => void
): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;

  let received = 0;
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token ?? SUPABASE_ANON_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/trip-genie-chat`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body, stream: true }),
      }
    );

    if (!response.ok || !response.body) return false;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      if (text) {
        received += text.length;
        onChunk(text);
      }
    }
  } catch {
    // A mid-stream failure that already produced text is reported as success
    // so the caller doesn't append a duplicate reply on top of it.
    return received > 0;
  }

  return received > 0;
}

const TripGenie = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Kora, your AI guide to Sikkim's monasteries. I can help you plan a self-guided Buddhist Circuit across Rumtek, Pemayangtse, Tashiding and Enchey based on your interests, budget, and time. What would you like to discover today? 🌟",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    budget: "",
    duration: "",
    interests: [] as string[],
    location: "",
  });
  const { toast } = useToast();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const interestOptions = [
    "Heritage Sites",
    "Monastic Architecture",
    "Spiritual",
    "Photography",
    "Festivals & Rituals",
    "Trekking",
    "Local Cuisine",
    "History",
  ];

  // Scroll the message list itself rather than using scrollIntoView, which
  // also scrolls every ancestor — including the window — and was shoving the
  // composer below the fold on load.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    const history = messages.slice(1).map((m) => ({
      role: m.isBot ? "assistant" : "user",
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const botId = (Date.now() + 1).toString();
    const payload = { message: inputMessage, history, preferences };
    let firstChunk = true;

    try {
      const streamed = await streamReply(payload, (chunk) => {
        if (firstChunk) {
          // First token in — swap the spinner for a live message bubble.
          firstChunk = false;
          setIsLoading(false);
          setStreamingId(botId);
          setMessages((prev) => [
            ...prev,
            { id: botId, content: chunk, isBot: true, timestamp: new Date() },
          ]);
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, content: m.content + chunk } : m
          )
        );
      });

      // Streaming unavailable (older browser, proxy buffering, etc.) — fall
      // back to the function's plain JSON mode so the demo still works.
      if (!streamed) {
        const { data, error } = await supabase.functions.invoke(
          "trip-genie-chat",
          { body: payload }
        );

        if (error) throw error;
        if (!data?.success) {
          throw new Error(data?.error || "Kora couldn't generate a response.");
        }

        setMessages((prev) => [
          ...prev,
          { id: botId, content: data.reply, isBot: true, timestamp: new Date() },
        ]);
      }
    } catch (error) {
      console.error("Kora error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Kora. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setStreamingId(null);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const suggestedQuestions = [
    "Plan a 2-day Buddhist Circuit starting from Gangtok",
    "What's the difference between Nyingma and Kagyu monasteries?",
    "Best time to visit for the Bumchu festival",
    "Monastery etiquette I should know before visiting",
    "Which monastery has the most impressive architecture?",
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Preferences Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-2">
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
                  <Select
                    value={preferences.budget}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({ ...prev, budget: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                      <SelectItem value="5000-15000">
                        ₹5,000 - ₹15,000
                      </SelectItem>
                      <SelectItem value="15000-30000">
                        ₹15,000 - ₹30,000
                      </SelectItem>
                      <SelectItem value="above-30000">Above ₹30,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </label>
                  <Select
                    value={preferences.duration}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({ ...prev, duration: value }))
                    }
                  >
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
                    placeholder="e.g. Gangtok, Pelling"
                    value={preferences.location}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
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
                        variant={
                          preferences.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
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
                      className="w-full text-left justify-start text-xs h-auto p-2 whitespace-normal break-words leading-snug"
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
            <Card className="flex flex-col h-[calc(100vh-10rem)] min-h-[420px]">
              <CardHeader className="shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Kora — AI Monastery Guide
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col min-h-0">
                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 min-h-0 space-y-4 overflow-y-auto mb-4 p-2"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isBot ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isBot
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div
                          className={`text-sm prose dark:prose-invert max-w-none ${
                            !message.isBot && "prose-white-text"
                          }`}
                        >
                          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {message.id === streamingId ? (
                          <span className="mt-1 inline-block h-4 w-[2px] animate-pulse bg-current align-middle" />
                        ) : (
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          Kora is thinking...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2 shrink-0">
                  <Textarea
                    placeholder="Ask me about monastery history, routes, festivals, or anything about visiting Sikkim's monasteries..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
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
