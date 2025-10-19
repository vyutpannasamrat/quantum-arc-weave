-- Create community_topics table for votable topics
CREATE TABLE public.community_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  vote_count_up INTEGER NOT NULL DEFAULT 0,
  vote_count_down INTEGER NOT NULL DEFAULT 0
);

-- Create topic_votes table
CREATE TABLE public.topic_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.community_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(topic_id, user_id)
);

-- Create action_verifications table
CREATE TABLE public.action_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id UUID NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
  verified_by UUID NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('verified', 'disputed')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(action_id, verified_by)
);

-- Enable RLS
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_topics
CREATE POLICY "Anyone can view topics"
  ON public.community_topics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON public.community_topics FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own topics"
  ON public.community_topics FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for topic_votes
CREATE POLICY "Anyone can view votes"
  ON public.topic_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.topic_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.topic_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.topic_votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for action_verifications
CREATE POLICY "Anyone can view verifications"
  ON public.action_verifications FOR SELECT
  USING (true);

CREATE POLICY "Users can verify others' actions"
  ON public.action_verifications FOR INSERT
  WITH CHECK (
    auth.uid() = verified_by AND
    auth.uid() != (SELECT user_id FROM public.actions WHERE id = action_id)
  );

CREATE POLICY "Users can update their own verifications"
  ON public.action_verifications FOR UPDATE
  USING (auth.uid() = verified_by);

CREATE POLICY "Users can delete their own verifications"
  ON public.action_verifications FOR DELETE
  USING (auth.uid() = verified_by);

-- Trigger for updated_at on community_topics
CREATE TRIGGER update_community_topics_updated_at
  BEFORE UPDATE ON public.community_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION public.update_topic_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.community_topics
      SET vote_count_up = vote_count_up + 1
      WHERE id = NEW.topic_id;
    ELSE
      UPDATE public.community_topics
      SET vote_count_down = vote_count_down + 1
      WHERE id = NEW.topic_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type != NEW.vote_type THEN
      IF NEW.vote_type = 'up' THEN
        UPDATE public.community_topics
        SET vote_count_up = vote_count_up + 1,
            vote_count_down = vote_count_down - 1
        WHERE id = NEW.topic_id;
      ELSE
        UPDATE public.community_topics
        SET vote_count_up = vote_count_up - 1,
            vote_count_down = vote_count_down + 1
        WHERE id = NEW.topic_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE public.community_topics
      SET vote_count_up = vote_count_up - 1
      WHERE id = OLD.topic_id;
    ELSE
      UPDATE public.community_topics
      SET vote_count_down = vote_count_down - 1
      WHERE id = OLD.topic_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$;

-- Trigger to update vote counts
CREATE TRIGGER update_topic_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.topic_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_topic_vote_counts();