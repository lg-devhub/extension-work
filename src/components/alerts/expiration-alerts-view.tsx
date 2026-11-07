"use client";

import React, { useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SearchInput } from "@/components/shared/search-input";
import { ExpirationAlertCard } from "@/components/alerts/expiration-alert-card";
import { WasteRecordDialog } from "@/components/shared/waste-record-dialog";
import { EXPIRATION_CATEGORY_META } from "@/lib/constants";
import {
  getDaysUntilExpiration,
  getExpirationCategory,
} from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";
import type { ExpirationCategory, Product } from "@/types/product";
import { cn } from "@/lib/utils";

const ORDERED_CATEGORIES: ExpirationCategory[] = [
  "expired",
  "expiring_today",
  "within_3_days",
  "within_7_days",
  "safe",
];

export function ExpirationAlertsView() {
  const { products, markProductDepleted } = useDespensa();
  const [selectedTab, setSelectedTab] = useState<ExpirationCategory | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [disposalProduct, setDisposalProduct] = useState<Product | null>(null);
  const [disposalModalOpen, setDisposalModalOpen] = useState(false);

  const stockedProducts = useMemo(() => {
    return products
      .filter((p) => p.quantity > 0)
      .sort(
        (a, b) =>
          getDaysUntilExpiration(a.expirationDate) -
          getDaysUntilExpiration(b.expirationDate)
      );
  }, [products]);

  const groupedByExpiration = useMemo(() => {
    const groups: Record<ExpirationCategory, Product[]> = {
      expired: [],
      expiring_today: [],
      within_3_days: [],
      within_7_days: [],
      safe: [],
    };

    stockedProducts.forEach((product) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !product.name.toLowerCase().includes(q) &&
          !product.category.toLowerCase().includes(q)
        ) {
          return;
        }
      }
      const cat = getExpirationCategory(product.expirationDate);
      groups[cat].push(product);
    });

    return groups;
  }, [stockedProducts, searchQuery]);

  const visibleCategories =
    selectedTab === "all" ? ORDERED_CATEGORIES : [selectedTab];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas de Validade"
        description="Monitore rigorosamente os prazos de validade dos alimentos em estoque para priorizar o consumo e evitar perdas."
      />

      <section
        aria-label="Resumo por faixa de vencimento"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
      >
        <StatCard
          title="Vencidos"
          value={groupedByExpiration.expired.length}
          subtitle="Prazo expirado"
          icon={AlertOctagon}
          tone="danger"
          badgeText="Crítico"
        />
        <StatCard
          title="Vencendo Hoje"
          value={groupedByExpiration.expiring_today.length}
          subtitle="Expira na data atual"
          icon={AlertTriangle}
          tone="danger"
          badgeText="Hoje"
        />
        <StatCard
          title="Em até 3 Dias"
          value={groupedByExpiration.within_3_days.length}
          subtitle="Consumo prioritário"
          icon={CalendarClock}
          tone="warning"
          badgeText="Urgente"
        />
        <StatCard
          title="Em até 7 Dias"
          value={groupedByExpiration.within_7_days.length}
          subtitle="Planejar na semana"
          icon={CalendarClock}
          tone="info"
          badgeText="Semana"
        />
        <StatCard
          title="Seguros (> 7 dias)"
          value={groupedByExpiration.safe.length}
          subtitle="Dentro da validade"
          icon={ShieldCheck}
          tone="success"
          badgeText="Seguro"
        />
      </section>

      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Filtrar por faixa de validade"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "all"}
            onClick={() => setSelectedTab("all")}
            className={cn(
              "rounded-DEFAULT px-3 py-1.5 text-caption font-semibold transition-colors",
              selectedTab === "all"
                ? "bg-forest text-white"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            )}
          >
            Todas as Faixas ({stockedProducts.length})
          </button>

          {ORDERED_CATEGORIES.map((cat) => {
            const meta = EXPIRATION_CATEGORY_META[cat];
            const count = groupedByExpiration[cat].length;
            const isSelected = selectedTab === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTab(cat)}
                className={cn(
                  "rounded-DEFAULT px-3 py-1.5 text-caption font-medium transition-colors",
                  isSelected
                    ? "bg-forest text-white font-semibold"
                    : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                )}
              >
                {meta.title} ({count})
              </button>
            );
          })}
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filtrar produto por nome..."
          label="Buscar produto nos alertas"
          className="w-full md:w-64"
        />
      </Card>

      <div className="space-y-6">
        {visibleCategories.map((cat) => {
          const meta = EXPIRATION_CATEGORY_META[cat];
          const items = groupedByExpiration[cat];

          return (
            <section
              key={cat}
              aria-labelledby={`heading-${cat}`}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-2.5">
                <div className="flex items-center gap-2.5">
                  <h2
                    id={`heading-${cat}`}
                    className="font-heading text-section-title font-bold text-text-primary"
                  >
                    {meta.title}
                  </h2>
                  <Badge variant={meta.tone}>
                    {items.length} {items.length === 1 ? "item" : "itens"}
                  </Badge>
                </div>
                <p className="text-caption text-text-secondary">
                  {meta.subtitle}
                </p>
              </div>

              {items.length === 0 ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-surface/60 px-4 py-5 text-caption text-text-secondary">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>
                    Nenhum produto enquadrado na categoria &ldquo;{meta.title}&rdquo; no momento.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((product) => (
                    <ExpirationAlertCard
                      key={product.id}
                      product={product}
                      onMarkConsumed={markProductDepleted}
                      onRecordDisposal={(prod) => {
                        setDisposalProduct(prod);
                        setDisposalModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <WasteRecordDialog
        open={disposalModalOpen}
        onOpenChange={setDisposalModalOpen}
        preselectedProduct={disposalProduct}
      />
    </div>
  );
}
