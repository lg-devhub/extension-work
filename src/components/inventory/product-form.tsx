"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalDialog } from "@/components/ui/dialog";
import {
  MEASUREMENT_UNITS,
  PRODUCT_CATEGORIES,
  STORAGE_LOCATIONS,
} from "@/lib/constants";
import { getDateOffsetISO } from "@/lib/formatters";
import type {
  MeasurementUnit,
  Product,
  ProductCategory,
  ProductFormValues,
  StorageLocation,
} from "@/types/product";

const productSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres."),
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
    .min(0, "A quantidade não pode ser negativa."),
  minQuantity: z.coerce
    .number()
    .min(0, "O estoque mínimo não pode ser negativo."),
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
  expirationDate: z
    .string()
    .min(1, "Informe a data de validade do produto."),
  location: z.enum(["Despensa", "Geladeira", "Freezer", "Fruteira"]),
  estimatedPrice: z.coerce
    .number()
    .min(0, "O valor estimado não pode ser negativo."),
  notes: z.string().optional(),
});

type ProductSchemaValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Product | null;
  onSubmitProduct: (values: ProductFormValues) => void;
}

export function ProductForm({
  open,
  onOpenChange,
  initialProduct,
  onSubmitProduct,
}: ProductFormDialogProps) {
  const isEditing = Boolean(initialProduct);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSchemaValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "Grãos e Cereais",
      quantity: 1,
      minQuantity: 1,
      unit: "un",
      expirationDate: getDateOffsetISO(14),
      location: "Despensa",
      estimatedPrice: 8.9,
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialProduct) {
      reset({
        name: initialProduct.name,
        category: initialProduct.category,
        quantity: initialProduct.quantity,
        minQuantity: initialProduct.minQuantity,
        unit: initialProduct.unit,
        expirationDate: initialProduct.expirationDate,
        location: initialProduct.location,
        estimatedPrice: initialProduct.estimatedPrice,
        notes: initialProduct.notes ?? "",
      });
    } else {
      reset({
        name: "",
        category: "Grãos e Cereais",
        quantity: 1,
        minQuantity: 1,
        unit: "un",
        expirationDate: getDateOffsetISO(14),
        location: "Despensa",
        estimatedPrice: 8.9,
        notes: "",
      });
    }
  }, [open, initialProduct, reset]);

  const onValidSubmit = (data: ProductSchemaValues) => {
    onSubmitProduct({
      name: data.name.trim(),
      category: data.category as ProductCategory,
      quantity: Number(data.quantity),
      minQuantity: Number(data.minQuantity),
      unit: data.unit as MeasurementUnit,
      expirationDate: data.expirationDate,
      location: data.location as StorageLocation,
      estimatedPrice: Number(data.estimatedPrice),
      notes: data.notes?.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
      description={
        isEditing
          ? "Atualize a quantidade, validade ou localização do item no estoque."
          : "Cadastre um alimento armazenado na residência para acompanhar validade e consumo."
      }
    >
      <form
        onSubmit={handleSubmit(onValidSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label
              htmlFor="product-name"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Nome do Produto *
            </label>
            <Input
              id="product-name"
              placeholder="Ex.: Arroz Agulhinha, Leite Integral, Tomate..."
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
              htmlFor="product-category"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Categoria *
            </label>
            <select
              id="product-category"
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
              htmlFor="product-location"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Local de Armazenamento *
            </label>
            <select
              id="product-location"
              {...register("location")}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              htmlFor="product-quantity"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Quantidade Disponível *
            </label>
            <Input
              id="product-quantity"
              type="number"
              step="0.1"
              min="0"
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
              htmlFor="product-unit"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Unidade de Medida *
            </label>
            <select
              id="product-unit"
              {...register("unit")}
              className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {MEASUREMENT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="product-min-quantity"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Estoque Mínimo Ideal
            </label>
            <Input
              id="product-min-quantity"
              type="number"
              step="0.1"
              min="0"
              {...register("minQuantity")}
            />
          </div>

          <div>
            <label
              htmlFor="product-expiration"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Data de Validade *
            </label>
            <Input
              id="product-expiration"
              type="date"
              {...register("expirationDate")}
            />
            {errors.expirationDate ? (
              <p className="mt-1 text-caption text-danger">
                {errors.expirationDate.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="product-price"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Preço Unitário Estimado (R$)
            </label>
            <Input
              id="product-price"
              type="number"
              step="0.1"
              min="0"
              {...register("estimatedPrice")}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="product-notes"
              className="block text-caption font-medium text-text-primary mb-1"
            >
              Observações de Conservação (opcional)
            </label>
            <Input
              id="product-notes"
              placeholder="Ex.: Caixa aberta na porta da geladeira, pacote lacrado..."
              {...register("notes")}
            />
          </div>
        </div>

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
            {isEditing ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
