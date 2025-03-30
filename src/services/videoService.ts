
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  uploadDate: Date;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  likes: number;
  dislikes: number;
  categories: string[];
  tags: string[];
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  videos: number;
  description: string;
  joinDate: Date;
}

// Mock video data
const mockVideos: Video[] = [
  {
    id: "1",
    title: "How to Build a YouTube Clone with React",
    description: "Learn how to build a YouTube clone using React, TailwindCSS, and more!",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "10:25",
    views: 158721,
    uploadDate: new Date(2023, 2, 15),
    channelId: "1",
    channelName: "Code Masters",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMasters",
    likes: 15234,
    dislikes: 234,
    categories: ["Programming", "Web Development"],
    tags: ["react", "tailwind", "typescript"]
  },
  {
    id: "2",
    title: "React State Management in 2023",
    description: "What's the best way to manage state in React applications in 2023?",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:42",
    views: 89432,
    uploadDate: new Date(2023, 1, 20),
    channelId: "1",
    channelName: "Code Masters",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMasters",
    likes: 9876,
    dislikes: 123,
    categories: ["Programming", "Web Development"],
    tags: ["react", "state management", "redux"]
  },
  {
    id: "3",
    title: "Building a Responsive Website with TailwindCSS",
    description: "Learn how to build a responsive website using TailwindCSS",
    thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "8:15",
    views: 245690,
    uploadDate: new Date(2023, 0, 5),
    channelId: "2",
    channelName: "Web Wizards",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebWizards",
    likes: 23456,
    dislikes: 345,
    categories: ["Programming", "Web Development"],
    tags: ["tailwind", "css", "responsive"]
  },
  {
    id: "4",
    title: "JavaScript Tips and Tricks",
    description: "Advanced JavaScript tips and tricks to improve your coding skills",
    thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:30",
    views: 378912,
    uploadDate: new Date(2022, 11, 12),
    channelId: "2",
    channelName: "Web Wizards",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebWizards",
    likes: 45678,
    dislikes: 678,
    categories: ["Programming", "JavaScript"],
    tags: ["javascript", "tips", "tricks"]
  },
  {
    id: "5",
    title: "How to Deploy Your App to AWS",
    description: "Step-by-step guide to deploying your application to AWS",
    thumbnailUrl: "https://images.unsplash.com/photo-1607743386760-88f10e06d8a1?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "20:18",
    views: 157845,
    uploadDate: new Date(2022, 10, 25),
    channelId: "3",
    channelName: "Cloud Computing",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudComputing",
    likes: 18765,
    dislikes: 234,
    categories: ["Cloud Computing", "AWS"],
    tags: ["aws", "deployment", "cloud"]
  },
  {
    id: "6",
    title: "Introduction to Machine Learning",
    description: "An introduction to machine learning concepts and applications",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "25:40",
    views: 289456,
    uploadDate: new Date(2022, 9, 10),
    channelId: "4",
    channelName: "Data Science Hub",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataScienceHub",
    likes: 32456,
    dislikes: 456,
    categories: ["Data Science", "Machine Learning"],
    tags: ["machine learning", "ai", "data science"]
  }
];

// Mock channels data
const mockChannels: Channel[] = [
  {
    id: "1",
    name: "Code Masters",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMasters",
    subscribers: 1450000,
    videos: 245,
    description: "We teach coding and programming concepts",
    joinDate: new Date(2018, 5, 15)
  },
  {
    id: "2",
    name: "Web Wizards",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebWizards",
    subscribers: 980000,
    videos: 189,
    description: "Your go-to channel for web development tips",
    joinDate: new Date(2017, 8, 20)
  },
  {
    id: "3",
    name: "Cloud Computing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudComputing",
    subscribers: 750000,
    videos: 156,
    description: "Learn all about cloud computing and deployment",
    joinDate: new Date(2019, 2, 10)
  },
  {
    id: "4",
    name: "Data Science Hub",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataScienceHub",
    subscribers: 1200000,
    videos: 210,
    description: "All things data science, machine learning, and AI",
    joinDate: new Date(2017, 1, 5)
  }
];

// Service functions
export const getVideos = (category?: string, search?: string): Promise<Video[]> => {
  let filteredVideos = [...mockVideos];
  
  if (category) {
    filteredVideos = filteredVideos.filter(video => 
      video.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredVideos = filteredVideos.filter(video => 
      video.title.toLowerCase().includes(searchLower) || 
      video.description.toLowerCase().includes(searchLower) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return Promise.resolve(filteredVideos);
};

export const getVideo = (id: string): Promise<Video | undefined> => {
  const video = mockVideos.find(video => video.id === id);
  return Promise.resolve(video);
};

export const getChannelVideos = (channelId: string): Promise<Video[]> => {
  const videos = mockVideos.filter(video => video.channelId === channelId);
  return Promise.resolve(videos);
};

export const getChannel = (id: string): Promise<Channel | undefined> => {
  const channel = mockChannels.find(channel => channel.id === id);
  return Promise.resolve(channel);
};

export const getRecommendedVideos = (videoId: string): Promise<Video[]> => {
  // For demo purposes, just return some videos excluding the current one
  const recommendedVideos = mockVideos.filter(video => video.id !== videoId);
  return Promise.resolve(recommendedVideos);
};

export const getTrendingVideos = (): Promise<Video[]> => {
  // For demo purposes, sort by views
  const trendingVideos = [...mockVideos].sort((a, b) => b.views - a.views);
  return Promise.resolve(trendingVideos);
};
