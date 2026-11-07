"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Plus,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { FilterDropdown } from "@/components/shared/filter-dropdown";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ShoppingListCard } from "@/components/shopping-lists/shopping-list-card";
import { CreateShoppingListDialog } from "@/components/shopping-lists/create-shopping-list-dialog";
import {
  formatCurrencyBRL,
  formatQuantity,
  getProductStatus,
} from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";

export function ShoppingListsView() {
  const {
    shoppingLists,
    products,
    preferences,
    deleteShoppingList,
    addItemToShoppingList,
    updateShoppingListItem,
    removeShoppingListItem,
    toggleShoppingListItemPurchased,
    convertPurchasedItemsToInventory,
    addProductToShoppingListQuick,
  } = useDespensa();

  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deletingListId, setDeletingListId] = useState<string | null>(null);

  const alertDays = preferences.alertDaysBeforeExpiration || 7;

  const restockSuggestions = useMemo(() => {
    return products.filter((p) => {
      const status = getProductStatus(p, alertDays);
      return status === "out_of_stock" || status === "low_stock";
    });
  }, [products, alertDays]);

  const filteredLists = useMemo(() => {
    if (statusFilter === "all") return shoppingLists;
    return shoppingLists.filter((list) => list.status === statusFilter);
  }, [shoppingLists, statusFilter]);

  const summary = useMemo(() => {
    let totalItems = 0;
    let purchasedReadyToImport = 0;
    let totalEstimatedBRL = 0;

    shoppingLists.forEach((list) => {
      list.items.forEach((item) => {
        totalItems += 1;
        totalEstimatedBRL += item.quantity * item.estimatedPrice;
        if (item.purchased && !item.addedToInventory) {
          purchasedReadyToImport += 1;
        }
      });
    });

    return {
      totalLists: shoppingLists.length,
      totalItems,
      purchasedReadyToImport,
      totalEstimatedBRL,
    };
  }, [shoppingLists]);

  const deletingList = shoppingLists.find((l) => l.id === deletingListId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listas de Compras"
        description="Planeje suas idas ao mercado, acompanhe o progresso de compra e converta itens adquiridos diretamente para o estoque da despensa."
        actions={
          <Button
            type="button"
            onClick={() => setCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nova Lista de Compras
          </Button>
        }
      />

      <section
        aria-label="Resumo das listas de compras"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Listas Cadastradas"
          value={summary.totalLists}
          subtitle={`${summary.totalItems} itens no total`}
          icon={ClipboardList}
          tone="default"
        />
        <StatCard
          title="Prontos para Estoque"
          value={summary.purchasedReadyToImport}
          subtitle="Itens comprados aguardando conversão"
          icon={PackageCheck}
          tone={summary.purchasedReadyToImport > 0 ? "success" : "default"}
          badgeText={
            summary.purchasedReadyToImport > 0 ? "Converter" : "Sincronizado"
          }
        />
        <StatCard
          title="Sugestões de Reposição"
          value={restockSuggestions.length}
          subtitle="Produtos zerados ou com estoque baixo"
          icon={Sparkles}
          tone={restockSuggestions.length > 0 ? "warning" : "info"}
        />
        <StatCard
          title="Orçamento Planejado"
          value={formatCurrencyBRL(summary.totalEstimatedBRL)}
          subtitle="Soma estimada das listas"
          icon={ShoppingCart}
          tone="info"
        />
      </section>

      {restockSuggestions.length > 0 ? (
        <Card className="p-4 sm:p-5 bg-surface border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-card-title font-bold text-text-primary">
                Sugestões Inteligentes de Reposição
              </h2>
              <Badge variant="warning">
                {restockSuggestions.length}{" "}
                {restockSuggestions.length === 1 ? "item" : "itens"}
              </Badge>
            </div>
            <span className="text-caption text-text-secondary">
              Baseado nos produtos sem estoque ou abaixo do mínimo na despensa
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {restockSuggestions.map((prod) => (
              <div
                key={prod.id}
                className="inline-flex items-center gap-2.5 rounded-DEFAULT border border-border bg-surface-secondary/60 px-3 py-2"
              >
                <div>
                  <p className="text-caption font-semibold text-text-primary">
                    {prod.name}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Saldo atual: {formatQuantity(prod.quantity, prod.unit)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addProductToShoppingListQuick(prod)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Incluir
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-body-sm font-medium text-text-secondary">
            Marque os produtos comprados e clique em{" "}
            <strong className="text-text-primary">Converter em Estoque</strong>{" "}
            para abastecer sua despensa.
          </span>
        </div>

        <FilterDropdown
          id="shopping-list-status-filter"
          label="Filtrar listas por status"
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-56"
          options={[
            { value: "all", label: "Todas as Listas" },
            { value: "em_andamento", label: "Em Andamento" },
            { value: "planejada", label: "Planejadas" },
            { value: "concluida", label: "Concluídas" },
          ]}
        />
      </div>

      {filteredLists.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Nenhuma lista de compras encontrada"
          description="Crie uma nova lista de compras para organizar suas aquisições e integrar os itens comprados diretamente ao estoque."
          action={
            <Button type="button" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Lista de Compras
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredLists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onTogglePurchased={toggleShoppingListItemPurchased}
              onUpdateQuantity={(listId, itemId, nextQty) =>
                updateShoppingListItem(listId, itemId, { quantity: nextQty })
              }
              onRemoveItem={removeShoppingListItem}
              onAddItem={addItemToShoppingList}
              onConvertPurchased={(listId, options) => {
                convertPurchasedItemsToInventory(listId, options);
              }}
              onDeleteList={(listId) => setDeletingListId(listId)}
            />
          ))}
        </div>
      )}

      <CreateShoppingListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <ConfirmDialog
        open={Boolean(deletingListId)}
        onOpenChange={(open) => {
          if (!open) setDeletingListId(null);
        }}
        title="Excluir Lista de Compras"
        description={
          deletingList
            ? `Tem certeza de que deseja excluir a lista "${deletingList.name}"?`
            : ""
        }
        confirmLabel="Excluir Lista"
        onConfirm={() => {
          if (deletingListId) {
            deleteShoppingList(deletingListId);
          }
        }}
      />
    </div>
  );
}
