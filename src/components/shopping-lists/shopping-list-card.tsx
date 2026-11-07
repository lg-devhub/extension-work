"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  Calendar,
  Check,
  CheckCircle2,
  Minus,
  PackageCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalDialog } from "@/components/ui/dialog";
import {
  MEASUREMENT_UNITS,
  PRODUCT_CATEGORIES,
  SHOPPING_LIST_STATUS_LABELS,
  STORAGE_LOCATIONS,
} from "@/lib/constants";
import {
  formatCurrencyBRL,
  formatDateBR,
  formatQuantity,
} from "@/lib/formatters";
import type {
  MeasurementUnit,
  ProductCategory,
  StorageLocation,
} from "@/types/product";
import type { ShoppingList } from "@/types/shopping-list";
import { cn } from "@/lib/utils";

interface ShoppingListCardProps {
  list: ShoppingList;
  onTogglePurchased: (listId: string, itemId: string) => void;
  onUpdateQuantity: (listId: string, itemId: string, nextQty: number) => void;
  onRemoveItem: (listId: string, itemId: string) => void;
  onAddItem: (
    listId: string,
    item: {
      name: string;
      category: ProductCategory;
      quantity: number;
      unit: MeasurementUnit;
      estimatedPrice: number;
      defaultLocation?: StorageLocation;
      defaultShelfLifeDays?: number;
    }
  ) => void;
  onConvertPurchased: (
    listId: string,
    options: { location: StorageLocation; shelfLifeDays: number }
  ) => void;
  onDeleteList: (listId: string) => void;
}

