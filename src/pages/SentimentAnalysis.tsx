import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, TrendingUp, TrendingDown, Minus, BarChart3, Heart, MessageSquare, Loader2 } from "lucide-react";

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

interface AnalysisItem {
  type: 'review' | 'community_post';
  id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  content: string;
  rating?: number;
}

interface Statistics {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  averageConfidence: number;
}

const SentimentAnalysis = () => {
  const [inputText, setInputText] = useState("");
  const [singleResult, setSingleResult] = useState<SentimentResult | null>(null);
  const [batchResults, setBatchResults] = useState<AnalysisItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const { toast } = useToast();

  const analyzeSingleText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
        body: { text: inputText }
      });

      if (error) throw error;

      if (data.success) {
        setSingleResult(data.result);
        toast({
          title: "Analysis Complete",
          description: "Sentiment analysis has been generated successfully",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runBatchAnalysis = async () => {
    setBatchLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
        body: { batchAnalysis: true }
      });

      if (error) throw error;

      if (data.success) {
        setBatchResults(data.results);
        setStatistics(data.statistics);
        toast({
          title: "Batch Analysis Complete",
          description: `Analyzed ${data.statistics.total} items successfully`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error in batch analysis:', error);
      toast({
        title: "Error",
        description: "Failed to run batch analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBatchLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Sentiment Analysis</h1>
            <p className="text-muted-foreground">Analyze feedback sentiment using advanced AI</p>
          </div>
        </div>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Text Analysis</TabsTrigger>
            <TabsTrigger value="batch">Batch Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyze Text Sentiment</CardTitle>
                <CardDescription>
                  Enter any text to analyze its emotional sentiment and tone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text to analyze sentiment..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={analyzeSingleText}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Sentiment
                    </>
                  )}
                </Button>

                {singleResult && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getSentimentIcon(singleResult.sentiment)}
                        Sentiment Analysis Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Sentiment</label>
                          <Badge 
                            variant={getSentimentBadgeVariant(singleResult.sentiment)}
                            className="ml-2"
                          >
                            {singleResult.sentiment.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Confidence</label>
                          <div className="mt-1">
                            <Progress 
                              value={singleResult.confidence * 100} 
                              className="h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(singleResult.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Batch Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Analyze sentiment across all reviews and community posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runBatchAnalysis}
                  disabled={batchLoading}
                  className="w-full"
                >
                  {batchLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Analysis...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Run Batch Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.total}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-600">Positive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{statistics.positive}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((statistics.positive / statistics.total) * 100)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-600">Negative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{statistics.negative}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((statistics.negative / statistics.total) * 100)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-600">Neutral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{statistics.neutral}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((statistics.neutral / statistics.total) * 100)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Positive</span>
                        <span>{Math.round((statistics.positive / statistics.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(statistics.positive / statistics.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Negative</span>
                        <span>{Math.round((statistics.negative / statistics.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(statistics.negative / statistics.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>{Math.round((statistics.neutral / statistics.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(statistics.neutral / statistics.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}

            {batchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Detailed sentiment analysis for each item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {batchResults.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.type === 'review' ? (
                              <MessageSquare className="h-4 w-4" />
                            ) : (
                              <Heart className="h-4 w-4" />
                            )}
                            <Badge variant="outline">
                              {item.type === 'review' ? 'Review' : 'Community Post'}
                            </Badge>
                            {item.rating && (
                              <Badge variant="secondary">
                                ⭐ {item.rating}/5
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(item.sentiment)}
                            <Badge variant={getSentimentBadgeVariant(item.sentiment)}>
                              {item.sentiment}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(item.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {item.content}
                        </p>
                        
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SentimentAnalysis;