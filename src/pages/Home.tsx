
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos, Video } from "@/services/videoService";
import VideoCard from "@/components/VideoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", "Programming", "Web Development", "Data Science", "Cloud Computing", "JavaScript"];

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const category = selectedCategory === "All" ? undefined : selectedCategory;
        const fetchedVideos = await getVideos(category, searchQuery || undefined);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {searchQuery ? (
        <h1 className="text-2xl font-bold mb-6">
          Search results for: <span className="text-primary">{searchQuery}</span>
        </h1>
      ) : (
        <Tabs defaultValue="All" onValueChange={handleCategoryChange} className="mb-6">
          <TabsList className="flex space-x-2 overflow-x-auto p-0 mb-4 hide-scrollbar">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

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
          <h2 className="text-xl font-medium mb-2">No videos found</h2>
          {searchQuery ? (
            <p className="text-muted-foreground">
              We couldn't find any videos matching "{searchQuery}". Try a different search term.
            </p>
          ) : (
            <p className="text-muted-foreground">
              No videos found in this category. Try another category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
