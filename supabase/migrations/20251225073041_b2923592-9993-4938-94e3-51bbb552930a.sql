-- Create comments table for job discussions
CREATE TABLE public.job_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.job_comments(id) ON DELETE CASCADE,
  anonymous_name TEXT NOT NULL DEFAULT 'Anonymous',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view comments
CREATE POLICY "Anyone can view comments"
ON public.job_comments
FOR SELECT
USING (true);

-- Allow anyone to insert comments (anonymous posting)
CREATE POLICY "Anyone can post comments"
ON public.job_comments
FOR INSERT
WITH CHECK (true);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_comments;

-- Create index for faster queries
CREATE INDEX idx_job_comments_job_id ON public.job_comments(job_id);
CREATE INDEX idx_job_comments_parent_id ON public.job_comments(parent_id);