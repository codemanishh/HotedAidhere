-- Create enum for experience levels
CREATE TYPE public.experience_level AS ENUM ('Fresher', '0-1 years', '1-2 years', '2+ years');

-- Create enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience experience_level NOT NULL DEFAULT 'Fresher',
  location TEXT NOT NULL,
  salary TEXT,
  skills_required TEXT NOT NULL,
  interview_process TEXT NOT NULL,
  how_to_apply TEXT NOT NULL,
  apply_link TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '5 days'),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Jobs policies - public read for active jobs, admin write
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs
  FOR SELECT
  USING (is_active = true AND expires_at > now());

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin policies for jobs
CREATE POLICY "Admins can insert jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jobs"
  ON public.jobs
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Admins can view roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate SEO-friendly slug
CREATE OR REPLACE FUNCTION public.generate_job_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from company, role, location, and year
  base_slug := lower(
    regexp_replace(
      concat_ws('-', 
        NEW.company_name, 
        NEW.job_role, 
        NEW.location, 
        EXTRACT(YEAR FROM NEW.created_at)::TEXT
      ),
      '[^a-z0-9-]', '-', 'gi'
    )
  );
  -- Remove multiple consecutive dashes
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  -- Trim dashes from ends
  base_slug := trim(BOTH '-' FROM base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.jobs WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_slug_before_insert
  BEFORE INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.generate_job_slug();

-- Function to auto-expire jobs
CREATE OR REPLACE FUNCTION public.expire_old_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs
  SET is_active = false
  WHERE expires_at < now() AND is_active = true;
END;
$$;

-- Create index for better query performance
CREATE INDEX idx_jobs_active ON public.jobs(is_active, expires_at);
CREATE INDEX idx_jobs_slug ON public.jobs(slug);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_role ON public.jobs(job_role);