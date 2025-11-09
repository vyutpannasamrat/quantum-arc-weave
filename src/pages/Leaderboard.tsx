import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

interface LeaderboardEntry {
  id: string;
  full_name: string | null;
  trust_score: number;
  impact_tokens: number;
  recent_tokens?: number;
}

const Leaderboard = () => {
  const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardEntry[]>([]);
  const [monthlyLeaders, setMonthlyLeaders] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    setLoading(true);

    // All-time leaderboard - top by trust score and tokens
    const { data: allTime } = await supabase
      .from("profiles")
      .select("id, full_name, trust_score, impact_tokens")
      .order("impact_tokens", { ascending: false })
      .limit(10);

    if (allTime) setAllTimeLeaders(allTime);

    // Monthly leaderboard - users with actions in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: monthlyActions } = await supabase
      .from("actions")
      .select("user_id, tokens_earned")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .eq("status", "verified");

    if (monthlyActions) {
      const monthlyTokens = monthlyActions.reduce((acc, action) => {
        acc[action.user_id] = (acc[action.user_id] || 0) + (action.tokens_earned || 0);
        return acc;
      }, {} as Record<string, number>);

      const userIds = Object.keys(monthlyTokens);
      const { data: monthlyProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, trust_score, impact_tokens")
        .in("id", userIds);

      if (monthlyProfiles) {
        const monthlyData = monthlyProfiles
          .map(profile => ({
            ...profile,
            recent_tokens: monthlyTokens[profile.id]
          }))
          .sort((a, b) => (b.recent_tokens || 0) - (a.recent_tokens || 0))
          .slice(0, 10);
        setMonthlyLeaders(monthlyData);
      }
    }

    // Weekly leaderboard - users with actions in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: weeklyActions } = await supabase
      .from("actions")
      .select("user_id, tokens_earned")
      .gte("created_at", sevenDaysAgo.toISOString())
      .eq("status", "verified");

    if (weeklyActions) {
      const weeklyTokens = weeklyActions.reduce((acc, action) => {
        acc[action.user_id] = (acc[action.user_id] || 0) + (action.tokens_earned || 0);
        return acc;
      }, {} as Record<string, number>);

      const userIds = Object.keys(weeklyTokens);
      const { data: weeklyProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, trust_score, impact_tokens")
        .in("id", userIds);

      if (weeklyProfiles) {
        const weeklyData = weeklyProfiles
          .map(profile => ({
            ...profile,
            recent_tokens: weeklyTokens[profile.id]
          }))
          .sort((a, b) => (b.recent_tokens || 0) - (a.recent_tokens || 0))
          .slice(0, 10);
        setWeeklyLeaders(weeklyData);
      }
    }

    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{index + 1}</span>;
    }
  };

  const renderLeaderboardTable = (leaders: LeaderboardEntry[], showRecentTokens = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Contributor</TableHead>
          <TableHead className="text-right">Trust Score</TableHead>
          <TableHead className="text-right">
            {showRecentTokens ? "Tokens Earned" : "Total Tokens"}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No data available for this period
            </TableCell>
          </TableRow>
        ) : (
          leaders.map((leader, index) => (
            <TableRow key={leader.id}>
              <TableCell className="font-medium">
                {getRankIcon(index)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {leader.full_name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {leader.full_name || "Anonymous"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">{leader.trust_score}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold">
                    {showRecentTokens ? leader.recent_tokens : leader.impact_tokens}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient-quantum">
              Community Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Top contributors making the biggest impact in our community
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>
                Rankings based on verified actions and community trust
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all-time" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all-time">All Time</TabsTrigger>
                  <TabsTrigger value="monthly">This Month</TabsTrigger>
                  <TabsTrigger value="weekly">This Week</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all-time" className="mt-6">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading leaderboard...
                    </div>
                  ) : (
                    renderLeaderboardTable(allTimeLeaders, false)
                  )}
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-6">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading leaderboard...
                    </div>
                  ) : (
                    renderLeaderboardTable(monthlyLeaders, true)
                  )}
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-6">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading leaderboard...
                    </div>
                  ) : (
                    renderLeaderboardTable(weeklyLeaders, true)
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
