"use client";

import React, { useMemo, useState } from "react";
import {
  FilterX,
  LayoutGrid,
  List,
  Package,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { WasteRecordDialog } from "@/components/shared/waste-record-dialog";
import { ProductCard } from "@/components/inventory/product-card";
import { ProductTable } from "@/components/inventory/product-table";
import { ProductForm } from "@/components/inventory/product-form";
import { ProductDetailsModal } from "@/components/inventory/product-details-modal";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import {
  getDaysUntilExpiration,
  getProductStatus,
} from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";
import type { Product, ProductFormValues } from "@/types/product";
import { cn } from "@/lib/utils";

export function InventoryView() {
  const {
    products,
    preferences,
    globalSearchQuery,
    setGlobalSearchQuery,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustProductQuantity,
    markProductDepleted,
    addProductToShoppingListQuick,
  } = useDespensa();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [expirationFilter, setExpirationFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);
  const [disposalProduct, setDisposalProduct] = useState<Product | null>(null);
  const [disposalModalOpen, setDisposalModalOpen] = useState(false);

  const alertDays = preferences.alertDaysBeforeExpiration || 7;

  const detailsProduct = useMemo(
    () => products.find((p) => p.id === detailsProductId) ?? null,
    [products, detailsProductId]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const status = getProductStatus(product, alertDays);
      const daysUntil = getDaysUntilExpiration(product.expirationDate);

      if (globalSearchQuery.trim()) {
        const q = globalSearchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesLoc = product.location.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesLoc) return false;
      }

      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }

      if (stockFilter !== "all") {
        if (stockFilter === "available" && product.quantity <= product.minQuantity)
          return false;
        if (
          stockFilter === "low_stock" &&
          (product.quantity <= 0 || product.quantity > product.minQuantity)
        )
          return false;
        if (stockFilter === "out_of_stock" && status !== "out_of_stock")
          return false;
      }

      if (expirationFilter !== "all") {
        if (expirationFilter === "expired" && daysUntil >= 0) return false;
        if (
          expirationFilter === "expiring_soon" &&
          (daysUntil < 0 || daysUntil > alertDays)
        )
          return false;
        if (expirationFilter === "safe" && daysUntil <= alertDays) return false;
      }

      return true;
    });
  }, [
    products,
    globalSearchQuery,
    categoryFilter,
    stockFilter,
    expirationFilter,
    alertDays,
  ]);

  const hasActiveFilters =
    Boolean(globalSearchQuery.trim()) ||
    categoryFilter !== "all" ||
    stockFilter !== "all" ||
    expirationFilter !== "all";

  const clearFilters = () => {
    setGlobalSearchQuery("");
    setCategoryFilter("all");
    setStockFilter("all");
    setExpirationFilter("all");
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
    } else {
      addProduct(values);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu Estoque"
        description="Gerencie todos os alimentos armazenados na residência, acompanhe quantidades e controle prazos de validade."
        badge={
          <Badge variant="forest">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </Badge>
        }
        actions={
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Adicionar Produto
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
            <SearchInput
              value={globalSearchQuery}
              onChange={setGlobalSearchQuery}
              placeholder="Buscar por nome, categoria ou local..."
              label="Buscar produtos no estoque"
            />

            <FilterDropdown
              id="filter-category"
              label="Filtrar por categoria"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: "all", label: "Todas as Categorias" },
                ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />

            <FilterDropdown
              id="filter-stock-status"
              label="Filtrar por nível de estoque"
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { value: "all", label: "Todos os Níveis de Estoque" },
                { value: "available", label: "Estoque Adequado" },
                { value: "low_stock", label: "Estoque Baixo" },
                { value: "out_of_stock", label: "Sem Estoque (Zerado)" },
              ]}
            />

            <FilterDropdown
              id="filter-expiration-status"
              label="Filtrar por situação de validade"
              value={expirationFilter}
              onChange={setExpirationFilter}
              options={[
                { value: "all", label: "Todas as Validades" },
                {
                  value: "expiring_soon",
                  label: `Vencendo em Breve (≤ ${alertDays} dias)`,
                },
                { value: "expired", label: "Vencidos" },
                { value: "safe", label: "Seguros para Consumo" },
              ]}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 lg:pt-0">
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <FilterX className="h-3.5 w-3.5" />
                Limpar filtros
              </Button>
            ) : null}

            <div
              className="inline-flex items-center rounded-DEFAULT border border-border bg-surface-secondary p-0.5"
              role="group"
              aria-label="Modo de visualização"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label="Visualização em grade"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-caption font-medium transition-colors",
                  viewMode === "grid"
                    ? "bg-surface text-forest shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grade</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                aria-label="Visualização em lista"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-caption font-medium transition-colors",
                  viewMode === "list"
                    ? "bg-surface text-forest shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto encontrado"
          description={
            hasActiveFilters
              ? "Não encontramos itens que correspondam aos filtros selecionados. Tente limpar os filtros ou buscar por outro termo."
              : "Sua despensa ainda não possui produtos cadastrados. Comece adicionando os alimentos armazenados na residência."
          }
          action={
            hasActiveFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            ) : (
              <Button type="button" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                Adicionar Primeiro Produto
              </Button>
            )
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              alertThresholdDays={alertDays}
              onEdit={handleOpenEdit}
              onDelete={setDeletingProduct}
              onAdjustQuantity={adjustProductQuantity}
              onMarkDepleted={markProductDepleted}
              onViewDetails={(p) => setDetailsProductId(p.id)}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          alertThresholdDays={alertDays}
          onEdit={handleOpenEdit}
          onDelete={setDeletingProduct}
          onAdjustQuantity={adjustProductQuantity}
          onMarkDepleted={markProductDepleted}
          onViewDetails={(p) => setDetailsProductId(p.id)}
        />
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialProduct={editingProduct}
        onSubmitProduct={handleFormSubmit}
      />

      <ProductDetailsModal
        product={detailsProduct}
        open={Boolean(detailsProduct)}
        onOpenChange={(open) => {
          if (!open) setDetailsProductId(null);
        }}
        alertThresholdDays={alertDays}
        onEdit={handleOpenEdit}
        onAdjustQuantity={adjustProductQuantity}
        onMarkDepleted={markProductDepleted}
        onAddToShoppingList={addProductToShoppingListQuick}
        onRecordDisposal={(product) => {
          setDisposalProduct(product);
          setDisposalModalOpen(true);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
        title="Remover Produto do Estoque"
        description={
          deletingProduct
            ? `Tem certeza de que deseja remover "${deletingProduct.name}" do inventário da despensa?`
            : ""
        }
        confirmLabel="Sim, Remover"
        onConfirm={() => {
          if (deletingProduct) {
            deleteProduct(deletingProduct.id);
          }
        }}
      />

      <WasteRecordDialog
        open={disposalModalOpen}
        onOpenChange={setDisposalModalOpen}
        preselectedProduct={disposalProduct}
      />
    </div>
  );
}
