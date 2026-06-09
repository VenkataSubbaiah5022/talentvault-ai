"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const candidateSubNav = [
  { href: "/search-talent", label: "Search Talent", icon: Search },
  { href: "/candidates", label: "All Candidates", icon: Users },
];

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  nested,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors",
        nested && "pl-9",
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

function CandidatesNavGroup({ pathname }: { pathname: string }) {
  const isCandidatesSection =
    pathname.startsWith("/search-talent") || pathname.startsWith("/candidates");
  const [expanded, setExpanded] = useState(isCandidatesSection);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors",
          isCandidatesSection
            ? "bg-white/[0.08] text-white"
            : "text-indigo-200/75 hover:bg-white/[0.06] hover:text-white",
        )}
      >
        <Users className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
        <span className="flex-1 text-left">Candidates</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-70 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded && (
        <div className="mt-0.5 space-y-0.5">
          {candidateSubNav.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              active={pathname === item.href}
              nested
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

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

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
        <SidebarLink
          href="/"
          label="Dashboard"
          icon={LayoutDashboard}
          active={pathname === "/"}
        />
        <CandidatesNavGroup pathname={pathname} />
        <SidebarLink
          href="/upload"
          label="Upload Resumes"
          icon={Upload}
          active={pathname.startsWith("/upload")}
        />
        <SidebarLink
          href="/settings"
          label="Settings"
          icon={Settings}
          active={pathname.startsWith("/settings")}
        />
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <div className="flex justify-end px-1">
          <ThemeToggle className="text-indigo-200 hover:bg-white/10 hover:text-white" />
        </div>
      </div>
    </aside>
  );
}
