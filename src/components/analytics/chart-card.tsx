import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description: string;
  badgeText?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  badgeText = "Dados Demonstrativos",
  children,
  footer,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("p-5 flex flex-col justify-between gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-card-title font-bold text-text-primary">
            {title}
          </h3>
          <p className="mt-0.5 text-caption text-text-secondary">
            {description}
          </p>
        </div>
        {badgeText ? (
          <Badge variant="muted" className="shrink-0">
            {badgeText}
          </Badge>
        ) : null}
      </div>

      <div className="w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>

      {footer ? (
        <div className="pt-3 border-t border-border text-caption text-text-secondary">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
