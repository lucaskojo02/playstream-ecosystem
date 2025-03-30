
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getVideos, Video } from "@/services/videoService";
import { useAuth } from "@/contexts/AuthContext";
import VideoCard from "@/components/VideoCard";
import { BookOpen, History as HistoryIcon, ThumbsUp, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Library = () => {
  const { isAuthenticated } = useAuth();
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibraryVideos = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would fetch various playlists and lists
        // For now, we'll just fetch some videos
        const fetchedVideos = await getVideos();
        // Mock recent history (last 2 videos)
        setRecentVideos(fetchedVideos.slice(-2).reverse());
        // Mock liked videos (first 2 videos)
        setLikedVideos(fetchedVideos.slice(0, 2));
      } catch (error) {
        console.error("Error fetching library videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLibraryVideos();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">Enjoy your favorite videos</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Sign in to access videos that you've liked or saved
        </p>
        <Button onClick={() => navigate("/login")}>Sign in</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Library</h1>
      </div>

      {loading ? (
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div className="bg-secondary h-6 w-40 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, videoIndex) => (
                  <div key={videoIndex} className="animate-pulse flex gap-4">
                    <div className="bg-secondary rounded-md aspect-video w-40"></div>
                    <div className="flex-1">
                      <div className="bg-secondary h-4 rounded mb-2 w-3/4"></div>
                      <div className="bg-secondary h-3 rounded mb-2 w-1/2"></div>
                      <div className="bg-secondary h-3 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* History Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                <h2 className="text-lg font-semibold">History</h2>
              </div>
              <Button variant="link" asChild className="h-auto p-0">
                <Link to="/history" className="text-sm font-medium">See all</Link>
              </Button>
            </div>
            {recentVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentVideos.map((video) => (
                  <VideoCard key={video.id} video={video} horizontal />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No watch history</p>
            )}
          </div>
          
          <Separator />
          
          {/* Liked Videos Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Liked videos</h2>
              </div>
              <Button variant="link" asChild className="h-auto p-0">
                <Link to="/playlist?list=LL" className="text-sm font-medium">See all</Link>
              </Button>
            </div>
            {likedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} horizontal />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No liked videos</p>
            )}
          </div>
          
          <Separator />
          
          {/* Playlists Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Playlists</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-secondary transition-colors">
                <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Create new playlist</p>
                <p className="text-xs text-muted-foreground">Save videos for later</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
