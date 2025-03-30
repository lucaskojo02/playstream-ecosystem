
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getVideo, getRecommendedVideos, Video } from "@/services/videoService";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share, Flag, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import VideoCard from "@/components/VideoCard";

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return count.toString();
  }
};

const Watch = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const { isAuthenticated } = useAuth();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) return;
      
      setLoading(true);
      try {
        const videoData = await getVideo(videoId);
        if (videoData) {
          setVideo(videoData);
          const recommended = await getRecommendedVideos(videoId);
          setRecommendedVideos(recommended);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideoData();
    
    // Reset states when video changes
    setLiked(false);
    setDisliked(false);
    setSubscribed(false);
    setCommentText("");
    
    // Scroll to top when video changes
    window.scrollTo(0, 0);
  }, [videoId]);
  
  const handleSubscribe = () => {
    if (!isAuthenticated) {
      alert("Please log in to subscribe to this channel");
      return;
    }
    setSubscribed(!subscribed);
  };
  
  const handleLike = () => {
    if (!isAuthenticated) {
      alert("Please log in to like videos");
      return;
    }
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };
  
  const handleDislike = () => {
    if (!isAuthenticated) {
      alert("Please log in to dislike videos");
      return;
    }
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to comment");
      return;
    }
    if (commentText.trim()) {
      // In a real app, you would send this to an API
      console.log("Comment submitted:", commentText);
      setCommentText("");
      alert("Comment submitted successfully!");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-video bg-secondary mb-4 rounded-md"></div>
        <div className="bg-secondary h-8 w-3/4 mb-2 rounded"></div>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-secondary rounded-full h-12 w-12"></div>
          <div className="bg-secondary h-4 w-40 rounded"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <p className="text-muted-foreground mb-6">The video you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        {/* Video Player */}
        <div className="video-container mb-4">
          <iframe
            src={video.videoUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info */}
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatCount(video.views)} views</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={liked ? "default" : "secondary"}
              size="sm"
              className="gap-1"
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{formatCount(liked ? video.likes + 1 : video.likes)}</span>
            </Button>
            <Button
              variant={disliked ? "default" : "secondary"}
              size="sm"
              className="gap-1"
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{formatCount(disliked ? video.dislikes + 1 : video.dislikes)}</span>
            </Button>
            <Button variant="secondary" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="secondary" size="sm" className="gap-1">
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </Button>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between gap-4 py-4 border-t border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={video.channelAvatar} />
              <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/channel/${video.channelId}`} className="font-medium hover:text-primary transition-colors">
                {video.channelName}
              </Link>
              <p className="text-sm text-muted-foreground">1.2M subscribers</p>
            </div>
          </div>
          <Button
            variant={subscribed ? "secondary" : "default"}
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>

        {/* Video Description */}
        <div className="mt-4 mb-6 bg-card p-4 rounded-lg">
          <p className="text-sm whitespace-pre-line">{video.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {video.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/?search=${tag}`}
                className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <Tabs defaultValue="comments" className="mt-6">
          <TabsList>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="mt-4">
            {isAuthenticated && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-2 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm min-h-[80px]"
                      required
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button type="button" variant="ghost" onClick={() => setCommentText("")}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!commentText.trim()}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-6">
              {/* Sample comments */}
              {[1, 2, 3].map((id) => (
                <div key={id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${id}`} />
                    <AvatarFallback>U{id}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">User {id}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(Date.now() - id * 86400000), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {id === 1 
                        ? "Great video! Really enjoyed the content and learned a lot."
                        : id === 2
                        ? "Thanks for sharing this information, it was very helpful!"
                        : "When will you post a follow-up video? Can't wait to see more content like this."}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommendations */}
      <div className="lg:w-1/3 space-y-4">
        <h3 className="text-lg font-medium mb-4">Recommended videos</h3>
        {recommendedVideos.slice(0, 6).map((video) => (
          <VideoCard key={video.id} video={video} horizontal />
        ))}
      </div>
    </div>
  );
};

export default Watch;
