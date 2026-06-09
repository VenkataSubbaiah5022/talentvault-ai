"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  LayoutDashboard,
  MapPin,
  Search,
  Settings,
  Sparkles,
  Upload,
  Users,
  Wrench,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/upload", label: "Upload Resumes", icon: Upload },
  { href: "/candidates", label: "Search Talent", icon: Search },
];

const secondaryNav = [
  { href: "/candidates?skill=react", label: "Skills", icon: Wrench },
  { href: "/candidates", label: "Locations", icon: MapPin },
  { href: "/", label: "Reports", icon: BarChart3 },
  { href: "/#ai-insights", label: "AI Insights", icon: Brain },
  { href: "/", label: "Settings", icon: Settings },
];

function isNavActive(pathname: string, href: string, label: string): boolean {
  if (
    label === "Dashboard" ||
    label === "Reports" ||
    label === "AI Insights" ||
    label === "Settings"
  ) {
    return pathname === "/" && label === "Dashboard";
  }
  if (label === "Upload Resumes") return pathname.startsWith("/upload");
  if (label === "Candidates") return pathname.startsWith("/candidates");
  if (label === "Search Talent") return false;
  if (label === "Skills" || label === "Locations") {
    return pathname.startsWith("/candidates");
  }
  return pathname === href.split("?")[0];
}

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href, label);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-[#6366f1] text-white shadow-sm"
          : "text-indigo-200/75 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[var(--sidebar-bg)] text-white">
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-[18px]">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#6366f1]">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[14px] font-semibold tracking-tight">TalentVault AI</p>
          <p className="text-[11px] font-normal text-indigo-300/60">
            Talent pool search
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>
        <div className="space-y-0.5">
          {secondaryNav.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/30 text-[11px] font-semibold">
              TV
            </div>
            <div>
              <p className="text-[13px] font-medium">Your Vault</p>
              <p className="text-[11px] text-indigo-300/60">Recruiter</p>
            </div>
          </div>
          <ThemeToggle className="text-indigo-200 hover:bg-white/10 hover:text-white" />
        </div>
      </div>
    </aside>
  );
}
