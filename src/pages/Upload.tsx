
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, Film, Image, X, Tag, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const Upload = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("video")) {
        setVideoFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title for your video",
      });
      return;
    }
    
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a video file to upload",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is now processing",
      });
      setUploading(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UploadIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Upload Video</h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This is a demo upload feature. Videos are not actually uploaded or stored.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? "border-primary bg-primary/5" : "border-muted"
              } transition-colors`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Film className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Select video to upload</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop video file or click to select
              </p>
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                Select File
              </Button>
              {videoFile && (
                <div className="mt-4 bg-muted p-3 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Film className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{videoFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setVideoFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Label className="mb-2 block">Thumbnail</Label>
              {thumbnailPreview ? (
                <div className="relative rounded-md overflow-hidden aspect-video mb-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="bg-muted border rounded-md p-6 text-center mb-4">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload a thumbnail image
                  </p>
                </div>
              )}
              <Input
                type="file"
                id="thumbnail-upload"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("thumbnail-upload")?.click()}
                className="w-full"
              >
                Upload Thumbnail
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your video"
                maxLength={100}
                required
              />
              <div className="text-xs text-muted-foreground text-right">
                {title.length}/100
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="film-animation">Film & Animation</SelectItem>
                  <SelectItem value="autos-vehicles">Autos & Vehicles</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="pets-animals">Pets & Animals</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="travel-events">Travel & Events</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="people-blogs">People & Blogs</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="news-politics">News & Politics</SelectItem>
                  <SelectItem value="howto-style">Howto & Style</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="science-technology">Science & Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags (separated by commas)"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tags help viewers find your video
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
