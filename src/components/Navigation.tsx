import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogIn, Plus, BarChart3, Users, Trophy } from "lucide-react";

const Navigation = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-gradient-quantum">ImpactView</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button asChild variant="quantum">
                  <Link to="/ar-view">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    AR View
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/submit-action">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Action
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/actions">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/community">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/leaderboard">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
