-- Create early access signups table
CREATE TABLE IF NOT EXISTS public.early_access_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up
CREATE POLICY "Anyone can sign up for early access"
  ON public.early_access_signups
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view signups (admin functionality)
CREATE POLICY "Only authenticated users can view signups"
  ON public.early_access_signups
  FOR SELECT
  USING (auth.role() = 'authenticated');