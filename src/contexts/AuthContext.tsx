
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  session: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(profileData => {
          setProfile(profileData);
        });
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

      console.log("Attempting login for:", email);
      
      // Use Promise.race to add a timeout
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Login request timed out. Please try again.")), 15000);
      });
      
      const result = await Promise.race([loginPromise, timeoutPromise]) as { data: any, error: any };
      
      if (result.error) {
        console.error("Login error:", result.error);
        throw result.error;
      }

      console.log("Login successful for:", email);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

      console.log("Starting registration for:", email);

      // Use Promise.race to add a timeout
      const registerPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Registration request timed out. Please try again.")), 10000);
      });
      
      const { data: authData, error: authError } = await Promise.race([registerPromise, timeoutPromise]) as { 
        data: any, 
        error: any 
      };

      if (authError) {
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        console.error("No user returned from signup");
        throw new Error("User creation failed");
      }

      console.log("Auth signup successful, creating profile for:", authData.user.id);

      // Then create their profile in the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          username,
          email,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });

      if (profileError) {
        console.error("Profile creation failed:", profileError);
        // If profile creation fails, we should try to delete the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      console.log("Registration complete for:", email);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>): Promise<void> => {
    if (!user || !profile) {
      throw new Error("User not authenticated");
    }

    try {
      const updates = {
        ...data,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProfile({ ...profile, ...data });
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
