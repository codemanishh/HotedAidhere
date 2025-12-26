import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminJobs } from "@/hooks/useAdminJobs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Wand2,
  Pencil,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { JobFormData, ExperienceLevel, Job } from "@/types/job";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { jobs, isLoading, stats, createJob, isCreating, updateJob, isUpdating, toggleJobStatus, deleteJob, isDeleting } = useAdminJobs();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [formData, setFormData] = useState<JobFormData>({
    company_name: "",
    job_role: "",
    qualification: "",
    experience: "Fresher",
    location: "",
    salary: "",
    skills_required: "",
    interview_process: "",
    how_to_apply: "",
    apply_link: "",
  });

  const parseJobText = (text: string): Partial<JobFormData> => {
    const result: Partial<JobFormData> = {};
    
    // Clean text - remove emojis and normalize
    const cleanText = (str: string): string => {
      return str
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[✅📌🧠📝🎯🔗🔖]/gu, "")
        .trim();
    };

    // Remove apply-link lines + URLs + metadata, then de-duplicate lines
    const cleanSection = (content: string): string => {
      const lines = cleanText(content)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((line) => {
          const lower = line.toLowerCase();

          // Remove metadata
          if (
            lower.startsWith("job type:") ||
            lower.startsWith("category:") ||
            lower.startsWith("verification:") ||
            lower.startsWith("posted by:") ||
            lower.startsWith("target audience:") ||
            lower.startsWith("auto expiry:") ||
            lower.startsWith("extra (optional")
          ) {
            return false;
          }

          // Remove apply link label + any URLs (so it only stays in Apply Now button)
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

      return unique.join("\n").trim();
    };

    // Helper to extract value after a label
    const extractValue = (labels: string[]): string => {
      for (const label of labels) {
        const regex = new RegExp(`${label}[:\\s]*([^\\n]+)`, "i");
        const match = text.match(regex);
        if (match && match[1]) {
          return cleanText(match[1]);
        }
      }
      return "";
    };

    // Helper to extract multi-line section - stops at next section header
    const extractSection = (startLabels: string[], endLabels: string[]): string => {
      for (const startLabel of startLabels) {
        const startRegex = new RegExp(`(?:${startLabel})[:\\s]*\\n?`, "i");
        const startMatch = text.match(startRegex);
        if (startMatch) {
          const startIndex = text.indexOf(startMatch[0]) + startMatch[0].length;
          let endIndex = text.length;

          for (const endLabel of endLabels) {
            const endRegex = new RegExp(
              `\\n[\\s]*(?:[\\u{1F300}-\\u{1F9FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]|[✅📌🧠📝🎯🔗🔖])?\\s*${endLabel}[:\\s]`,
              "iu",
            );
            const remaining = text.slice(startIndex);
            const endMatch = remaining.match(endRegex);
            if (endMatch) {
              const possibleEnd = startIndex + remaining.indexOf(endMatch[0]);
              if (possibleEnd < endIndex) {
                endIndex = possibleEnd;
              }
            }
          }

          const raw = text.slice(startIndex, endIndex).trim();
          const cleaned = cleanSection(raw);
          if (cleaned) return cleaned;
        }
      }
      return "";
    };

    // Parse company name
    result.company_name = extractValue(['Company Name', 'Company']);
    
    // Parse job role
    result.job_role = extractValue(['Job Role', 'Role', 'Position', 'Job Title']);
    
    // Parse location
    result.location = extractValue(['Location', 'Place', 'City']);
    
    // Parse experience and map to valid enum
    const expText = extractValue(['Experience', 'Exp']).toLowerCase();
    if (expText.includes('fresher') || expText.includes('0')) {
      result.experience = 'Fresher';
    } else if (expText.includes('0-1') || expText.includes('0 to 1')) {
      result.experience = '0-1 years';
    } else if (expText.includes('1-2') || expText.includes('1 to 2')) {
      result.experience = '1-2 years';
    } else if (expText.includes('2+') || expText.includes('2 years') || expText.includes('more')) {
      result.experience = '2+ years';
    } else {
      result.experience = 'Fresher';
    }
    
    // Parse qualification
    result.qualification = extractValue(['Qualification', 'Education', 'Degree']);
    
    // Parse salary
    result.salary = extractValue(['Salary', 'CTC', 'Package']);
    
    // Parse skills required (multi-line)
    result.skills_required = extractSection(
      ['Skills Required', 'Skills'],
      ['Job Description', 'Interview Process', 'How to Apply', 'Apply Link', 'Extra']
    );
    
    // Parse interview process (multi-line)
    result.interview_process = extractSection(
      ['Interview Process', 'Selection Process', 'Hiring Process'],
      ['How to Apply', 'Apply Link', 'Extra']
    );
    
    // Parse how to apply (multi-line) - stop before apply link
    result.how_to_apply = extractSection(
      ['How to Apply', 'Application Process'],
      ['Apply Link', 'Extra']
    );
    
    // Parse apply link - get only the URL
    const linkMatch = text.match(/https?:\/\/[^\s\n\)\]]+/);
    if (linkMatch) {
      result.apply_link = linkMatch[0];
    }
    
    return result;
  };

  const handleParseAndFill = () => {
    if (!pasteText.trim()) {
      toast({
        title: "No text to parse",
        description: "Please paste job details text first.",
        variant: "destructive",
      });
      return;
    }

    const parsed = parseJobText(pasteText);
    setFormData(prev => ({
      ...prev,
      company_name: parsed.company_name || prev.company_name,
      job_role: parsed.job_role || prev.job_role,
      qualification: parsed.qualification || prev.qualification,
      experience: parsed.experience || prev.experience,
      location: parsed.location || prev.location,
      salary: parsed.salary || prev.salary,
      skills_required: parsed.skills_required || prev.skills_required,
      interview_process: parsed.interview_process || prev.interview_process,
      how_to_apply: parsed.how_to_apply || prev.how_to_apply,
      apply_link: parsed.apply_link || prev.apply_link,
    }));
    
    setPasteText("");
    toast({
      title: "Form Auto-filled",
      description: "Job details have been parsed and filled. Please review and adjust if needed.",
    });
  };

  useEffect(() => {
    // Only redirect to login if we're sure there's no user (after loading is complete)
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only check admin status after loading is complete AND user exists AND isAdmin has been determined
    if (!authLoading && user && !isAdmin) {
      // Double-check by giving a small delay for the admin check to complete
      const timer = setTimeout(() => {
        if (!isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          signOut();
          navigate("/admin/login");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, authLoading, user, navigate, toast, signOut]);

  const sanitizeMultiline = (value: string) => {
    const lines = (value || "")
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
    return lines
      .filter((l) => {
        const key = l.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const handleShareJob = (job: Job) => {
    const siteUrl = window.location.origin;
    const jobUrl = `${siteUrl}/jobs/${job.slug}`;
    
    const shareMessage = `🚀 *${job.company_name} Hiring ${job.experience === 'Fresher' ? 'Freshers' : job.experience}*

👤 *Profile:* ${job.job_role}
🎓 *Qualification:* ${job.qualification}
🧑‍💼 *Experience:* ${job.experience}
📍 *Location:* ${job.location}${job.salary ? `\n💰 *Salary:* ${job.salary}` : ''}

🔗 *Apply Now:* ${jobUrl}

💖🙌 Share with your besties 🙌❤️`;

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.company_name || !formData.job_role || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const sanitizedFormData: JobFormData = {
      ...formData,
      qualification: sanitizeMultiline(formData.qualification),
      skills_required: sanitizeMultiline(formData.skills_required),
      interview_process: sanitizeMultiline(formData.interview_process),
      how_to_apply: sanitizeMultiline(formData.how_to_apply),
    };

    if (editingJob) {
      updateJob(
        { jobId: editingJob.id, jobData: sanitizedFormData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingJob(null);
            resetForm();
          },
        }
      );
    } else {
      createJob(sanitizedFormData, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      job_role: "",
      qualification: "",
      experience: "Fresher",
      location: "",
      salary: "",
      skills_required: "",
      interview_process: "",
      how_to_apply: "",
      apply_link: "",
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      company_name: job.company_name,
      job_role: job.job_role,
      qualification: job.qualification,
      experience: job.experience,
      location: job.location,
      salary: job.salary || "",
      skills_required: job.skills_required,
      interview_process: job.interview_process,
      how_to_apply: job.how_to_apply,
      apply_link: job.apply_link,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingJob(null);
      resetForm();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Admin Dashboard
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Jobs
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.activeJobs}</div>
            </CardContent>
          </Card>
          
          <Card className="border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expired Jobs
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.expiredJobs}</div>
            </CardContent>
          </Card>
          
          <Card className="border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalJobs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">All Jobs</h2>
          
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {editingJob ? "Edit Job" : "Create New Job"}
                </DialogTitle>
              </DialogHeader>

              {/* Paste & Auto-fill Section */}
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                <Label htmlFor="paste_text" className="text-sm font-medium text-primary">
                  Quick Fill: Paste Job Details
                </Label>
                <Textarea
                  id="paste_text"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste the job details text here (e.g., Company Name: Quest Global, Job Role: Java Developer...)"
                  rows={4}
                  className="mt-2 border-primary/20 bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleParseAndFill}
                  className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Parse & Auto-fill Form
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="e.g., Quest Global"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job_role">Job Role *</Label>
                    <Input
                      id="job_role"
                      value={formData.job_role}
                      onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                      placeholder="e.g., Java Developer"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Bangalore"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value: ExperienceLevel) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fresher">Fresher</SelectItem>
                        <SelectItem value="0-1 years">0-1 years</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="2+ years">2+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification *</Label>
                    <Input
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      placeholder="e.g., B.Tech / B.E. in CS/IT"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Optional)</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g., 4-6 LPA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills_required">Skills Required *</Label>
                  <Textarea
                    id="skills_required"
                    value={formData.skills_required}
                    onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                    placeholder="List the required skills..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interview_process">Interview Process *</Label>
                  <Textarea
                    id="interview_process"
                    value={formData.interview_process}
                    onChange={(e) => setFormData({ ...formData, interview_process: e.target.value })}
                    placeholder="Describe the interview process..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="how_to_apply">How to Apply *</Label>
                  <Textarea
                    id="how_to_apply"
                    value={formData.how_to_apply}
                    onChange={(e) => setFormData({ ...formData, how_to_apply: e.target.value })}
                    placeholder="Instructions on how to apply..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apply_link">Apply Link *</Label>
                  <Input
                    id="apply_link"
                    type="url"
                    value={formData.apply_link}
                    onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {editingJob 
                      ? (isUpdating ? "Updating..." : "Update Job")
                      : (isCreating ? "Creating..." : "Post Job")
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Table */}
        <Card className="border-border shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">No Jobs Yet</h3>
                <p className="text-muted-foreground">Create your first job posting to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="w-[60px]">Share</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => {
                    const isExpired = new Date(job.expires_at) <= new Date();
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.job_role}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleShareJob(job)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{job.company_name}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{format(new Date(job.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(new Date(job.expires_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <Select
                            value={job.is_active ? "active" : "inactive"}
                            onValueChange={(value) => toggleJobStatus({ jobId: job.id, isActive: value === "active" })}
                          >
                            <SelectTrigger className={`w-[120px] h-8 text-xs ${job.is_active ? 'border-success/50 text-success' : 'border-destructive/50 text-destructive'}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                  Active
                                </span>
                              </SelectItem>
                              <SelectItem value="inactive">
                                <span className="flex items-center gap-1">
                                  <XCircle className="h-3 w-3 text-destructive" />
                                  Inactive
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {isExpired && (
                            <span className="text-[10px] text-warning block mt-1">Expired</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handleEdit(job)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => deleteJob(job.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
