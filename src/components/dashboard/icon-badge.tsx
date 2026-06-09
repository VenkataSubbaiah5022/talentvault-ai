import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconBadgeVariant =
  | "violet"
  | "emerald"
  | "blue"
  | "orange"
  | "pink"
  | "cyan"
  | "rose"
  | "amber"
  | "indigo";

const STYLES: Record<
  IconBadgeVariant,
  { gradient: string; shadow: string; glow: string }
> = {
  violet: {
    gradient: "from-violet-500 to-indigo-600",
    shadow: "shadow-violet-500/25",
    glow: "from-violet-400/60 to-indigo-500/40",
  },
  indigo: {
    gradient: "from-indigo-500 to-violet-600",
    shadow: "shadow-indigo-500/25",
    glow: "from-indigo-400/60 to-violet-500/40",
  },
  emerald: {
    gradient: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-500/25",
    glow: "from-emerald-400/60 to-teal-500/40",
  },
  blue: {
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/25",
    glow: "from-blue-400/60 to-cyan-500/40",
  },
  orange: {
    gradient: "from-orange-400 to-amber-600",
    shadow: "shadow-orange-500/25",
    glow: "from-orange-400/60 to-amber-500/40",
  },
  pink: {
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/25",
    glow: "from-pink-400/60 to-rose-500/40",
  },
  cyan: {
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/25",
    glow: "from-cyan-400/60 to-blue-500/40",
  },
  rose: {
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/25",
    glow: "from-rose-400/60 to-pink-500/40",
  },
  amber: {
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-500/25",
    glow: "from-amber-400/60 to-orange-500/40",
  },
};

const SIZES = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", rounded: "rounded-[10px]" },
  md: { box: "h-11 w-11", icon: "h-5 w-5", rounded: "rounded-[12px]" },
  lg: { box: "h-12 w-12", icon: "h-[22px] w-[22px]", rounded: "rounded-[14px]" },
};

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: IconBadgeVariant;
  size?: keyof typeof SIZES;
  className?: string;
}

export function IconBadge({
  icon: Icon,
  variant = "violet",
  size = "md",
  className,
}: IconBadgeProps) {
  const style = STYLES[variant];
  const dim = SIZES[size];

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 blur-md",
          dim.rounded,
          style.glow,
        )}
      />
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br shadow-lg",
          dim.box,
          dim.rounded,
          style.gradient,
          style.shadow,
        )}
      >
        <Icon className={cn(dim.icon, "text-white")} strokeWidth={2.25} />
      </div>
    </div>
  );
}

interface IconActionProps {
  icon: LucideIcon;
  variant?: IconBadgeVariant | "ghost";
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function IconActionButton({
  icon: Icon,
  variant = "ghost",
  label,
  className,
  ...props
}: IconActionProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        aria-label={label}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e8ecf3] bg-white text-[#64748b]",
          "shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md",
          "dark:border-border dark:bg-card",
          className,
        )}
        {...props}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
    );
  }

  const style = STYLES[variant];

  return (
    <button
      type="button"
      aria-label={label}
      className={cn("relative shrink-0", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[12px] bg-gradient-to-br opacity-40 blur-md",
          style.glow,
        )}
      />
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br shadow-lg",
          style.gradient,
          style.shadow,
        )}
      >
        <Icon className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
      </div>
    </button>
  );
}

interface InsightRowIconProps {
  icon: LucideIcon;
  variant: IconBadgeVariant;
}

export function InsightRowIcon({ icon: Icon, variant }: InsightRowIconProps) {
  const style = STYLES[variant];

  return (
    <div
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm",
        style.gradient,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
    </div>
  );
}
