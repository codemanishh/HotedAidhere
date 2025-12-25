export type ExperienceLevel = 'Fresher' | '0-1 years' | '1-2 years' | '2+ years';

export interface Job {
  id: string;
  company_name: string;
  job_role: string;
  qualification: string;
  experience: ExperienceLevel;
  location: string;
  salary: string | null;
  skills_required: string;
  interview_process: string;
  how_to_apply: string;
  apply_link: string;
  slug: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface JobFormData {
  company_name: string;
  job_role: string;
  qualification: string;
  experience: ExperienceLevel;
  location: string;
  salary?: string;
  skills_required: string;
  interview_process: string;
  how_to_apply: string;
  apply_link: string;
}
