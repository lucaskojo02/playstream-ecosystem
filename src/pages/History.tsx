
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideos, Video } from "@/services/videoService";
import { useAuth } from "@/contexts/AuthContext";
import VideoCard from "@/components/VideoCard";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const History = () => {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryVideos = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch videos from watch history
        // For now, we'll just fetch some videos
        const fetchedVideos = await getVideos();
        // Use last 5 videos as mock history
        setVideos(fetchedVideos.slice(-5).reverse());
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchHistoryVideos();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <HistoryIcon className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">Keep track of what you watch</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Watch history isn't viewable when you're signed out.
        </p>
        <Button onClick={() => navigate("/login")}>Sign in</Button>
      </div>
    );
  }

  const clearHistory = () => {
    setVideos([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Watch History</h1>
        </div>
        {videos.length > 0 && (
          <Button variant="outline" onClick={clearHistory} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Clear history</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse flex gap-4">
              <div className="bg-secondary rounded-md aspect-video w-64"></div>
              <div className="flex-1">
                <div className="bg-secondary h-6 rounded mb-3 w-3/4"></div>
                <div className="bg-secondary h-4 rounded mb-2 w-1/2"></div>
                <div className="bg-secondary h-4 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} horizontal />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No watch history</h2>
          <p className="text-muted-foreground mb-6">
            Videos that you watch will appear here.
          </p>
          <Button asChild variant="outline">
            <a href="/">Explore videos</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default History;
