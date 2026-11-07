import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  badgeText?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "default",
  badgeText,
  className,
}: StatCardProps) {
  const iconToneClasses = {
    default: "bg-surface-secondary text-forest border-border",
    success: "bg-success-subtle text-success border-success/25",
    warning: "bg-warning-subtle text-[#9B6312] border-warning/35",
    danger: "bg-danger-subtle text-danger border-danger/25",
    info: "bg-info-subtle text-info border-info/25",
  };

  const badgeToneClasses = {
    default: "bg-surface-secondary text-text-secondary",
    success: "bg-success-subtle text-success",
    warning: "bg-warning-subtle text-[#9B6312]",
    danger: "bg-danger-subtle text-danger",
    info: "bg-info-subtle text-info",
  };

  return (
    <Card
      className={cn(
        "p-5 transition-colors hover:border-sage/70 flex flex-col justify-between gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption font-medium text-text-secondary">
            {title}
          </p>
          <p className="mt-1.5 font-heading text-2xl sm:text-[1.75rem] font-bold text-text-primary leading-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT border",
            iconToneClasses[tone]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
        <span className="text-caption text-text-secondary truncate">
          {subtitle}
        </span>
        {badgeText ? (
          <span
            className={cn(
              "shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-semibold",
              badgeToneClasses[tone]
            )}
          >
            {badgeText}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
