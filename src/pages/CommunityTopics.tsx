import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Topic {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  status: string;
  vote_count_up: number;
  vote_count_down: number;
  user_vote?: { vote_type: string } | null;
}

export default function CommunityTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchTopics();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchTopics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('community_topics')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (topicsError) throw topicsError;

      // Fetch user's votes
      let userVotes: Record<string, { vote_type: string }> = {};
      if (user) {
        const { data: votesData, error: votesError } = await supabase
          .from('topic_votes')
          .select('topic_id, vote_type')
          .eq('user_id', user.id);

        if (!votesError && votesData) {
          userVotes = votesData.reduce((acc, vote) => {
            acc[vote.topic_id] = { vote_type: vote.vote_type };
            return acc;
          }, {} as Record<string, { vote_type: string }>);
        }
      }

      // Merge topics with user votes
      const topicsWithVotes = topicsData?.map(topic => ({
        ...topic,
        user_vote: userVotes[topic.id] || null
      })) || [];

      setTopics(topicsWithVotes);
    } catch (error: any) {
      toast({
        title: "Error loading topics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and description",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('community_topics')
        .insert({
          title: newTitle,
          description: newDescription,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Topic created!",
        description: "Your topic has been published to the community",
      });

      setNewTitle("");
      setNewDescription("");
      setDialogOpen(false);
      fetchTopics();
    } catch (error: any) {
      toast({
        title: "Error creating topic",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleVote = async (topicId: string, voteType: 'up' | 'down') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const currentVote = topics.find(t => t.id === topicId)?.user_vote;

      if (currentVote) {
        if (currentVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from('topic_votes')
            .delete()
            .eq('topic_id', topicId)
            .eq('user_id', user.id);
        } else {
          // Update vote
          await supabase
            .from('topic_votes')
            .update({ vote_type: voteType })
            .eq('topic_id', topicId)
            .eq('user_id', user.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('topic_votes')
          .insert({
            topic_id: topicId,
            user_id: user.id,
            vote_type: voteType
          });
      }

      fetchTopics();
    } catch (error: any) {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Topics</h1>
            <p className="text-muted-foreground">
              Vote on community initiatives and shape our collective future
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>
                  Propose a new topic for community discussion and voting
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Input
                    placeholder="Topic title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your proposal..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleCreateTopic}
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Topic"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {topics.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No active topics yet</p>
              <p className="text-sm text-muted-foreground">Be the first to create a community topic!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(topic.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {topic.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={topic.user_vote?.vote_type === 'up' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(topic.id, 'up')}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {topic.vote_count_up}
                    </Button>
                    <Button
                      variant={topic.user_vote?.vote_type === 'down' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleVote(topic.id, 'down')}
                      className="gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {topic.vote_count_down}
                    </Button>
                    <span className="text-sm text-muted-foreground ml-auto">
                      Net Score: {topic.vote_count_up - topic.vote_count_down}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
