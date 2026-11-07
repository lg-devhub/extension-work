"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModalDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DISPOSAL_REASON_LABELS,
  MEASUREMENT_UNITS,
  PRODUCT_CATEGORIES,
} from "@/lib/constants";
import { getTodayISO } from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";
import type {
  MeasurementUnit,
  Product,
  ProductCategory,
} from "@/types/product";
import type { DisposalReason } from "@/types/waste-record";

const wasteFormSchema = z.object({
  productName: z
    .string()
    .min(2, "Informe o nome do alimento descartado."),
  category: z.enum([
    "Hortifruti",
    "Grãos e Cereais",
    "Laticínios e Ovos",
    "Carnes e Proteínas",
    "Padaria e Matinais",
    "Mercearia e Temperos",
    "Bebidas",
    "Congelados",
  ]),
  quantity: z.coerce
    .number()
    .positive("A quantidade descartada deve ser maior que zero."),
  unit: z.enum([
    "un",
    "kg",
    "g",
    "L",
    "ml",
    "dz",
    "pct",
    "cx",
    "maço",
    "pote",
  ]),
  disposalDate: z.string().min(1, "Informe a data do descarte."),
  reason: z.enum(["expired", "spoiled", "excess_purchase", "other"]),
  estimatedLoss: z.coerce
    .number()
    .min(0, "O valor estimado não pode ser negativo."),
  notes: z.string().optional(),
  deductFromInventory: z.boolean().default(true),
});

type WasteFormInput = z.infer<typeof wasteFormSchema>;

interface WasteRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedProduct?: Product | null;
}

export function WasteRecordDialog({
  open,
  onOpenChange,
  preselectedProduct,
}: WasteRecordDialogProps) {
  const { recordWaste, products } = useDespensa();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WasteFormInput>({
    resolver: zodResolver(wasteFormSchema),
    defaultValues: {
      productName: "",
      category: "Hortifruti",
      quantity: 1,
      unit: "un",
      disposalDate: getTodayISO(),
      reason: "expired",
      estimatedLoss: 5.0,
      notes: "",
      deductFromInventory: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (preselectedProduct) {
      reset({
        productName: preselectedProduct.name,
        category: preselectedProduct.category,
        quantity:
          preselectedProduct.quantity > 0 ? preselectedProduct.quantity : 1,
        unit: preselectedProduct.unit,
        disposalDate: getTodayISO(),
        reason: "expired",
        estimatedLoss: Number(
          (
            Math.max(1, preselectedProduct.quantity) *
            preselectedProduct.estimatedPrice
          ).toFixed(2)
        ),
        notes: "",
        deductFromInventory: true,
      });
    } else {
      reset({
        productName: "",
        category: "Hortifruti",
        quantity: 1,
        unit: "un",
        disposalDate: getTodayISO(),
        reason: "expired",
        estimatedLoss: 5.0,
        notes: "",
        deductFromInventory: false,
      });
    }
  }, [open, preselectedProduct, reset]);

  const handleQuickFillProduct = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (!found) return;
    setValue("productName", found.name);
    setValue("category", found.category);
    setValue("quantity", found.quantity > 0 ? found.quantity : 1);
    setValue("unit", found.unit);
    setValue(
      "estimatedLoss",
      Number((Math.max(1, found.quantity) * found.estimatedPrice).toFixed(2))
    );
    setValue("deductFromInventory", true);
  };

  const onSubmit = (data: WasteFormInput) => {
    const matchingProduct =
      preselectedProduct ??
      products.find(
        (p) => p.name.toLowerCase() === data.productName.trim().toLowerCase()
      );

    recordWaste(
      {
        productId: matchingProduct?.id,
        productName: data.productName.trim(),
        category: data.category as ProductCategory,
        quantity: data.quantity,
        unit: data.unit as MeasurementUnit,
        disposalDate: data.disposalDate,
        reason: data.reason as DisposalReason,
        estimatedLoss: data.estimatedLoss,
        notes: data.notes?.trim() || undefined,
      },
      data.deductFromInventory && matchingProduct
        ? matchingProduct.id
        : undefined
    );

    onOpenChange(false);
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar Descarte de Alimento"
      description="Registre alimentos descartados para acompanhar indicadores de redução de desperdício doméstico."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {!preselectedProduct && products.length > 0 ? (
          <div>
            <label
              htmlFor="quick-fill-product"
              className="block text-caption font-medium text-text-secondary mb-1.5"
            >
              Selecionar item existente na despensa (opcional)
            </label>
            <select
              id="quick-fill-product"
              defaultValue=""
              onChange={(e) => handleQuickFillProduct(e.target.value)}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface-secondary px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Preencher manualmente...</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.quantity} {prod.unit})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label
              htmlFor="waste-product-name"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Nome do Produto *
            </label>
            <Input
              id="waste-product-name"
              placeholder="Ex.: Mamão Formosa, Leite Integral..."
              {...register("productName")}
            />
            {errors.productName ? (
              <p className="mt-1 text-caption text-danger">
                {errors.productName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="waste-category"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Categoria *
            </label>
            <select
              id="waste-category"
              {...register("category")}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="waste-reason"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Motivo do Descarte *
            </label>
            <select
              id="waste-reason"
              {...register("reason")}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {(Object.keys(DISPOSAL_REASON_LABELS) as DisposalReason[]).map(
                (reasonKey) => (
                  <option key={reasonKey} value={reasonKey}>
                    {DISPOSAL_REASON_LABELS[reasonKey]}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="waste-quantity"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Quantidade Descartada *
            </label>
            <Input
              id="waste-quantity"
              type="number"
              step="0.1"
              min="0.1"
              {...register("quantity")}
            />
            {errors.quantity ? (
              <p className="mt-1 text-caption text-danger">
                {errors.quantity.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="waste-unit"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Unidade de Medida *
            </label>
            <select
              id="waste-unit"
              {...register("unit")}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {MEASUREMENT_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="waste-date"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Data do Descarte *
            </label>
            <Input id="waste-date" type="date" {...register("disposalDate")} />
            {errors.disposalDate ? (
              <p className="mt-1 text-caption text-danger">
                {errors.disposalDate.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="waste-loss"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Valor Estimado (R$)
            </label>
            <Input
              id="waste-loss"
              type="number"
              step="0.1"
              min="0"
              {...register("estimatedLoss")}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="waste-notes"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Observações (opcional)
            </label>
            <Input
              id="waste-notes"
              placeholder="Ex.: Armazenado fora de recipiente fechado..."
              {...register("notes")}
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 rounded-DEFAULT border border-border bg-surface-secondary/70 p-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("deductFromInventory")}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-caption text-text-primary">
            Deduzir automaticamente esta quantidade do estoque caso o produto esteja cadastrado
          </span>
        </label>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="danger" className="w-full sm:w-auto">
            Confirmar Descarte
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
