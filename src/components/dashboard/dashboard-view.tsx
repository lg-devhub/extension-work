"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Leaf,
  Package,
  PackageX,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ProductAvatar } from "@/components/shared/product-avatar";
import { ProductStatusBadge } from "@/components/shared/product-status-badge";
import { ExpirationAlertCard } from "@/components/alerts/expiration-alert-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { ProductForm } from "@/components/inventory/product-form";
import { CreateShoppingListDialog } from "@/components/shopping-lists/create-shopping-list-dialog";
import { WasteRecordDialog } from "@/components/shared/waste-record-dialog";
import { useDespensa } from "@/hooks/use-despensa";
import {
  formatCurrencyBRL,
  formatDateBR,
  formatFullCurrentDateBR,
  formatQuantity,
  getDaysUntilExpiration,
  getProductStatus,
} from "@/lib/formatters";
import type { Product } from "@/types/product";

export function DashboardView() {
  const {
    products,
    activities,
    preferences,
    currentSession,
    metrics,
    addProduct,
    markProductDepleted,
  } = useDespensa();

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [recordWasteOpen, setRecordWasteOpen] = useState(false);
  const [wastePreselected, setWastePreselected] = useState<Product | null>(
    null
  );

  const alertDays = preferences.alertDaysBeforeExpiration || 7;

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      .slice(0, 6);
  }, [products]);

  const urgentExpiringProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.quantity <= 0) return false;
        const days = getDaysUntilExpiration(p.expirationDate);
        return days <= alertDays;
      })
      .sort(
        (a, b) =>
          getDaysUntilExpiration(a.expirationDate) -
          getDaysUntilExpiration(b.expirationDate)
      )
      .slice(0, 5);
  }, [products, alertDays]);

  const displayName = currentSession?.name ?? preferences.userName;
  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6 bg-surface border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-caption font-medium text-primary">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatFullCurrentDateBR()}</span>
            </div>
            <h1 className="font-heading text-page-title sm:text-page-title-lg text-text-primary">
              Olá, {firstName}. Bem-vindo(a) ao Despensa+
            </h1>
            <p className="text-body-sm text-text-secondary max-w-2xl">
              Monitore os alimentos armazenados em{" "}
              <span className="font-medium text-text-primary">
                {preferences.householdName}
              </span>
              , acompanhe prazos de validade e organize suas compras com zero desperdício.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
            <Button
              type="button"
              onClick={() => setAddProductOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateListOpen(true)}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4" />
              Criar Lista de Compras
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setWastePreselected(null);
                setRecordWasteOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 text-danger" />
              Registrar Descarte
            </Button>
          </div>
        </div>
      </Card>

      <section
        aria-label="Indicadores principais da despensa"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total de Produtos"
          value={metrics.totalProducts}
          subtitle={`Valor est.: ${formatCurrencyBRL(
            metrics.totalInventoryValueBRL
          )}`}
          icon={Package}
          tone="default"
          badgeText="Cadastrados"
        />
        <StatCard
          title="Vencendo em Breve"
          value={metrics.expiringSoonCount}
          subtitle={
            metrics.expiredCount > 0
              ? `${metrics.expiredCount} já vencidos exigem atenção`
              : `Nos próximos ${alertDays} dias`
          }
          icon={AlertTriangle}
          tone={metrics.expiringSoonCount > 0 ? "warning" : "success"}
          badgeText={metrics.expiringSoonCount > 0 ? "Atenção" : "Em dia"}
        />
        <StatCard
          title="Sem Estoque"
          value={metrics.outOfStockCount}
          subtitle={`${metrics.lowStockCount} com estoque baixo`}
          icon={PackageX}
          tone={metrics.outOfStockCount > 0 ? "danger" : "info"}
          badgeText={metrics.outOfStockCount > 0 ? "Repor" : "Abastecido"}
        />
        <StatCard
          title="Redução de Desperdício"
          value={`${metrics.wasteReductionPct}%`}
          subtitle={`Meta doméstica: ${preferences.monthlyWasteReductionGoalPct}%`}
          icon={Leaf}
          tone="success"
          badgeText="Sustentável"
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
              <div>
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Visão Geral do Estoque
                </h2>
                <p className="text-caption text-text-secondary">
                  Produtos adicionados ou atualizados recentemente na despensa.
                </p>
              </div>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-forest"
              >
                Ver estoque completo
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="hidden sm:block overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    <th className="py-2.5 pr-3">Produto</th>
                    <th className="py-2.5 px-3">Qtd.</th>
                    <th className="py-2.5 px-3">Validade</th>
                    <th className="py-2.5 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-body-sm">
                  {recentProducts.map((product) => {
                    const status = getProductStatus(product, alertDays);
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-surface-secondary/45 transition-colors"
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <ProductAvatar
                              name={product.name}
                              category={product.category}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-text-primary truncate">
                                {product.name}
                              </p>
                              <p className="text-caption text-text-secondary">
                                {product.category} • {product.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-text-primary whitespace-nowrap">
                          {formatQuantity(product.quantity, product.unit)}
                        </td>
                        <td className="py-3 px-3 text-caption text-text-secondary whitespace-nowrap">
                          {formatDateBR(product.expirationDate)}
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                          <ProductStatusBadge status={status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-border pt-2">
              {recentProducts.map((product) => {
                const status = getProductStatus(product, alertDays);
                return (
                  <div
                    key={product.id}
                    className="py-3 flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ProductAvatar
                        name={product.name}
                        category={product.category}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-text-primary truncate">
                          {product.name}
                        </p>
                        <p className="text-caption text-text-secondary">
                          {formatQuantity(product.quantity, product.unit)} •{" "}
                          {formatDateBR(product.expirationDate)}
                        </p>
                      </div>
                    </div>
                    <ProductStatusBadge
                      status={status}
                      className="shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-border">
              <div>
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Ações Rápidas da Residência
                </h2>
                <p className="text-caption text-text-secondary">
                  Atalhos diretos para as tarefas mais frequentes do dia a dia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAddProductOpen(true)}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface-secondary/50 p-4 text-left transition-colors hover:border-primary hover:bg-surface-secondary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-DEFAULT bg-forest text-white">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading text-body-sm font-bold text-text-primary">
                    Adicionar Produto
                  </p>
                  <p className="mt-0.5 text-caption text-text-secondary">
                    Registre novos itens na despensa ou geladeira.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCreateListOpen(true)}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface-secondary/50 p-4 text-left transition-colors hover:border-primary hover:bg-surface-secondary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-DEFAULT bg-primary text-white">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading text-body-sm font-bold text-text-primary">
                    Criar Lista de Compras
                  </p>
                  <p className="mt-0.5 text-caption text-text-secondary">
                    Monte sua lista com itens em falta.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWastePreselected(null);
                  setRecordWasteOpen(true);
                }}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface-secondary/50 p-4 text-left transition-colors hover:border-danger/50 hover:bg-danger-subtle/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-DEFAULT bg-danger-subtle text-danger border border-danger/25">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading text-body-sm font-bold text-text-primary">
                    Registrar Descarte
                  </p>
                  <p className="mt-0.5 text-caption text-text-secondary">
                    Anote perdas para melhorar o consumo.
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Alertas de Validade
                </h2>
                {urgentExpiringProducts.length > 0 ? (
                  <Badge variant="warning">
                    {urgentExpiringProducts.length} prioritários
                  </Badge>
                ) : null}
              </div>
              <Link
                href="/expiration-alerts"
                className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:text-forest"
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="pt-4 space-y-2.5">
              {urgentExpiringProducts.length === 0 ? (
                <p className="py-6 text-center text-caption text-text-secondary">
                  Excelente! Nenhum produto próximo do vencimento nos próximos{" "}
                  {alertDays} dias.
                </p>
              ) : (
                urgentExpiringProducts.map((product) => (
                  <ExpirationAlertCard
                    key={product.id}
                    product={product}
                    compact
                    onMarkConsumed={markProductDepleted}
                    onRecordDisposal={(prod) => {
                      setWastePreselected(prod);
                      setRecordWasteOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-border">
              <div>
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Atividade Recente
                </h2>
                <p className="text-caption text-text-secondary">
                  Últimas movimentações registradas na despensa.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <ActivityTimeline activities={activities} maxItems={5} />
            </div>
          </Card>
        </div>
      </div>

      <ProductForm
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSubmitProduct={(values) => addProduct(values)}
      />

      <CreateShoppingListDialog
        open={createListOpen}
        onOpenChange={setCreateListOpen}
      />

      <WasteRecordDialog
        open={recordWasteOpen}
        onOpenChange={setRecordWasteOpen}
        preselectedProduct={wastePreselected}
      />
    </div>
  );
}
