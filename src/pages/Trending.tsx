
import { useEffect, useState } from "react";
import { getTrendingVideos, Video } from "@/services/videoService";
import VideoCard from "@/components/VideoCard";
import { TrendingUp } from "lucide-react";

const Trending = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      setLoading(true);
      try {
        const trendingVideos = await getTrendingVideos();
        setVideos(trendingVideos);
      } catch (error) {
        console.error("Error fetching trending videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Trending Videos</h1>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
          {videos.map((video, index) => (
            <div key={video.id} className="flex gap-4 items-center">
              <div className="font-bold text-3xl text-muted-foreground w-10 text-center">
                #{index + 1}
              </div>
              <div className="flex-1">
                <VideoCard video={video} horizontal />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No trending videos available</h2>
          <p className="text-muted-foreground">
            Check back later for trending content.
          </p>
        </div>
      )}
    </div>
  );
};

export default Trending;
