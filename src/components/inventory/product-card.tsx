"use client";

import React from "react";
import {
  Calendar,
  Eye,
  MapPin,
  Minus,
  PackageX,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductAvatar } from "@/components/shared/product-avatar";
import { ProductStatusBadge } from "@/components/shared/product-status-badge";
import {
  formatDateBR,
  formatExpirationRelativeLabel,
  formatQuantity,
  getDaysUntilExpiration,
  getProductStatus,
} from "@/lib/formatters";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  alertThresholdDays?: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onMarkDepleted: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({
  product,
  alertThresholdDays = 7,
  onEdit,
  onDelete,
  onAdjustQuantity,
  onMarkDepleted,
  onViewDetails,
}: ProductCardProps) {
  const status = getProductStatus(product, alertThresholdDays);
  const daysUntil = getDaysUntilExpiration(product.expirationDate);
  const step =
    product.unit === "kg" || product.unit === "L" || product.unit === "dz"
      ? 0.5
      : 1;

  return (
    <Card
      className={cn(
        "p-4 flex flex-col justify-between gap-4 transition-colors hover:border-sage",
        status === "out_of_stock" && "bg-surface-secondary/45",
        status === "expired" && "border-danger/35"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-3 text-left min-w-0 group focus-visible:outline-none"
          >
            <ProductAvatar name={product.name} category={product.category} />
            <div className="min-w-0">
              <h3 className="font-heading text-card-title font-semibold text-text-primary truncate group-hover:text-forest transition-colors">
                {product.name}
              </h3>
              <p className="text-caption text-text-secondary truncate">
                {product.category}
              </p>
            </div>
          </button>
          <ProductStatusBadge status={status} className="shrink-0" />
        </div>

        <div className="grid grid-cols-2 gap-2.5 rounded-DEFAULT bg-surface-secondary/65 p-3 border border-border/70">
          <div>
            <span className="text-[11px] font-medium text-text-secondary block">
              Disponível
            </span>
            <span
              className={cn(
                "mt-0.5 font-heading text-body font-bold block",
                product.quantity <= 0 ? "text-text-muted" : "text-text-primary"
              )}
            >
              {formatQuantity(product.quantity, product.unit)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-text-secondary block">
              Validade
            </span>
            <span
              className={cn(
                "mt-0.5 text-caption font-semibold flex items-center gap-1",
                daysUntil < 0 && product.quantity > 0
                  ? "text-danger"
                  : daysUntil <= 3 && product.quantity > 0
                  ? "text-[#9B6312]"
                  : "text-text-primary"
              )}
            >
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formatDateBR(product.expirationDate)}
            </span>
            <span className="text-[11px] text-text-secondary block truncate">
              {formatExpirationRelativeLabel(product.expirationDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-caption text-text-secondary px-0.5">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {product.location}
          </span>
          <span>Mín: {formatQuantity(product.minQuantity, product.unit)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onAdjustQuantity(product.id, -step)}
            disabled={product.quantity <= 0}
            aria-label={`Diminuir quantidade de ${product.name}`}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onAdjustQuantity(product.id, step)}
            aria-label={`Aumentar quantidade de ${product.name}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          {product.quantity > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onMarkDepleted(product.id)}
              title="Marcar como sem estoque"
              aria-label={`Marcar ${product.name} como esgotado`}
            >
              <PackageX className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewDetails(product)}
            title="Ver detalhes"
            aria-label={`Ver detalhes de ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(product)}
            title="Editar produto"
            aria-label={`Editar ${product.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(product)}
            title="Excluir produto"
            aria-label={`Excluir ${product.name}`}
            className="hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
