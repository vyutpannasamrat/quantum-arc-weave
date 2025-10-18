-- Create actions table for micro-action submissions
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_name TEXT,
  image_url TEXT,
  tokens_earned INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own actions"
ON public.actions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own actions"
ON public.actions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
ON public.actions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_actions_updated_at
BEFORE UPDATE ON public.actions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for action images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'action-images',
  'action-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Storage policies
CREATE POLICY "Users can upload their own action images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'action-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own action images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'action-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Action images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'action-images');