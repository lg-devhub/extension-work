import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-0.5 text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-secondary text-text-primary border border-border",
        forest: "bg-forest/10 text-forest border border-forest/20",
        success: "bg-success-subtle text-success border border-success/25",
        warning: "bg-warning-subtle text-[#9B6312] border border-warning/35",
        danger: "bg-danger-subtle text-danger border border-danger/25",
        info: "bg-info-subtle text-info border border-info/25",
        muted: "bg-surface-secondary text-text-secondary border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
