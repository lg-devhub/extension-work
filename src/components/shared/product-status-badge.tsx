import React from "react";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_STATUS_LABELS } from "@/lib/constants";
import type { ProductStatus } from "@/types/product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

export function ProductStatusBadge({
  status,
  className,
}: ProductStatusBadgeProps) {
  const variantMap: Record<
    ProductStatus,
    "success" | "warning" | "danger" | "info" | "muted"
  > = {
    available: "success",
    low_stock: "info",
    expiring_soon: "warning",
    expired: "danger",
    out_of_stock: "muted",
  };

  const dotColorMap: Record<ProductStatus, string> = {
    available: "bg-success",
    low_stock: "bg-info",
    expiring_soon: "bg-warning",
    expired: "bg-danger",
    out_of_stock: "bg-text-muted",
  };

  return (
    <Badge variant={variantMap[status]} className={className}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotColorMap[status]}`}
        aria-hidden="true"
      />
      <span>{PRODUCT_STATUS_LABELS[status]}</span>
    </Badge>
  );
}
