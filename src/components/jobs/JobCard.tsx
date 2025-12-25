import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyLogo } from "@/components/ui/company-logo";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  index?: number;
}

export const JobCard = ({ job, index = 0 }: JobCardProps) => {
  return (
    <Link to={`/jobs/${job.slug}`}>
      <Card 
        className="group cursor-pointer border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20 animate-slide-up opacity-0 overflow-hidden"
        style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
      >
        {/* Gradient accent line */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
                <CompanyLogo companyName={job.company_name} size="md" />
              </div>
            </div>
            
            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {job.company_name} Recruitment 2025 | {job.job_role} | {job.location}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {job.company_name} Recruitment: {job.company_name} published a {job.job_role} job opportunity in career page to hire freshers as {job.job_role} in {job.location}...
              </p>
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/80 text-secondary-foreground">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  <Briefcase className="h-3 w-3" />
                  {job.experience}
                </span>
                {job.salary && (
                  <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                    {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground/70 ml-auto">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
