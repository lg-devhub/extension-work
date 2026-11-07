"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModalDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDespensa } from "@/hooks/use-despensa";
import { getProductStatus } from "@/lib/formatters";

const createListSchema = z.object({
  name: z
    .string()
    .min(2, "Informe um nome com pelo menos 2 caracteres para a lista."),
  description: z.string().optional(),
  includeOutOfStockItems: z.boolean().default(true),
});

type CreateListValues = z.infer<typeof createListSchema>;

interface CreateShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShoppingListDialog({
  open,
  onOpenChange,
}: CreateShoppingListDialogProps) {
  const { createShoppingList, products, preferences } = useDespensa();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateListValues>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
      description: "",
      includeOutOfStockItems: true,
    },
  });

  const outOfStockOrLowProducts = products.filter((p) => {
    const status = getProductStatus(p, preferences.alertDaysBeforeExpiration);
    return status === "out_of_stock" || status === "low_stock";
  });

  const onSubmit = (data: CreateListValues) => {
    const autoItems = data.includeOutOfStockItems
      ? outOfStockOrLowProducts.map((p) => ({
          name: p.name,
          category: p.category,
          quantity: Math.max(1, p.minQuantity),
          unit: p.unit,
          estimatedPrice: p.estimatedPrice,
          defaultLocation: p.location,
          defaultShelfLifeDays: 14,
        }))
      : [];

    createShoppingList({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      items: autoItems,
    });

    reset();
    onOpenChange(false);
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Lista de Compras"
      description="Organize suas compras domésticas e evite aquisições por impulso ou em excesso."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="list-name"
            className="block text-caption font-medium text-text-primary mb-1"
          >
            Nome da Lista *
          </label>
          <Input
            id="list-name"
            placeholder="Ex.: Compras da Quinzena, Hortifruti de Sábado..."
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-caption text-danger">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="list-description"
            className="block text-caption font-medium text-text-primary mb-1"
          >
            Descrição ou Observação (opcional)
          </label>
          <Input
            id="list-description"
            placeholder="Ex.: Priorizar itens para marmitas da semana..."
            {...register("description")}
          />
        </div>

        {outOfStockOrLowProducts.length > 0 ? (
          <label className="flex items-start gap-2.5 rounded-DEFAULT border border-border bg-surface-secondary/70 p-3.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("includeOutOfStockItems")}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <span className="block text-caption font-semibold text-text-primary">
                Incluir automaticamente itens sem estoque ou com estoque baixo (
                {outOfStockOrLowProducts.length}{" "}
                {outOfStockOrLowProducts.length === 1 ? "item" : "itens"})
              </span>
              <span className="mt-0.5 block text-[11px] text-text-secondary">
                Adiciona:{" "}
                {outOfStockOrLowProducts
                  .slice(0, 4)
                  .map((p) => p.name)
                  .join(", ")}
                {outOfStockOrLowProducts.length > 4 ? "..." : ""}
              </span>
            </div>
          </label>
        ) : null}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Criar Lista de Compras
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
