-- Change job expiry default from 5 days to 10 days
ALTER TABLE public.jobs 
ALTER COLUMN expires_at SET DEFAULT (now() + '10 days'::interval);