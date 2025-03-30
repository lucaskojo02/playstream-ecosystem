
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user, isAuthenticated, navigate]);

  const handleProfileUpdate = () => {
    setLoading(true);
    
    try {
      updateProfile({
        username,
        bio,
        avatar,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>

      <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatar} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-muted-foreground">{email}</p>
            <p className="mt-2">{bio || "No bio added yet"}</p>
          </div>
          
          <Button 
            variant={isEditing ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Done</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        </div>
        
        {isEditing && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleProfileUpdate}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="videos">
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Your Videos</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-4">
          <div className="text-center py-12 bg-card rounded-lg">
            <h3 className="text-xl font-medium mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't uploaded any videos yet
            </p>
            <Button asChild>
              <a href="/upload">Upload a video</a>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="playlists" className="space-y-4">
          <div className="text-center py-12 bg-card rounded-lg">
            <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't created any playlists yet
            </p>
            <Button>
              Create a playlist
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button>
                Change Password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
