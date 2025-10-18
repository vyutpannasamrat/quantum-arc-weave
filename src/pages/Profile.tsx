import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Shield, User as UserIcon, LogOut, ArrowLeft, TrendingUp } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
});

interface Profile {
  full_name: string | null;
  trust_score: number;
  impact_tokens: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [recentActions, setRecentActions] = useState<any[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }

        setEmail(session.user.email || "");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFullName(data.full_name || "");

        // Fetch recent actions
        const { data: actionsData } = await supabase
          .from("actions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        setRecentActions(actionsData || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const validated = profileSchema.parse({ fullName });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: validated.fullName })
        .eq("id", session.user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, full_name: validated.fullName } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gradient-quantum">
                {profile?.trust_score || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Out of 100 • Verified by community
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Impact Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gradient-quantum">
                {profile?.impact_tokens || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Earned through positive actions
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {recentActions.length > 0 && (
          <Card className="mt-6 border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Actions
                </CardTitle>
                <Button variant="link" onClick={() => navigate("/actions")}>
                  View All →
                </Button>
              </div>
              <CardDescription>
                Your latest contributions with AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="p-4 border rounded-lg space-y-2">
                  <p className="font-medium">{action.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(action.created_at).toLocaleDateString()}</span>
                    {action.location_name && (
                      <>
                        <span>•</span>
                        <span>{action.location_name}</span>
                      </>
                    )}
                  </div>
                  {action.quality_score !== null && (
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Quality</p>
                        <p className="font-semibold">{(action.quality_score * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sentiment</p>
                        <p className="font-semibold">{(action.sentiment_score * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tokens</p>
                        <p className="font-semibold text-green-600">+{action.tokens_earned}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
