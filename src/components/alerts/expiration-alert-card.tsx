"use client";

import React from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductAvatar } from "@/components/shared/product-avatar";
import { EXPIRATION_CATEGORY_META } from "@/lib/constants";
import {
  formatDateBR,
  formatExpirationRelativeLabel,
  formatQuantity,
  getExpirationCategory,
} from "@/lib/formatters";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ExpirationAlertCardProps {
  product: Product;
  compact?: boolean;
  onMarkConsumed?: (productId: string) => void;
  onRecordDisposal?: (product: Product) => void;
}

export function ExpirationAlertCard({
  product,
  compact = false,
  onMarkConsumed,
  onRecordDisposal,
}: ExpirationAlertCardProps) {
  const category = getExpirationCategory(product.expirationDate);
  const meta = EXPIRATION_CATEGORY_META[category];

  const borderTone =
    meta.tone === "danger"
      ? "border-danger/35 bg-danger-subtle/30"
      : meta.tone === "warning"
      ? "border-warning/40 bg-warning-subtle/30"
      : meta.tone === "info"
      ? "border-info/30 bg-surface"
      : "border-border bg-surface";

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-DEFAULT border p-3 transition-colors",
          borderTone
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <ProductAvatar
            name={product.name}
            category={product.category}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-text-primary truncate">
              {product.name}
            </p>
            <p className="text-caption text-text-secondary truncate">
              {formatQuantity(product.quantity, product.unit)} •{" "}
              {formatDateBR(product.expirationDate)}
            </p>
          </div>
        </div>

        <Badge variant={meta.tone} className="shrink-0">
          {formatExpirationRelativeLabel(product.expirationDate)}
        </Badge>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 flex flex-col justify-between gap-3.5 transition-colors",
        borderTone
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ProductAvatar name={product.name} category={product.category} />
          <div className="min-w-0">
            <h3 className="font-heading text-card-title font-semibold text-text-primary truncate">
              {product.name}
            </h3>
            <p className="text-caption text-text-secondary">
              {product.category} •{" "}
              <span className="font-medium text-text-primary">
                {formatQuantity(product.quantity, product.unit)}
              </span>
            </p>
          </div>
        </div>
        <Badge variant={meta.tone} className="shrink-0">
          {meta.tone === "danger" ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {meta.badgeLabel}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-surface/85 px-3 py-2 border border-border/70 text-caption">
        <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Validade: {formatDateBR(product.expirationDate)}
        </span>
        <span
          className={cn(
            "font-semibold",
            meta.tone === "danger"
              ? "text-danger"
              : meta.tone === "warning"
              ? "text-[#9B6312]"
              : "text-text-secondary"
          )}
        >
          {formatExpirationRelativeLabel(product.expirationDate)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="inline-flex items-center gap-1 text-caption text-text-secondary">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {product.location}
        </span>

        <div className="flex items-center gap-1.5">
          {onMarkConsumed && product.quantity > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onMarkConsumed(product.id)}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              Consumido
            </Button>
          ) : null}
          {onRecordDisposal ? (
            <Button
              type="button"
              variant={meta.tone === "danger" ? "danger" : "danger-outline"}
              size="sm"
              onClick={() => onRecordDisposal(product)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Descartar
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
