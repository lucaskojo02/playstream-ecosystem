
import { useState } from "react";
import { Link } from "react-router-dom";
import { Video } from "@/services/videoService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  video: Video;
  horizontal?: boolean;
}

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  } else {
    return views.toString();
  }
};

const VideoCard = ({ video, horizontal = false }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const timeAgo = formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true });

  return horizontal ? (
    <div className="flex gap-4 w-full">
      <div 
        className="thumbnail-wrapper aspect-video rounded-md overflow-hidden flex-shrink-0"
        style={{ width: "180px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/watch?v=${video.id}`}>
          <div className="relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="video-duration">{video.duration}</div>
          </div>
        </Link>
      </div>
      <div className="flex flex-col">
        <Link to={`/watch?v=${video.id}`} className="group">
          <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>
        <Link to={`/channel/${video.channelId}`} className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {video.channelName}
          </span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full">
      <div 
        className="thumbnail-wrapper aspect-video rounded-md overflow-hidden mb-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/watch?v=${video.id}`}>
          <div className="relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="video-duration">{video.duration}</div>
          </div>
        </Link>
      </div>
      <div className="flex gap-3">
        <Link to={`/channel/${video.channelId}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={video.channelAvatar} />
            <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link to={`/watch?v=${video.id}`} className="group">
            <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${video.channelId}`} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {video.channelName}
            </span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
