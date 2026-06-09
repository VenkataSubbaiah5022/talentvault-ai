import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  IconBadge,
  type IconBadgeVariant,
} from "@/components/dashboard/icon-badge";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "insight";
}

export function DashboardCard({
  children,
  className,
  id,
  variant = "default",
}: DashboardCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex h-full min-h-[300px] flex-col rounded-[14px] border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        variant === "default" && "border-[#e8ecf3] dark:border-border dark:bg-card",
        variant === "insight" &&
          "border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white dark:border-indigo-500/20 dark:from-indigo-950/40 dark:to-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardCardHeader({
  title,
  description,
  href,
  linkLabel = "View all",
  icon,
  iconVariant = "violet",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  icon?: LucideIcon;
  iconVariant?: IconBadgeVariant;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon && <IconBadge icon={icon} variant={iconVariant} size="sm" />}
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#0f172a] dark:text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-[13px] leading-snug text-[#64748b] dark:text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-[12px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function DashboardEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-1 items-center justify-center py-8 text-center text-[13px] text-[#64748b] dark:text-muted-foreground">
      {children}
    </p>
  );
}
