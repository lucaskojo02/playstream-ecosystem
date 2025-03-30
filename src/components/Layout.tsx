
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, Menu, Home, TrendingUp, 
  Film, BookOpen, History, Clock, 
  ThumbsUp, UserPlus, Upload, User, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: TrendingUp, label: "Trending", path: "/trending" },
    { icon: Film, label: "Subscriptions", path: "/subscriptions" },
    { icon: BookOpen, label: "Library", path: "/library" },
    { icon: History, label: "History", path: "/history" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-1">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PlayStream</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-xl mx-4">
          <div className="flex">
            <Input
              type="search"
              placeholder="Search videos..."
              className="rounded-r-none focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer w-full">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/upload" className="flex items-center gap-2 cursor-pointer w-full">
                    <Upload className="h-4 w-4" />
                    <span>Upload Video</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isMenuOpen ? "w-64" : "w-20"
          } bg-card border-r transition-all duration-300 overflow-y-auto hide-scrollbar`}
        >
          <nav className="p-2">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      location.pathname === item.path
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {isMenuOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            {isAuthenticated && isMenuOpen && (
              <>
                <Separator className="my-4" />
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-3">Subscriptions</h3>
                  <div className="space-y-3">
                    {/* Mock subscriptions */}
                    {[1, 2, 3].map((id) => (
                      <div key={id} className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} />
                          <AvatarFallback>C{id}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">Channel {id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
