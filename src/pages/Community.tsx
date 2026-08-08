import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Camera,
  Send,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CommunityPost {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  images: any;
  location: string | null;
  tags: any;
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Community = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    location: "",
    tags: "",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: t("common.error", "Error"),
        description: t("community.errorLoadPosts", "Failed to load community posts"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: t("community.authRequired", "Authentication required"),
        description: t("community.authRequiredDesc", "Please sign in to create posts"),
        variant: "destructive",
      });
      return;
    }

    if (!newPost.content.trim()) {
      toast({
        title: t("community.contentRequired", "Content required"),
        description: t("community.contentRequiredDesc", "Please add some content to your post"),
        variant: "destructive",
      });
      return;
    }

    try {
      const tags = newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const { error } = await supabase.from("community_posts").insert([
        {
          user_id: user.id,
          title: newPost.title || null,
          content: newPost.content,
          location: newPost.location || null,
          tags: tags,
        },
      ]);

      if (error) throw error;

      toast({
        title: t("common.success", "Success"),
        description: t("community.postCreated", "Your post has been created!"),
      });

      setNewPost({ title: "", content: "", location: "", tags: "" });
      setIsCreateOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: t("common.error", "Error"),
        description: t("community.errorCreatePost", "Failed to create post"),
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm(t("community.deleteConfirm", "Are you sure you want to delete this post?"))) {
      return;
    }

    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: t("common.success", "Success"),
        description: t("community.postDeleted", "Post deleted successfully!"),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: t("common.error", "Error"),
        description: t("community.errorDeletePost", "Failed to delete post"),
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8 space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="mt-4 h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t("community.title", "Community Wall")}
            </h1>
            <p className="text-muted-foreground">
              {t("community.subtitle", "Share your travel experiences and discover hidden gems from fellow travelers")}
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("community.shareExperience", "Share Experience")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("community.shareYourExperience", "Share Your Travel Experience")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder={t("community.titlePlaceholder", "Add a title (optional)")}
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                />

                <Textarea
                  placeholder={t("community.contentPlaceholder", "Share your experience, tips, or recommendations...")}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={4}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("community.locationPlaceholder", "Location")}
                      value={newPost.location}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>

                  <Input
                    placeholder={t("community.tagsPlaceholder", "Tags (comma separated)")}
                    value={newPost.tags}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, tags: e.target.value }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {t("community.sharePost", "Share Post")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {post.profiles.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        {post.profiles.full_name || t("common.anonymous", "Anonymous")}
                      </h3>
                      {post.is_featured && (
                        <Badge variant="secondary">{t("common.featured", "Featured")}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.created_at)}
                    </p>
                    {post.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {post.location}
                        </span>
                      </div>
                    )}
                  </div>
                  {user?.id === post.user_id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      {t("common.delete", "Delete")}
                    </Button>
                  )}
                </div>

                {post.title && (
                  <CardTitle className="text-xl mt-3">{post.title}</CardTitle>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-foreground whitespace-pre-wrap">
                  {post.content}
                </p>

                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes_count}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments_count}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {t("common.share", "Share")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("community.noPostsTitle", "No posts yet")}
            </h3>
            <p className="text-muted-foreground mb-5">
              {t("community.noPostsDesc", "Be the first to share your travel experience!")}
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>{t("community.shareYourStory", "Share your story")}</Button>
          </div>
        )}
      </div>
    </div>
    </PageLayout>
  );
};

export default Community;