export function ShoppingListCard({
  list,
  onTogglePurchased,
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  onConvertPurchased,
  onDeleteList,
}: ShoppingListCardProps) {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] =
    useState<ProductCategory>("Hortifruti");
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState<MeasurementUnit>("un");
  const [newItemPrice, setNewItemPrice] = useState("6.50");

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [defaultLocation, setDefaultLocation] =
    useState<StorageLocation>("Despensa");
  const [defaultShelfLifeDays, setDefaultShelfLifeDays] = useState("14");

  const totalItems = list.items.length;
  const purchasedItems = list.items.filter((i) => i.purchased);
  const pendingConversionItems = purchasedItems.filter(
    (i) => !i.addedToInventory
  );
  const progressPct =
    totalItems > 0 ? Math.round((purchasedItems.length / totalItems) * 100) : 0;

  const estimatedTotalBRL = list.items.reduce(
    (sum, item) => sum + item.quantity * item.estimatedPrice,
    0
  );

  const statusBadgeVariant =
    list.status === "concluida"
      ? "success"
      : list.status === "em_andamento"
      ? "info"
      : "muted";

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const qty = Math.max(0.1, Number(newItemQuantity) || 1);
    const price = Math.max(0, Number(newItemPrice) || 0);

    onAddItem(list.id, {
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: qty,
      unit: newItemUnit,
      estimatedPrice: price,
      defaultLocation:
        newItemCategory === "Hortifruti" ||
        newItemCategory === "Laticínios e Ovos" ||
        newItemCategory === "Carnes e Proteínas"
          ? "Geladeira"
          : "Despensa",
      defaultShelfLifeDays:
        newItemCategory === "Hortifruti" ||
        newItemCategory === "Carnes e Proteínas"
          ? 5
          : 30,
    });

    setNewItemName("");
    setNewItemQuantity("1");
    setShowAddItemForm(false);
  };

  return (
    <>
      <Card className="p-5 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-section-title font-bold text-text-primary">
                  {list.name}
                </h3>
                <Badge variant={statusBadgeVariant}>
                  {SHOPPING_LIST_STATUS_LABELS[list.status]}
                </Badge>
              </div>
              {list.description ? (
                <p className="mt-1 text-caption text-text-secondary">
                  {list.description}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Criada em {formatDateBR(list.createdAt)}
                </span>
                <span>•</span>
                <span>
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </span>
                <span>•</span>
                <span className="font-semibold text-text-primary">
                  Total est.: {formatCurrencyBRL(estimatedTotalBRL)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDeleteList(list.id)}
              title="Excluir lista de compras"
              aria-label={`Excluir lista ${list.name}`}
              className="hover:text-danger shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-DEFAULT border border-border bg-surface-secondary/55 p-3">
            <div className="flex items-center justify-between text-caption">
              <span className="font-medium text-text-primary">
                Progresso da compra ({purchasedItems.length} de {totalItems}{" "}
                comprados)
              </span>
              <span className="font-bold text-forest">{progressPct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {pendingConversionItems.length > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-success/35 bg-success-subtle p-3.5">
              <div className="flex items-start gap-2.5">
                <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <div>
                  <p className="text-caption font-semibold text-forest">
                    {pendingConversionItems.length}{" "}
                    {pendingConversionItems.length === 1
                      ? "item comprado pronto"
                      : "itens comprados prontos"}{" "}
                    para entrar na despensa
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Converta os itens marcados como comprados diretamente em produtos do seu estoque.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => setConvertModalOpen(true)}
                className="w-full sm:w-auto shrink-0"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Converter em Estoque
              </Button>
            </div>
          ) : null}

          <div className="divide-y divide-border rounded-DEFAULT border border-border bg-surface">
            {list.items.length === 0 ? (
              <p className="p-5 text-center text-caption text-text-secondary">
                Esta lista ainda não possui itens. Adicione produtos abaixo.
              </p>
            ) : (
              list.items.map((item) => {
                const step =
                  item.unit === "kg" || item.unit === "L" || item.unit === "dz"
                    ? 0.5
                    : 1;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 transition-colors",
                      item.purchased && "bg-surface-secondary/45"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={item.purchased}
                        onClick={() => onTogglePurchased(list.id, item.id)}
                        aria-label={`Marcar ${item.name} como comprado`}
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
                          item.purchased
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-surface hover:border-primary"
                        )}
                      >
                        {item.purchased ? (
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : null}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "text-body-sm font-medium truncate",
                              item.purchased
                                ? "line-through text-text-secondary"
                                : "text-text-primary"
                            )}
                          >
                            {item.name}
                          </span>
                          {item.addedToInventory ? (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-success-subtle px-1.5 py-0.5 text-[10px] font-semibold text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              No Estoque
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-text-secondary">
                          {item.category} •{" "}
                          {formatCurrencyBRL(
                            item.quantity * item.estimatedPrice
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pl-8 sm:pl-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          onUpdateQuantity(
                            list.id,
                            item.id,
                            Math.max(
                              0.5,
                              Number((item.quantity - step).toFixed(2))
                            )
                          )
                        }
                        disabled={item.quantity <= step}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[4rem] text-center text-caption font-semibold text-text-primary">
                        {formatQuantity(item.quantity, item.unit)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          onUpdateQuantity(
                            list.id,
                            item.id,
                            Number((item.quantity + step).toFixed(2))
                          )
                        }
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemoveItem(list.id, item.id)}
                        aria-label={`Remover ${item.name} da lista`}
                        className="hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {showAddItemForm ? (
            <form
              onSubmit={handleAddItemSubmit}
              className="rounded-lg border border-border bg-surface-secondary/50 p-3.5 space-y-3"
            >
              <p className="text-caption font-semibold text-text-primary">
                Adicionar Produto à Lista
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <label htmlFor={`add-name-${list.id}`} className="sr-only">
                    Nome do produto
                  </label>
                  <Input
                    id={`add-name-${list.id}`}
                    placeholder="Nome do item (ex.: Cenoura)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor={`add-cat-${list.id}`} className="sr-only">
                    Categoria
                  </label>
                  <select
                    id={`add-cat-${list.id}`}
                    value={newItemCategory}
                    onChange={(e) =>
                      setNewItemCategory(e.target.value as ProductCategory)
                    }
                    className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-2.5 text-caption text-text-primary"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`add-qty-${list.id}`} className="sr-only">
                    Quantidade
                  </label>
                  <Input
                    id={`add-qty-${list.id}`}
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`add-unit-${list.id}`} className="sr-only">
                    Unidade
                  </label>
                  <select
                    id={`add-unit-${list.id}`}
                    value={newItemUnit}
                    onChange={(e) =>
                      setNewItemUnit(e.target.value as MeasurementUnit)
                    }
                    className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-2.5 text-caption text-text-primary"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`add-price-${list.id}`}
                    className="text-caption text-text-secondary"
                  >
                    Preço unit. (R$):
                  </label>
                  <Input
                    id={`add-price-${list.id}`}
                    type="number"
                    step="0.5"
                    min="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="h-8 w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddItemForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm">
                    Incluir Item
                  </Button>
                </div>
              </div>
            </form>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddItemForm((prev) => !prev)}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar Item à Lista
          </Button>

          {pendingConversionItems.length > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConvertModalOpen(true)}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Enviar {pendingConversionItems.length} comprados ao estoque
            </Button>
          ) : null}
        </div>
      </Card>

      <ModalDialog
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
        title="Converter Itens Comprados em Estoque"
        description={`Você está prestes a transferir ${pendingConversionItems.length} ${
          pendingConversionItems.length === 1 ? "item comprado" : "itens comprados"
        } da lista "${list.name}" para o inventário da despensa.`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface-secondary/50 p-3.5 space-y-2 max-h-48 overflow-y-auto scrollbar-subtle">
            <p className="text-caption font-semibold text-text-primary">
              Itens selecionados para abastecimento:
            </p>
            {pendingConversionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-caption py-1 border-b border-border/60 last:border-0"
              >
                <span className="font-medium text-text-primary">
                  {item.name} ({item.category})
                </span>
                <span className="font-semibold text-forest">
                  +{formatQuantity(item.quantity, item.unit)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor={`convert-location-${list.id}`}
                className="block text-caption font-medium text-text-primary mb-1"
              >
                Local Padrão de Armazenamento
              </label>
              <select
                id={`convert-location-${list.id}`}
                value={defaultLocation}
                onChange={(e) =>
                  setDefaultLocation(e.target.value as StorageLocation)
                }
                className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary"
              >
                {STORAGE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`convert-shelf-life-${list.id}`}
                className="block text-caption font-medium text-text-primary mb-1"
              >
                Validade Estimada (dias)
              </label>
              <Input
                id={`convert-shelf-life-${list.id}`}
                type="number"
                min="1"
                max="365"
                value={defaultShelfLifeDays}
                onChange={(e) => setDefaultShelfLifeDays(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConvertModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConvertPurchased(list.id, {
                  location: defaultLocation,
                  shelfLifeDays: Math.max(1, Number(defaultShelfLifeDays) || 14),
                });
                setConvertModalOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              <PackageCheck className="h-4 w-4" />
              Confirmar Entrada no Estoque
            </Button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}
