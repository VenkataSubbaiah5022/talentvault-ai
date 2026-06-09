export type TalentRole =
  | "Software Engineers"
  | "Designers"
  | "Product Managers"
  | "Sales & Marketing"
  | "Operations"
  | "Other";

const ROLE_ORDER: TalentRole[] = [
  "Software Engineers",
  "Designers",
  "Product Managers",
  "Sales & Marketing",
  "Operations",
];

export function classifyTalentRole(
  jobTitle: string | null,
  skills: string[] = [],
): TalentRole {
  const text = `${jobTitle ?? ""} ${skills.join(" ")}`.toLowerCase();

  if (
    /engineer|developer|devops|software|frontend|backend|full.?stack|sde|architect|programmer/.test(
      text,
    )
  ) {
    return "Software Engineers";
  }
  if (/design|ux|ui\b|figma|visual/.test(text)) return "Designers";
  if (/product manager|product owner|\bpm\b|product lead/.test(text)) {
    return "Product Managers";
  }
  if (
    /sales|account executive|business development|sdr|key account|revenue/.test(
      text,
    )
  ) {
    return "Sales & Marketing";
  }
  if (/operations|supply chain|\bops\b|coordinator|logistics|analyst/.test(text)) {
    return "Operations";
  }

  return "Other";
}

export function getRoleOrder(): TalentRole[] {
  return ROLE_ORDER;
}

export const ROLE_COLORS: Record<TalentRole, string> = {
  "Software Engineers": "bg-violet-500",
  Designers: "bg-pink-500",
  "Product Managers": "bg-blue-500",
  "Sales & Marketing": "bg-emerald-500",
  Operations: "bg-orange-500",
  Other: "bg-slate-400",
};
