import React from "react";
import {
  ArrowRightLeft,
  PackageMinus,
  PackagePlus,
  RefreshCw,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import type { ActivityEvent, ActivityType } from "@/types/waste-record";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: ActivityEvent[];
  maxItems?: number;
}

export function ActivityTimeline({
  activities,
  maxItems = 5,
}: ActivityTimelineProps) {
  const visible = activities.slice(0, maxItems);

  const iconMap: Record<
    ActivityType,
    {
      Icon: React.ComponentType<{ className?: string }>;
      tone: string;
    }
  > = {
    product_added: {
      Icon: PackagePlus,
      tone: "bg-success-subtle text-success border-success/25",
    },
    quantity_updated: {
      Icon: RefreshCw,
      tone: "bg-info-subtle text-info border-info/25",
    },
    product_depleted: {
      Icon: PackageMinus,
      tone: "bg-warning-subtle text-[#9B6312] border-warning/35",
    },
    waste_recorded: {
      Icon: Trash2,
      tone: "bg-danger-subtle text-danger border-danger/25",
    },
    list_created: {
      Icon: ShoppingCart,
      tone: "bg-surface-secondary text-forest border-border",
    },
    list_imported: {
      Icon: ArrowRightLeft,
      tone: "bg-success-subtle text-forest border-success/25",
    },
  };

  if (visible.length === 0) {
    return (
      <p className="py-6 text-center text-caption text-text-secondary">
        Nenhuma atividade recente registrada.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4">
      {visible.map((event, idx) => {
        const config = iconMap[event.type] ?? iconMap.quantity_updated;
        const Icon = config.Icon;
        const isLast = idx === visible.length - 1;

        return (
          <li key={event.id} className="relative flex items-start gap-3">
            {!isLast ? (
              <span
                className="absolute left-4 top-8 -bottom-4 w-px bg-border"
                aria-hidden="true"
              />
            ) : null}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border",
                config.tone
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-caption font-semibold text-text-primary truncate">
                  {event.title}
                </p>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {event.timestamp}
                </span>
              </div>
              <p className="mt-0.5 text-caption text-text-secondary">
                {event.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
