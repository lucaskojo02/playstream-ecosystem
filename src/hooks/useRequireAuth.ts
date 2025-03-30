
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to access this page",
      });
      navigate(redirectTo);
    }
  }, [isAuthenticated, loading, navigate, redirectTo, toast]);

  return { isAuthenticated, loading };
}
