"use client";

import React from "react";
import {
  Eye,
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
  getProductStatus,
} from "@/lib/formatters";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  alertThresholdDays?: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onMarkDepleted: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductTable({
  products,
  alertThresholdDays = 7,
  onEdit,
  onDelete,
  onAdjustQuantity,
  onMarkDepleted,
  onViewDetails,
}: ProductTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/70 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              <th className="py-3.5 pl-5 pr-3">Produto</th>
              <th className="py-3.5 px-3">Categoria</th>
              <th className="py-3.5 px-3">Local</th>
              <th className="py-3.5 px-3">Quantidade</th>
              <th className="py-3.5 px-3">Validade</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pl-3 pr-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-body-sm">
            {products.map((product) => {
              const status = getProductStatus(product, alertThresholdDays);
              const step =
                product.unit === "kg" ||
                product.unit === "L" ||
                product.unit === "dz"
                  ? 0.5
                  : 1;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-surface-secondary/40 transition-colors"
                >
                  <td className="py-3.5 pl-5 pr-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails(product)}
                      className="flex items-center gap-3 text-left group"
                    >
                      <ProductAvatar
                        name={product.name}
                        category={product.category}
                        size="sm"
                      />
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-forest">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Mín: {formatQuantity(product.minQuantity, product.unit)}
                        </p>
                      </div>
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-caption text-text-secondary">
                    {product.category}
                  </td>
                  <td className="py-3.5 px-3 text-caption text-text-secondary">
                    {product.location}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onAdjustQuantity(product.id, -step)}
                        disabled={product.quantity <= 0}
                        aria-label={`Diminuir quantidade de ${product.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[4.2rem] text-center font-semibold text-text-primary">
                        {formatQuantity(product.quantity, product.unit)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onAdjustQuantity(product.id, step)}
                        aria-label={`Aumentar quantidade de ${product.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="text-caption font-semibold text-text-primary">
                      {formatDateBR(product.expirationDate)}
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      {formatExpirationRelativeLabel(product.expirationDate)}
                    </p>
                  </td>
                  <td className="py-3.5 px-3">
                    <ProductStatusBadge status={status} />
                  </td>
                  <td className="py-3.5 pl-3 pr-5 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      {product.quantity > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onMarkDepleted(product.id)}
                          title="Marcar como sem estoque"
                          aria-label={`Marcar ${product.name} como sem estoque`}
                        >
                          <PackageX className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
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
                        title="Editar"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(product)}
                        title="Excluir"
                        aria-label={`Excluir ${product.name}`}
                        className="hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-border">
        {products.map((product) => {
          const status = getProductStatus(product, alertThresholdDays);
          const step =
            product.unit === "kg" ||
            product.unit === "L" ||
            product.unit === "dz"
              ? 0.5
              : 1;

          return (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onViewDetails(product)}
                  className="flex items-center gap-2.5 text-left min-w-0"
                >
                  <ProductAvatar
                    name={product.name}
                    category={product.category}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-body-sm text-text-primary truncate">
                      {product.name}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {product.category} • {product.location}
                    </p>
                  </div>
                </button>
                <ProductStatusBadge status={status} />
              </div>

              <div className="flex items-center justify-between text-caption">
                <div>
                  <span className="text-text-secondary">Validade: </span>
                  <span className="font-semibold text-text-primary">
                    {formatDateBR(product.expirationDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onAdjustQuantity(product.id, -step)}
                    disabled={product.quantity <= 0}
                    aria-label="Diminuir"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[3.8rem] text-center font-semibold text-text-primary">
                    {formatQuantity(product.quantity, product.unit)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onAdjustQuantity(product.id, step)}
                    aria-label="Aumentar"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-1">
                {product.quantity > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkDepleted(product.id)}
                  >
                    <PackageX className="h-3.5 w-3.5" />
                    Zerar
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product)}
                  className="text-danger hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
