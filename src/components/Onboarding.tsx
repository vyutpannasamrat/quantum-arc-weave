import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  MapPin, 
  Award, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  route?: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to ImpactView",
    description: "A decentralized platform for verified community actions. Let's take a quick tour of the key features.",
    icon: Award,
    action: "Get Started"
  },
  {
    title: "Submit Your Actions",
    description: "Share your positive community contributions with location, description, and photo. AI analyzes your impact and awards tokens.",
    icon: MapPin,
    action: "Learn More",
    route: "/submit-action"
  },
  {
    title: "Explore AR View",
    description: "Use augmented reality to see nearby verified actions overlaid on the real world through your camera.",
    icon: Camera,
    action: "Try AR View",
    route: "/ar-view"
  },
  {
    title: "Track Your Impact",
    description: "View your trust score, earned impact tokens, achievement badges, and contribution history on your profile.",
    icon: TrendingUp,
    action: "View Profile",
    route: "/profile"
  },
  {
    title: "Join the Community",
    description: "See top contributors on the leaderboard, participate in community topics, and help verify others' actions.",
    icon: Users,
    action: "View Leaderboard",
    route: "/leaderboard"
  }
];

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

const Onboarding = ({ userId, onComplete }: OnboardingProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  useEffect(() => {
    // Save progress to database
    const saveProgress = async () => {
      await supabase
        .from("onboarding_progress")
        .upsert({
          user_id: userId,
          current_step: currentStep,
          completed: false
        });
    };
    saveProgress();
  }, [currentStep, userId]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    try {
      await supabase
        .from("onboarding_progress")
        .upsert({
          user_id: userId,
          completed: true,
          current_step: steps.length,
          completed_at: new Date().toISOString()
        });
      
      toast.success("Onboarding skipped. You can revisit tutorials anytime!");
      onComplete();
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      toast.error("Failed to skip onboarding");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await supabase
        .from("onboarding_progress")
        .upsert({
          user_id: userId,
          completed: true,
          current_step: steps.length,
          completed_at: new Date().toISOString()
        });
      
      toast.success("Onboarding complete! Welcome to ImpactView 🎉");
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleActionClick = () => {
    if (step.route) {
      navigate(step.route);
    } else {
      handleNext();
    }
  };

  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Skip button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSkip}
        disabled={isCompleting}
        className="absolute top-6 right-6 z-20"
      >
        <X className="h-4 w-4 mr-2" />
        Skip Tutorial
      </Button>

      <Card className="w-full max-w-2xl relative z-10 border-border/50 bg-card/80 backdrop-blur-sm animate-scale-in">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-float">
              <StepIcon className="h-10 w-10 text-primary" />
            </div>
            
            <CardTitle className="text-3xl">{step.title}</CardTitle>
            <CardDescription className="text-lg leading-relaxed max-w-lg">
              {step.description}
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button
              variant="quantum"
              onClick={handleActionClick}
              disabled={isCompleting}
              className="flex-1"
            >
              {isCompleting ? (
                "Completing..."
              ) : currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Tutorial
                </>
              ) : (
                <>
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Feature highlights */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/50">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-gradient-quantum">AI-Powered</div>
                <div className="text-xs text-muted-foreground">Action Analysis</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-gradient-quantum">AR View</div>
                <div className="text-xs text-muted-foreground">Reality Overlay</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-gradient-quantum">Verified</div>
                <div className="text-xs text-muted-foreground">Trust Network</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-gradient-quantum">Tokens</div>
                <div className="text-xs text-muted-foreground">Impact Rewards</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
