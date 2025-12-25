import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, ExperienceLevel } from "@/types/job";

interface JobFilters {
  location?: string;
  company?: string;
}

export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: ["jobs", filters?.location, filters?.company],
    queryFn: async (): Promise<Job[]> => {
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString());

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.company) {
        query = query.ilike("company_name", `%${filters.company}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(job => ({
        ...job,
        experience: job.experience as ExperienceLevel
      }));
    },
  });
};

export const useJob = (slug: string) => {
  return useQuery({
    queryKey: ["job", slug],
    queryFn: async (): Promise<Job | null> => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        experience: data.experience as ExperienceLevel
      };
    },
    enabled: !!slug,
  });
};

export const useRecommendedJobs = (currentJob: Job | null) => {
  return useQuery({
    queryKey: ["recommendedJobs", currentJob?.id, currentJob?.location, currentJob?.job_role],
    queryFn: async (): Promise<Job[]> => {
      if (!currentJob) return [];

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .neq("id", currentJob.id)
        .or(`location.ilike.%${currentJob.location}%,job_role.ilike.%${currentJob.job_role}%`)
        .limit(6);

      if (error) throw error;
      
      return (data || []).map(job => ({
        ...job,
        experience: job.experience as ExperienceLevel
      }));
    },
    enabled: !!currentJob,
  });
};
