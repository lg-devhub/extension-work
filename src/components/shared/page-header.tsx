import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-heading text-page-title sm:text-page-title-lg text-text-primary">
            {title}
          </h1>
          {badge}
        </div>
        {description ? (
          <p className="text-body-sm text-text-secondary max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
