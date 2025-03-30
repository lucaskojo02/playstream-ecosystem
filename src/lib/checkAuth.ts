
import { supabase } from "@/integrations/supabase/client";

export async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  return {
    isAuthenticated: !!data.session,
    user: data.session?.user || null,
    session: data.session,
  };
}
