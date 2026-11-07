"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Minus,
  PackageX,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { ModalDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductAvatar } from "@/components/shared/product-avatar";
import { ProductStatusBadge } from "@/components/shared/product-status-badge";
import {
  formatCurrencyBRL,
  formatDateBR,
  formatExpirationRelativeLabel,
  formatQuantity,
  getProductStatus,
} from "@/lib/formatters";
import type { Product } from "@/types/product";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertThresholdDays?: number;
  onEdit: (product: Product) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onMarkDepleted: (id: string) => void;
  onAddToShoppingList: (product: Product) => void;
  onRecordDisposal: (product: Product) => void;
}

export function ProductDetailsModal({
  product,
  open,
  onOpenChange,
  alertThresholdDays = 7,
  onEdit,
  onAdjustQuantity,
  onMarkDepleted,
  onAddToShoppingList,
  onRecordDisposal,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const status = getProductStatus(product, alertThresholdDays);
  const step =
    product.unit === "kg" || product.unit === "L" || product.unit === "dz"
      ? 0.5
      : 1;

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Produto"
      description="Consulte informações completas e realize ajustes rápidos de estoque."
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <ProductAvatar
              name={product.name}
              category={product.category}
              size="lg"
            />
            <div>
              <h3 className="font-heading text-card-title font-bold text-text-primary">
                {product.name}
              </h3>
              <p className="text-caption text-text-secondary">
                {product.category}
              </p>
            </div>
          </div>
          <ProductStatusBadge status={status} />
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface-secondary/50 p-4">
          <div>
            <span className="text-caption text-text-secondary block">
              Quantidade Atual
            </span>
            <span className="mt-0.5 font-heading text-lg font-bold text-text-primary block">
              {formatQuantity(product.quantity, product.unit)}
            </span>
            <span className="text-[11px] text-text-muted">
              Mínimo ideal: {formatQuantity(product.minQuantity, product.unit)}
            </span>
          </div>

          <div>
            <span className="text-caption text-text-secondary block">
              Prazo de Validade
            </span>
            <span className="mt-0.5 font-heading text-body font-bold text-text-primary flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDateBR(product.expirationDate)}
            </span>
            <span className="text-[11px] font-medium text-text-secondary">
              {formatExpirationRelativeLabel(product.expirationDate)}
            </span>
          </div>

          <div>
            <span className="text-caption text-text-secondary block">
              Armazenamento
            </span>
            <span className="mt-0.5 text-body-sm font-semibold text-text-primary flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {product.location}
            </span>
          </div>

          <div>
            <span className="text-caption text-text-secondary block">
              Valor Estimado Total
            </span>
            <span className="mt-0.5 text-body-sm font-semibold text-text-primary block">
              {formatCurrencyBRL(
                Math.max(0, product.quantity) * product.estimatedPrice
              )}
            </span>
            <span className="text-[11px] text-text-muted">
              ({formatCurrencyBRL(product.estimatedPrice)} / {product.unit})
            </span>
          </div>
        </div>

        {product.notes ? (
          <div className="rounded-DEFAULT border border-border bg-surface p-3.5">
            <p className="text-caption font-semibold text-text-primary">
              Observações de Conservação
            </p>
            <p className="mt-1 text-caption text-text-secondary">
              {product.notes}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-DEFAULT border border-border bg-surface p-3">
          <span className="text-caption font-medium text-text-primary">
            Ajustar quantidade rapidamente
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onAdjustQuantity(product.id, -step)}
              disabled={product.quantity <= 0}
              aria-label="Reduzir quantidade"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="min-w-[4.5rem] text-center text-body-sm font-semibold text-text-primary">
              {formatQuantity(product.quantity, product.unit)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onAdjustQuantity(product.id, step)}
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onEdit(product);
            }}
          >
            <Pencil className="h-4 w-4" />
            Editar Produto
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onAddToShoppingList(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Enviar para Lista
          </Button>

          {product.quantity > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onMarkDepleted(product.id);
              }}
            >
              <PackageX className="h-4 w-4" />
              Marcar como Esgotado
            </Button>
          ) : null}

          <Button
            type="button"
            variant="danger-outline"
            onClick={() => {
              onOpenChange(false);
              onRecordDisposal(product);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Registrar Descarte
          </Button>
        </div>
      </div>
    </ModalDialog>
  );
}
