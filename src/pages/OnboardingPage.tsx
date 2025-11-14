import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Onboarding from "@/components/Onboarding";
import { toast } from "sonner";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error("Please sign in to continue");
          navigate("/auth");
          return;
        }

        setUserId(session.user.id);

        // Check if user has already completed onboarding
        const { data: progress } = await supabase
          .from("onboarding_progress")
          .select("completed")
          .eq("user_id", session.user.id)
          .single();

        if (progress?.completed) {
          navigate("/profile");
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleComplete = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return <Onboarding userId={userId} onComplete={handleComplete} />;
};

export default OnboardingPage;
