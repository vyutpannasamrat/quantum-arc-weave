-- Update RLS policy on actions table to allow viewing all actions
-- This is needed for community verification feature
DROP POLICY IF EXISTS "Users can view their own actions" ON public.actions;

CREATE POLICY "Anyone can view all actions"
ON public.actions
FOR SELECT
USING (true);

-- Keep the insert and update policies restricted to own actions
-- (These already exist and are correct)