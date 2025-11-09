import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Award, Star, TrendingUp, MapPin, Calendar, CheckCircle2, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string | null;
  trust_score: number;
  impact_tokens: number;
  created_at: string;
}

interface Action {
  id: string;
  description: string;
  location_name: string | null;
  tokens_earned: number | null;
  status: string;
  created_at: string;
  quality_score: number | null;
  sentiment_score: number | null;
  relevance_score: number | null;
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [verificationCount, setVerificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    }
  }, [id]);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch actions
    const { data: actionsData } = await supabase
      .from("actions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (actionsData) {
      setActions(actionsData);
    }

    // Count verifications given by this user
    const { count } = await supabase
      .from("action_verifications")
      .select("*", { count: "exact", head: true })
      .eq("verified_by", userId);

    setVerificationCount(count || 0);
    setLoading(false);
  };

  const calculateBadges = (): UserBadge[] => {
    if (!profile || !actions) return [];

    const actionCount = actions.length;
    const verifiedActions = actions.filter(a => a.status === "verified").length;
    const totalTokens = profile.impact_tokens;
    const trustScore = profile.trust_score;

    return [
      {
        id: "first-action",
        name: "First Steps",
        description: "Submitted your first action",
        icon: <Star className="h-5 w-5" />,
        color: "text-blue-500",
        earned: actionCount >= 1
      },
      {
        id: "10-actions",
        name: "Active Contributor",
        description: "Submitted 10 actions",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "text-green-500",
        earned: actionCount >= 10
      },
      {
        id: "verified-contributor",
        name: "Verified Contributor",
        description: "5 verified actions",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "text-emerald-500",
        earned: verifiedActions >= 5
      },
      {
        id: "100-tokens",
        name: "Token Collector",
        description: "Earned 100 impact tokens",
        icon: <Trophy className="h-5 w-5" />,
        color: "text-yellow-500",
        earned: totalTokens >= 100
      },
      {
        id: "trusted-member",
        name: "Trusted Member",
        description: "Trust score above 70",
        icon: <Award className="h-5 w-5" />,
        color: "text-purple-500",
        earned: trustScore >= 70
      },
      {
        id: "community-validator",
        name: "Community Validator",
        description: "Verified 10 other actions",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "text-cyan-500",
        earned: verificationCount >= 10
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">Profile not found</div>
        </div>
      </div>
    );
  }

  const badges = calculateBadges();
  const earnedBadges = badges.filter(b => b.earned);
  const verifiedActions = actions.filter(a => a.status === "verified");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl">
                    {profile.full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.full_name || "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    Member since {format(new Date(profile.created_at), "MMMM yyyy")}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Trust Score</p>
                      <p className="text-2xl font-bold text-primary">{profile.trust_score}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Impact Tokens</p>
                      <p className="text-2xl font-bold text-primary">{profile.impact_tokens}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Actions Submitted</p>
                      <p className="text-2xl font-bold">{actions.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Verified Actions</p>
                      <p className="text-2xl font-bold">{verifiedActions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Badges Earned ({earnedBadges.length}/{badges.length})
              </CardTitle>
              <CardDescription>
                Achievements unlocked through community contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border ${
                      badge.earned
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-muted opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={badge.earned ? badge.color : "text-muted-foreground"}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Actions Timeline */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Actions
              </CardTitle>
              <CardDescription>
                Latest contributions and community impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No actions submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <div key={action.id}>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            action.status === "verified"
                              ? "bg-green-500/20 text-green-500"
                              : action.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                          }`}>
                            {action.status === "verified" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Calendar className="h-5 w-5" />
                            )}
                          </div>
                          {index < actions.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <p className="font-medium">{action.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                {action.location_name && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {action.location_name}
                                  </span>
                                )}
                                <span>
                                  {format(new Date(action.created_at), "MMM d, yyyy")}
                                </span>
                              </div>
                            </div>
                            <Badge variant={action.status === "verified" ? "default" : "outline"}>
                              {action.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            {action.tokens_earned !== null && (
                              <span className="flex items-center gap-1 text-primary font-semibold">
                                <TrendingUp className="h-4 w-4" />
                                +{action.tokens_earned} tokens
                              </span>
                            )}
                            {action.quality_score !== null && (
                              <span className="text-muted-foreground">
                                Quality: {Math.round(action.quality_score * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < actions.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contribution Statistics */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Contribution Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown of community participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Action Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Actions</span>
                      <Badge variant="outline">{actions.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Verified</span>
                      <Badge className="bg-green-500">{verifiedActions.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pending</span>
                      <Badge variant="secondary">
                        {actions.filter(a => a.status === "pending").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Tokens/Action</span>
                      <Badge variant="outline">
                        {verifiedActions.length > 0
                          ? Math.round(profile.impact_tokens / verifiedActions.length)
                          : 0}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Community Engagement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Verifications Given</span>
                      <Badge variant="outline">{verificationCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trust Score</span>
                      <Badge className={profile.trust_score >= 70 ? "bg-green-500" : "bg-yellow-500"}>
                        {profile.trust_score}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Badges Earned</span>
                      <Badge variant="outline">{earnedBadges.length}/{badges.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Member Since</span>
                      <Badge variant="outline">
                        {format(new Date(profile.created_at), "MMM yyyy")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
