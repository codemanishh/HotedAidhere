-- Fix function search path for generate_job_slug
CREATE OR REPLACE FUNCTION public.generate_job_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
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

-- Fix function search path for expire_old_jobs
CREATE OR REPLACE FUNCTION public.expire_old_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.jobs
  SET is_active = false
  WHERE expires_at < now() AND is_active = true;
END;
$$;