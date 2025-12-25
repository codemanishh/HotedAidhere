import { Link } from "react-router-dom";
import { Job } from "@/types/job";
import { CompanyLogo } from "@/components/ui/company-logo";

interface RecommendedJobsProps {
  jobs: Job[];
  currentJobId: string;
}

export const RecommendedJobs = ({ jobs, currentJobId }: RecommendedJobsProps) => {
  const filteredJobs = jobs.filter(job => job.id !== currentJobId).slice(0, 6);
  
  if (filteredJobs.length === 0) return null;

  return (
    <section className="mt-8 bg-card rounded-lg border border-border p-6">
      <h2 className="font-display text-lg font-bold text-foreground mb-4">
        Related Fresher Jobs
      </h2>
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Link 
            key={job.id} 
            to={`/jobs/${job.slug}`}
            className="flex gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <CompanyLogo companyName={job.company_name} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Job Openings For Freshers
              </p>
              <h3 className="font-bold text-sm text-primary hover:underline line-clamp-2">
                {job.company_name} Recruitment 2025 | {job.job_role} | {job.location}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {job.company_name} Recruitment: Explore {job.company_name}'s latest {job.job_role} job opening in {job.location} for Freshers! Review the recruitment process...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
