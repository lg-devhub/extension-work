"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Plus,
  Scale,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProductAvatar } from "@/components/shared/product-avatar";
import { WasteRecordDialog } from "@/components/shared/waste-record-dialog";
import {
  DISPOSAL_REASON_LABELS,
  PRODUCT_CATEGORIES,
} from "@/lib/constants";
import {
  formatCurrencyBRL,
  formatDateBR,
  formatQuantity,
} from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";
import type { DisposalReason, WasteRecord } from "@/types/waste-record";

export function WasteHistoryView() {
  const { wasteRecords, deleteWasteRecord } = useDespensa();

  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<WasteRecord | null>(
    null
  );

  const filteredRecords = useMemo(() => {
    return wasteRecords.filter((rec) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.productName.toLowerCase().includes(q);
        const matchesNotes = rec.notes?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesNotes) return false;
      }
      if (reasonFilter !== "all" && rec.reason !== reasonFilter) return false;
      if (categoryFilter !== "all" && rec.category !== categoryFilter)
        return false;
      return true;
    });
  }, [wasteRecords, searchQuery, reasonFilter, categoryFilter]);

  const stats = useMemo(() => {
    const totalLossBRL = wasteRecords.reduce(
      (sum, r) => sum + r.estimatedLoss,
      0
    );
    const reasonCounts: Record<DisposalReason, number> = {
      expired: 0,
      spoiled: 0,
      excess_purchase: 0,
      other: 0,
    };
    wasteRecords.forEach((r) => {
      reasonCounts[r.reason] += 1;
    });

    const topReason = (Object.keys(reasonCounts) as DisposalReason[]).sort(
      (a, b) => reasonCounts[b] - reasonCounts[a]
    )[0];

    return {
      totalRecords: wasteRecords.length,
      totalLossBRL,
      expiredCount: reasonCounts.expired,
      topReasonLabel:
        wasteRecords.length > 0
          ? DISPOSAL_REASON_LABELS[topReason]
          : "Sem registros",
    };
  }, [wasteRecords]);

  const reasonBadgeVariant: Record<
    DisposalReason,
    "danger" | "warning" | "info" | "muted"
  > = {
    expired: "danger",
    spoiled: "warning",
    excess_purchase: "info",
    other: "muted",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Histórico de Descarte"
        description="Registre e revise os alimentos descartados na residência para identificar padrões de perda e reduzir o desperdício."
        actions={
          <Button
            type="button"
            variant="danger"
            onClick={() => setRecordDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Registrar Descarte
          </Button>
        }
      />

      <section
        aria-label="Indicadores do histórico de descarte"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Ocorrências Registradas"
          value={stats.totalRecords}
          subtitle="Histórico acumulado"
          icon={Trash2}
          tone="default"
        />
        <StatCard
          title="Custo Estimado Perdido"
          value={formatCurrencyBRL(stats.totalLossBRL)}
          subtitle="Soma financeira dos descartes"
          icon={DollarSign}
          tone="danger"
          badgeText="Impacto"
        />
        <StatCard
          title="Descartes por Validade"
          value={stats.expiredCount}
          subtitle="Produtos que venceram sem uso"
          icon={Calendar}
          tone="warning"
        />
        <StatCard
          title="Motivo Mais Frequente"
          value={stats.topReasonLabel}
          subtitle="Causa predominante identificada"
          icon={Scale}
          tone="info"
        />
      </section>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por produto ou observação..."
            label="Buscar no histórico de descarte"
          />

          <FilterDropdown
            id="waste-reason-filter"
            label="Filtrar por motivo de descarte"
            value={reasonFilter}
            onChange={setReasonFilter}
            options={[
              { value: "all", label: "Todos os Motivos" },
              {
                value: "expired",
                label: DISPOSAL_REASON_LABELS.expired,
              },
              {
                value: "spoiled",
                label: DISPOSAL_REASON_LABELS.spoiled,
              },
              {
                value: "excess_purchase",
                label: DISPOSAL_REASON_LABELS.excess_purchase,
              },
              { value: "other", label: DISPOSAL_REASON_LABELS.other },
            ]}
          />

          <FilterDropdown
            id="waste-category-filter"
            label="Filtrar por categoria"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: "all", label: "Todas as Categorias" },
              ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
      </Card>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="Nenhum registro de descarte encontrado"
          description="Não há ocorrências para os filtros selecionados. Sempre que um alimento precisar ser descartado, registre aqui para acompanhar suas metas."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => setRecordDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Registrar Descarte
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/70 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  <th className="py-3.5 pl-5 pr-3">Alimento Descartado</th>
                  <th className="py-3.5 px-3">Categoria</th>
                  <th className="py-3.5 px-3">Quantidade</th>
                  <th className="py-3.5 px-3">Data do Descarte</th>
                  <th className="py-3.5 px-3">Motivo</th>
                  <th className="py-3.5 px-3">Perda Est.</th>
                  <th className="py-3.5 pl-3 pr-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body-sm">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-surface-secondary/40 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <ProductAvatar
                          name={record.productName}
                          category={record.category}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-text-primary">
                            {record.productName}
                          </p>
                          {record.notes ? (
                            <p className="text-[11px] text-text-secondary max-w-xs truncate">
                              {record.notes}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-caption text-text-secondary">
                      {record.category}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-text-primary">
                      {formatQuantity(record.quantity, record.unit)}
                    </td>
                    <td className="py-3.5 px-3 text-caption text-text-secondary">
                      {formatDateBR(record.disposalDate)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={reasonBadgeVariant[record.reason]}>
                        {DISPOSAL_REASON_LABELS[record.reason]}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-danger">
                      {formatCurrencyBRL(record.estimatedLoss)}
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeletingRecord(record)}
                        aria-label={`Remover registro de ${record.productName}`}
                        className="hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProductAvatar
                      name={record.productName}
                      category={record.category}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-body-sm text-text-primary truncate">
                        {record.productName}
                      </p>
                      <p className="text-caption text-text-secondary">
                        {record.category} • {formatDateBR(record.disposalDate)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={reasonBadgeVariant[record.reason]}>
                    {DISPOSAL_REASON_LABELS[record.reason]}
                  </Badge>
                </div>

                {record.notes ? (
                  <p className="text-caption text-text-secondary">
                    {record.notes}
                  </p>
                ) : null}

                <div className="flex items-center justify-between pt-1 text-caption">
                  <span className="font-semibold text-text-primary">
                    Qtd.: {formatQuantity(record.quantity, record.unit)} (
                    <span className="text-danger">
                      {formatCurrencyBRL(record.estimatedLoss)}
                    </span>
                    )
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingRecord(record)}
                    className="text-danger hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <WasteRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
      />

      <ConfirmDialog
        open={Boolean(deletingRecord)}
        onOpenChange={(open) => {
          if (!open) setDeletingRecord(null);
        }}
        title="Excluir Registro de Descarte"
        description={
          deletingRecord
            ? `Deseja remover o registro de descarte de "${deletingRecord.productName}" do histórico?`
            : ""
        }
        confirmLabel="Excluir Registro"
        onConfirm={() => {
          if (deletingRecord) {
            deleteWasteRecord(deletingRecord.id);
          }
        }}
      />
    </div>
  );
}
