export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";

export interface Candidate {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  skills: string[];
  years_experience: number | null;
  recent_job_title: string | null;
  location: string | null;
  resume_summary: string | null;
  storage_path: string | null;
  original_filename: string;
  scrubbed_text: string | null;
  processing_status: ProcessingStatus;
  error_message: string | null;
}

export interface DashboardStats {
  totalCandidates: number;
  averageExperience: number;
  topSkill: string | null;
  topLocation: string | null;
}

export interface CandidateFilters {
  query?: string;
  skill?: string;
  minYears?: number;
  location?: string;
}

export interface AIExtractionResult {
  skills: string[];
  years_experience: number;
  recent_job_title: string;
  location: string;
  resume_summary: string;
}
