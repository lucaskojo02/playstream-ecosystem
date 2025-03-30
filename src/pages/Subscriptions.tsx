
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideos, Video } from "@/services/videoService";
import { useAuth } from "@/contexts/AuthContext";
import VideoCard from "@/components/VideoCard";
import { Film, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Subscriptions = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch videos from subscribed channels
        // For now, we'll just fetch some videos
        const fetchedVideos = await getVideos();
        // Simulate subscription videos (first 4 videos in this demo)
        setVideos(fetchedVideos.slice(0, 4));
      } catch (error) {
        console.error("Error fetching subscription videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscriptionVideos();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Film className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">Keep up with your favorite channels</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Sign in to see updates from your favorite PlayStream channels
        </p>
        <Button onClick={() => navigate("/login")}>Sign in</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Subscriptions</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-secondary rounded-md aspect-video mb-3"></div>
              <div className="flex gap-3">
                <div className="bg-secondary rounded-full h-9 w-9"></div>
                <div className="flex-1">
                  <div className="bg-secondary h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-secondary h-3 rounded mb-2 w-1/2"></div>
                  <div className="bg-secondary h-3 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No subscription videos</h2>
          <p className="text-muted-foreground mb-6">
            You haven't subscribed to any channels yet.
          </p>
          <Button asChild variant="outline">
            <a href="/">Discover channels</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
