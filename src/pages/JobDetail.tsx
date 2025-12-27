import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { RecommendedJobs } from "@/components/jobs/RecommendedJobs";
import { SEO } from "@/components/seo/SEO";
import { CommentSection } from "@/components/comments/CommentSection";
import { useJob, useRecommendedJobs } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyLogo } from "@/components/ui/company-logo";
import { 
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Home,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  MessageCircle,
  Share2,
  IndianRupee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";

// Normalize job text blocks: trim, remove URLs/"Apply Link" lines, de-duplicate, and limit blank lines
const normalizeText = (text: string): string => {
  const lines = (text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => {
      const lower = line.toLowerCase();
      if (lower.startsWith("apply link")) return false;
      if (/https?:\/\//i.test(line)) return false;
      return true;
    });

  const seen = new Set<string>();
  const unique = lines.filter((l) => {
    const key = l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const JobDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, error } = useJob(slug || "");
  const { data: recommendedJobs } = useRecommendedJobs(job || null);
  const { toast } = useToast();

  const handleShareJob = async () => {
    if (!job) return;
    
    const siteUrl = window.location.origin;
    const jobUrl = `${siteUrl}/jobs/${job.slug}`;
    
    const shareMessage = `🚀 *${job.company_name} Hiring ${job.experience === 'Fresher' ? 'Freshers' : job.experience}*

👤 *Profile:* ${job.job_role}
🎓 *Qualification:* ${job.qualification}
🧑‍💼 *Experience:* ${job.experience}
📍 *Location:* ${job.location}${job.salary ? `\n💰 *Salary:* ${job.salary}` : ''}

🔗 *Apply Now:* ${jobUrl}

💖🙌 Share with your besties 🙌❤️`;

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Use Web Share API only on mobile
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${job.company_name} - ${job.job_role}`,
          text: shareMessage,
          url: jobUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Clipboard for desktop/tablet
      navigator.clipboard.writeText(shareMessage).then(() => {
        toast({
          title: "Copied to Clipboard!",
          description: "Job details ready to share with your communities.",
        });
      }).catch(() => {
        toast({
          title: "Copy Failed",
          description: "Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SEO title="Loading Job..." noIndex />
        <Header />
        <main className="flex-1 py-6">
          <div className="container">
            <Skeleton className="mb-6 h-8 w-32 rounded-lg" />
            <Skeleton className="mb-4 h-12 w-3/4 rounded-xl" />
            <Skeleton className="mb-8 h-6 w-1/2 rounded-lg" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SEO 
          title="Job Not Found" 
          description="This job posting may have expired or does not exist."
          noIndex 
        />
        <Header />
        <main className="flex-1 py-16">
          <div className="container text-center">
            <div className="rounded-2xl border border-border bg-card p-12 animate-scale-in shadow-card">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
                <Briefcase className="relative h-16 w-16 text-destructive" />
              </div>
              <h1 className="mb-4 font-display text-2xl font-bold text-foreground">
                Job Not Found
              </h1>
              <p className="mb-6 text-muted-foreground">
                This job posting may have expired or does not exist.
              </p>
              <Button asChild className="hover:scale-105 transition-transform">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Jobs
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const jobDescription = `${job.job_role} at ${job.company_name} in ${job.location}. ${job.experience} experience required. ${job.qualification}. Apply now for this fresher job opportunity!`;

  const breadcrumbs = [
    { name: "Home", url: `${window.location.origin}/` },
    { name: `${job.location} Jobs`, url: `${window.location.origin}/?location=${encodeURIComponent(job.location.toLowerCase())}` },
    { name: `${job.company_name} Jobs`, url: `${window.location.origin}/?company=${encodeURIComponent(job.company_name.toLowerCase())}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO 
        title={`${job.job_role} at ${job.company_name} - ${job.location} | Fresher Jobs 2025`}
        description={jobDescription}
        keywords={`${job.job_role}, ${job.company_name} jobs, ${job.location} jobs, ${job.experience}, fresher jobs 2025, ${job.skills_required.split(',').slice(0, 3).join(', ')}, entry level jobs`}
        canonicalUrl={`${window.location.origin}/jobs/${job.slug}`}
        ogType="article"
        publishedTime={job.created_at}
        breadcrumbs={breadcrumbs}
        jobPosting={{
          title: job.job_role,
          company: job.company_name,
          location: job.location,
          salary: job.salary || undefined,
          datePosted: job.created_at,
          validThrough: job.expires_at,
          description: jobDescription,
          applyUrl: job.apply_link,
        }}
      />
      
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div>
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground flex-wrap animate-fade-in">
                <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-primary">{job.location} Jobs</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium truncate max-w-[300px]">
                  {job.job_role} | {job.company_name}
                </span>
              </nav>

              {/* Job Title Card */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                
                {/* Mobile: Logo centered at top */}
                <div className="flex justify-center mb-4 sm:hidden">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg" />
                    <CompanyLogo companyName={job.company_name} size="lg" className="relative" />
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  {/* Desktop: Logo on left */}
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg" />
                    <CompanyLogo companyName={job.company_name} size="lg" className="relative" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="font-display text-xl font-bold text-foreground md:text-2xl mb-2">
                      {job.company_name} Recruitment 2025 | {job.job_role} | {job.location}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </span>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        By Codemanishh
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description Intro */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <p className="text-foreground leading-relaxed">
                  <strong className="text-primary">{job.company_name} Recruitment 2025:</strong> {job.company_name} published a {job.job_role} job opportunity in career page to hire {job.experience} as {job.job_role} in {job.location}. Kindly go through the below recruitment process for freshers 2025. If you want to get Freshers Recruitment or {job.job_role} jobs updates at the earliest, join with us on Telegram Group.
                </p>
              </div>

              {/* Quick Info Cards */}
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <Briefcase className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-semibold text-sm text-foreground truncate">{job.company_name}</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-sm text-foreground truncate">{job.location}</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <GraduationCap className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="font-semibold text-sm text-foreground truncate">{job.experience}</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <IndianRupee className="h-5 w-5 text-success mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-semibold text-sm text-foreground truncate">{job.salary || "Best in Industry"}</p>
                </div>
              </div>

              {/* Qualification */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-gradient-to-b from-accent to-accent/50 rounded-full" />
                  <h2 className="font-display text-lg font-bold heading-skills">
                    {job.company_name} Recruitment 2025 - Required Skills/ Qualification:
                  </h2>
                </div>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed pl-3">
                  {normalizeText(job.qualification)}
                </div>
              </div>

              {/* Skills Required */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up overflow-hidden" style={{ animationDelay: '0.25s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  <h2 className="font-display text-lg font-bold heading-description">
                    {job.company_name} - Skills Required:
                  </h2>
                </div>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed pl-3">
                  {normalizeText(job.skills_required)}
                </div>
              </div>

              {/* Interview Process */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up overflow-hidden" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-pink-500/50 rounded-full" />
                  <h2 className="font-display text-lg font-bold heading-interview">
                    {job.company_name} Interview Process:
                  </h2>
                </div>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed pl-3">
                  {normalizeText(job.interview_process)}
                </div>
              </div>

              {/* How to Apply */}
              <div className="mb-6 bg-card rounded-2xl border border-border/50 p-6 shadow-card animate-slide-up overflow-hidden" style={{ animationDelay: '0.35s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-1 bg-gradient-to-b from-success to-success/50 rounded-full" />
                  <h2 className="font-display text-lg font-bold heading-apply">
                    {job.company_name} Recruitment 2025 - How To Apply:
                  </h2>
                </div>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed mb-6 pl-3">
                  {normalizeText(job.how_to_apply)}
                </div>

                {/* Help Message */}
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Have questions or doubts?</strong> Feel free to reach out to us on{" "}
                      <a 
                        href="https://t.me/TechJob_finder" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0088cc] hover:underline"
                      >
                        Telegram
                      </a>
                      {" "}or{" "}
                      <a 
                        href="https://www.instagram.com/codemanishh/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-pink-600 hover:underline"
                      >
                        Instagram
                      </a>
                      . We're here to help you with any queries about this job!
                    </span>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-success to-accent hover:opacity-90 text-success-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleShareJob}
                    className="border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Job
                  </Button>
                </div>
              </div>

              {/* Follow Me CTA */}
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary p-[2px] shadow-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="rounded-2xl bg-card p-6">
                  <div className="text-center mb-5">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      Never Miss a Job Update!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Follow us for daily fresher job alerts & career tips
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a 
                      href="https://t.me/TechJob_finder" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Join Telegram
                    </a>
                    <a 
                      href="https://www.instagram.com/codemanishh/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Follow on Instagram
                    </a>
                  </div>
                </div>
              </div>

              {/* Expiry Notice */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 border border-pink-200 dark:border-pink-800 p-4 text-center animate-slide-up" style={{ animationDelay: '0.45s' }}>
                <p className="text-sm text-pink-700 dark:text-pink-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>This job posting expires on</span>
                  </span>
                  <strong className="text-pink-800 dark:text-pink-200">{format(new Date(job.expires_at), 'MMMM d, yyyy')}</strong>
                  <span className="hidden sm:inline">.</span>
                  <span>Apply before they close!</span>
                </p>
              </div>

              {/* Fresher Jobs by Location CTA */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-6 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="font-display text-lg font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Fresher Jobs by Location
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click your preferred city to explore the latest openings!
                </p>
              </div>

              {/* Recommended Jobs */}
              {recommendedJobs && recommendedJobs.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.55s' }}>
                  <RecommendedJobs jobs={recommendedJobs} currentJobId={job.id} />
                </div>
              )}

              {/* Comment Section */}
              <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <CommentSection jobId={job.id} />
              </div>
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

export default JobDetail;
