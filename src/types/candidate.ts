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

export interface RankedItem {
  label: string;
  count: number;
}

export interface RecentCandidateSummary {
  id: string;
  name: string;
  recent_job_title: string | null;
  location: string | null;
  years_experience: number | null;
  skills: string[];
  created_at: string;
}

export interface AITalentInsights {
  mostCommonSkill: string | null;
  largestTalentPool: string | null;
  averageSeniority: string | null;
  fastestGrowingLocation: string | null;
  recommendation: string;
}

export interface DashboardInsights {
  totalCandidates: number;
  readyToHire: number;
  readyToHirePercent: number;
  averageExperience: number;
  locationsCovered: number;
  countriesCovered: number;
  candidatesThisWeek: number;
  skillsIndexed: number;
  lastUploadAt: string | null;
  pipeline: {
    completed: number;
    pending: number;
    processing: number;
    failed: number;
    total: number;
  };
  experienceBands: {
    junior: number;
    mid: number;
    senior: number;
    unknown: number;
  };
  roleDistribution: RankedItem[];
  topSkills: RankedItem[];
  topLocations: RankedItem[];
  recentCandidates: RecentCandidateSummary[];
  aiInsights: AITalentInsights;
}

export interface CandidateFilters {
  query?: string;
  skill?: string;
  minYears?: number;
  location?: string;
  jobTitle?: string;
}

export type CandidateSort = "recent" | "name" | "experience";

export interface AIExtractionResult {
  skills: string[];
  years_experience: number;
  recent_job_title: string;
  location: string;
  resume_summary: string;
}
