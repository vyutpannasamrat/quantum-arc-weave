import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, Clock, XCircle, ThumbsUp, ThumbsDown, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Verification {
  id: string;
  verified_by: string;
  verification_type: string;
  comment: string | null;
  created_at: string;
}

interface Action {
  id: string;
  description: string;
  location_name: string | null;
  image_url: string | null;
  sentiment_score: number | null;
  relevance_score: number | null;
  quality_score: number | null;
  ai_feedback: string | null;
  tokens_earned: number | null;
  status: string;
  created_at: string;
  user_id: string;
  verifications?: Verification[];
  user_verification?: Verification | null;
}

export default function ActionsDashboard() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingAction, setVerifyingAction] = useState<string | null>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch all actions (not just user's own)
      const { data: actionsData, error: actionsError } = await supabase
        .from('actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (actionsError) throw actionsError;

      // Fetch verifications for all actions
      const { data: verificationsData } = await supabase
        .from('action_verifications')
        .select('*');

      // Group verifications by action_id
      const verificationsByAction = (verificationsData || []).reduce((acc, v) => {
        if (!acc[v.action_id]) acc[v.action_id] = [];
        acc[v.action_id].push(v);
        return acc;
      }, {} as Record<string, Verification[]>);

      // Merge actions with verifications
      const actionsWithVerifications = (actionsData || []).map(action => ({
        ...action,
        verifications: verificationsByAction[action.id] || [],
        user_verification: (verificationsByAction[action.id] || []).find(v => v.verified_by === user.id) || null
      }));

      setActions(actionsWithVerifications);
    } catch (error: any) {
      toast({
        title: "Error loading actions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (actionId: string, verificationType: 'verified' | 'disputed') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const action = actions.find(a => a.id === actionId);
      if (!action) return;

      if (action.user_id === user.id) {
        toast({
          title: "Cannot verify own action",
          description: "You can only verify actions from other users",
          variant: "destructive",
        });
        return;
      }

      if (action.user_verification) {
        // Update existing verification
        await supabase
          .from('action_verifications')
          .update({
            verification_type: verificationType,
            comment: verificationComment || null
          })
          .eq('action_id', actionId)
          .eq('verified_by', user.id);
      } else {
        // Create new verification
        await supabase
          .from('action_verifications')
          .insert({
            action_id: actionId,
            verified_by: user.id,
            verification_type: verificationType,
            comment: verificationComment || null
          });
      }

      toast({
        title: verificationType === 'verified' ? "Action verified!" : "Action disputed",
        description: "Your verification has been recorded",
      });

      setVerificationComment("");
      setVerifyingAction(null);
      fetchActions();
    } catch (error: any) {
      toast({
        title: "Error submitting verification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getQualityBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">Not Analyzed</Badge>;
    if (score >= 0.8) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 0.6) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 0.4) return <Badge variant="secondary">Average</Badge>;
    return <Badge variant="destructive">Needs Review</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatScore = (score: number | null) => {
    return score ? (score * 100).toFixed(0) + '%' : 'N/A';
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Actions Dashboard</CardTitle>
            <CardDescription>
              View all your submitted actions and their AI analysis results
            </CardDescription>
          </CardHeader>
        </Card>

        {actions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No actions submitted yet</p>
              <Button onClick={() => navigate("/submit-action")}>
                Submit Your First Action
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {actions.map((action) => (
              <Card key={action.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(action.status)}
                        <CardTitle className="text-lg">
                          {action.description.substring(0, 100)}
                          {action.description.length > 100 && '...'}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {new Date(action.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {action.location_name && ` • ${action.location_name}`}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getQualityBadge(action.quality_score)}
                      {action.tokens_earned !== null && (
                        <Badge variant="outline" className="font-mono">
                          +{action.tokens_earned} tokens
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {action.image_url && (
                      <div>
                        <img
                          src={action.image_url}
                          alt="Action proof"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {action.quality_score !== null && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Quality Score</span>
                            <span className="font-semibold">{formatScore(action.quality_score)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Sentiment Score</span>
                            <span className="font-semibold">{formatScore(action.sentiment_score)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Relevance Score</span>
                            <span className="font-semibold">{formatScore(action.relevance_score)}</span>
                          </div>
                        </>
                      )}
                      {action.ai_feedback && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium mb-1">AI Feedback:</p>
                          <p className="text-sm text-muted-foreground">{action.ai_feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Community Verifications */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Community Verification</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {action.verifications?.filter(v => v.verification_type === 'verified').length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          {action.verifications?.filter(v => v.verification_type === 'disputed').length || 0}
                        </span>
                      </div>
                    </div>

                    <Dialog open={verifyingAction === action.id} onOpenChange={(open) => {
                      if (!open) {
                        setVerifyingAction(null);
                        setVerificationComment("");
                      }
                    }}>
                      <div className="flex gap-2">
                        <DialogTrigger asChild>
                          <Button
                            variant={action.user_verification?.verification_type === 'verified' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVerifyingAction(action.id)}
                            className="flex-1"
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <Button
                            variant={action.user_verification?.verification_type === 'disputed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setVerifyingAction(action.id)}
                            className="flex-1"
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Dispute
                          </Button>
                        </DialogTrigger>
                      </div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Verify Community Action</DialogTitle>
                          <DialogDescription>
                            Help validate this action and strengthen community trust
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Textarea
                            placeholder="Optional: Add a comment about your verification..."
                            value={verificationComment}
                            onChange={(e) => setVerificationComment(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleVerify(action.id, 'verified')}
                              className="flex-1"
                              variant="default"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Verify Action
                            </Button>
                            <Button
                              onClick={() => handleVerify(action.id, 'disputed')}
                              className="flex-1"
                              variant="destructive"
                            >
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Dispute Action
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {action.user_verification && (
                      <p className="text-xs text-muted-foreground mt-2">
                        You {action.user_verification.verification_type === 'verified' ? 'verified' : 'disputed'} this action
                        {action.user_verification.comment && `: "${action.user_verification.comment}"`}
                      </p>
                    )}
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
