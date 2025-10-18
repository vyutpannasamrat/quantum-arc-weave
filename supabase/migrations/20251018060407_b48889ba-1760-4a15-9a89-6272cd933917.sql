-- Add AI analysis columns to actions table
ALTER TABLE public.actions 
ADD COLUMN sentiment_score double precision,
ADD COLUMN relevance_score double precision,
ADD COLUMN quality_score double precision,
ADD COLUMN ai_feedback text;

-- Update tokens_earned to be nullable so we can calculate it dynamically
ALTER TABLE public.actions 
ALTER COLUMN tokens_earned DROP DEFAULT,
ALTER COLUMN tokens_earned DROP NOT NULL;

-- Update existing actions to have null for new fields
UPDATE public.actions 
SET sentiment_score = NULL,
    relevance_score = NULL,
    quality_score = NULL,
    ai_feedback = NULL
WHERE sentiment_score IS NULL;