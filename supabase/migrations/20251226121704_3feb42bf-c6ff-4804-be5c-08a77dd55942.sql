-- Create a table to track site visits
CREATE TABLE public.site_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  visitor_id text NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits (anonymous tracking)
CREATE POLICY "Anyone can record visits"
ON public.site_visits
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read visit counts (for displaying stats)
CREATE POLICY "Anyone can view visits"
ON public.site_visits
FOR SELECT
USING (true);

-- Create index for faster date-based queries
CREATE INDEX idx_site_visits_visited_at ON public.site_visits (visited_at);
CREATE INDEX idx_site_visits_visitor_id ON public.site_visits (visitor_id);