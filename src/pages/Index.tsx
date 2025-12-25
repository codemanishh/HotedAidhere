import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { SEO } from "@/components/seo/SEO";
import { useJobs } from "@/hooks/useJobs";
import { Briefcase, Sparkles, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, Link } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || undefined;
  const company = searchParams.get("company") || undefined;

  const { data: jobs, isLoading, error } = useJobs({ location, company });

  // Generate dynamic title based on filters
  const getPageTitle = () => {
    if (company) {
      return `${company.charAt(0).toUpperCase() + company.slice(1)} Jobs for Freshers`;
    }
    if (location) {
      return `Fresher Jobs in ${location.charAt(0).toUpperCase() + location.slice(1)}`;
    }
    return "Latest Fresher Job Openings";
  };

  const getSeoTitle = () => {
    if (company) {
      return `${company.charAt(0).toUpperCase() + company.slice(1)} Jobs for Freshers`;
    }
    if (location) {
      return `Fresher Jobs in ${location.charAt(0).toUpperCase() + location.slice(1)}`;
    }
    return "Latest Fresher Jobs in India";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO 
        title={getSeoTitle()}
        description="Find the best job opportunities for freshers in India. Browse latest openings from TCS, Infosys, Wipro, Cognizant and more top companies. Apply now for entry-level IT jobs."
        keywords="fresher jobs, entry level jobs, campus placement, IT jobs India, software developer jobs, TCS jobs, Infosys careers, Wipro hiring, first job"
      />
      
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div>
              {/* Breadcrumb */}
              {(location || company) && (
                <nav className="mb-4 text-sm animate-fade-in">
                  <Link to="/" className="text-primary hover:underline">Home</Link>
                  <span className="mx-2 text-muted-foreground">›</span>
                  <span className="text-muted-foreground">
                    {company 
                      ? `${company.charAt(0).toUpperCase() + company.slice(1)} Jobs`
                      : `${location?.charAt(0).toUpperCase()}${location?.slice(1)} Jobs`
                    }
                  </span>
                </nav>
              )}

              {/* Page Title */}
              <div className="mb-8 animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                    <Sparkles className="h-3 w-3" />
                    Updated Daily
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    100% Free
                  </div>
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
                  {getPageTitle()}
                </h1>
                <p className="mt-2 text-muted-foreground text-lg">
                  {isLoading ? (
                    <span className="animate-pulse">Loading opportunities...</span>
                  ) : (
                    <span><strong className="text-accent">{jobs?.length || 0}</strong> active jobs for freshers</span>
                  )}
                </p>
              </div>

              {/* Job Listings */}
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                      <Skeleton className="h-36 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-scale-in">
                  <p className="text-destructive">Failed to load jobs. Please try again later.</p>
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 text-center animate-scale-in">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Briefcase className="relative mx-auto mb-4 h-16 w-16 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-foreground">No Jobs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {company 
                      ? `No jobs found for ${company.charAt(0).toUpperCase() + company.slice(1)}.`
                      : location 
                        ? `No jobs found in ${location.charAt(0).toUpperCase() + location.slice(1)}.`
                        : "Check back soon for new opportunities!"
                    }
                  </p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    View All Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
