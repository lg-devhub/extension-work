import React from "react";
import {
  Apple,
  Beef,
  Carrot,
  Coffee,
  Croissant,
  Egg,
  CupSoda,
  Milk,
  Package,
  Salad,
  Snowflake,
  Sparkles,
  Wheat,
} from "lucide-react";
import type { ProductCategory } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductAvatarProps {
  name: string;
  category: ProductCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductAvatar({
  name,
  category,
  size = "md",
  className,
}: ProductAvatarProps) {
  const lower = name.toLowerCase();

  let IconComponent = Package;
  let toneClasses = "bg-surface-secondary text-primary border-border";

  if (
    lower.includes("alface") ||
    lower.includes("rúcula") ||
    lower.includes("coentro") ||
    lower.includes("brócolis")
  ) {
    IconComponent = Salad;
    toneClasses = "bg-success-subtle text-success border-success/20";
  } else if (lower.includes("cenoura") || lower.includes("batata")) {
    IconComponent = Carrot;
    toneClasses = "bg-warning-subtle text-[#A86410] border-warning/25";
  } else if (
    lower.includes("tomate") ||
    lower.includes("maçã") ||
    lower.includes("banana") ||
    lower.includes("mamão") ||
    category === "Hortifruti"
  ) {
    IconComponent = Apple;
    toneClasses = "bg-success-subtle text-primary border-primary/20";
  } else if (lower.includes("ovo")) {
    IconComponent = Egg;
    toneClasses = "bg-warning-subtle text-[#9B6312] border-warning/25";
  } else if (
    lower.includes("leite") ||
    lower.includes("queijo") ||
    lower.includes("iogurte") ||
    lower.includes("manteiga") ||
    category === "Laticínios e Ovos"
  ) {
    IconComponent = Milk;
    toneClasses = "bg-info-subtle text-info border-info/20";
  } else if (
    lower.includes("frango") ||
    lower.includes("carne") ||
    lower.includes("peixe") ||
    category === "Carnes e Proteínas"
  ) {
    IconComponent = Beef;
    toneClasses = "bg-danger-subtle text-danger border-danger/20";
  } else if (lower.includes("café")) {
    IconComponent = Coffee;
    toneClasses = "bg-surface-secondary text-forest border-sage/35";
  } else if (lower.includes("pão") || category === "Padaria e Matinais") {
    IconComponent = Croissant;
    toneClasses = "bg-warning-subtle text-[#9B6312] border-warning/25";
  } else if (
    lower.includes("arroz") ||
    lower.includes("feijão") ||
    lower.includes("aveia") ||
    category === "Grãos e Cereais"
  ) {
    IconComponent = Wheat;
    toneClasses = "bg-surface-secondary text-forest border-sage/30";
  } else if (category === "Bebidas" || lower.includes("suco")) {
    IconComponent = CupSoda;
    toneClasses = "bg-info-subtle text-info border-info/20";
  } else if (category === "Congelados") {
    IconComponent = Snowflake;
    toneClasses = "bg-info-subtle text-info border-info/25";
  } else if (category === "Mercearia e Temperos") {
    IconComponent = Sparkles;
    toneClasses = "bg-surface-secondary text-primary border-sage/30";
  }

  const sizeMap = {
    sm: "h-9 w-9 rounded-sm",
    md: "h-10 w-10 rounded-DEFAULT",
    lg: "h-12 w-12 rounded-lg",
  };

  const iconSizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center border",
        sizeMap[size],
        toneClasses,
        className
      )}
      aria-hidden="true"
    >
      <IconComponent className={iconSizeMap[size]} />
    </div>
  );
}
