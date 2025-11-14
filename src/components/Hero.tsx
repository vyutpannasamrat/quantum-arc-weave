import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/quantum-hero.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check onboarding status
        const { data: progress } = await supabase
          .from("onboarding_progress")
          .select("completed")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        setOnboardingCompleted(progress?.completed ?? null);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: progress } = await supabase
          .from("onboarding_progress")
          .select("completed")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        setOnboardingCompleted(progress?.completed ?? null);
      } else {
        setOnboardingCompleted(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCTAClick = () => {
    if (!user) {
      navigate("/auth");
    } else if (onboardingCompleted === false || onboardingCompleted === null) {
      navigate("/onboarding");
    } else {
      navigate("/profile");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Auth Navigation */}
      <div className="absolute top-6 right-6 z-20">
        {user ? (
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        )}
      </div>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Quantum mesh network visualization" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4 animate-float">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="text-gradient-quantum">ImpactView</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered community trust platform with augmented reality verification and transparent impact tracking
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="quantum" 
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={handleCTAClick}
            >
              {user ? (onboardingCompleted ? "View Profile" : "Continue Onboarding") : "Join the Network"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="mesh" 
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Technology
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gradient-quantum">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Action Analysis</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gradient-quantum">Real-time</div>
              <div className="text-sm text-muted-foreground">AR Camera View</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gradient-quantum">Verified</div>
              <div className="text-sm text-muted-foreground">Trust Network</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
