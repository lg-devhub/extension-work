import type {
  ExpirationCategory,
  MeasurementUnit,
  ProductCategory,
  ProductStatus,
  StorageLocation,
} from "@/types/product";
import type { ShoppingListStatus } from "@/types/shopping-list";
import type { DisposalReason } from "@/types/waste-record";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Hortifruti",
  "Grãos e Cereais",
  "Laticínios e Ovos",
  "Carnes e Proteínas",
  "Padaria e Matinais",
  "Mercearia e Temperos",
  "Bebidas",
  "Congelados",
];

export const MEASUREMENT_UNITS: { value: MeasurementUnit; label: string }[] = [
  { value: "un", label: "Unidade (un)" },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "ml", label: "Mililitro (ml)" },
  { value: "dz", label: "Dúzia (dz)" },
  { value: "pct", label: "Pacote (pct)" },
  { value: "cx", label: "Caixa (cx)" },
  { value: "maço", label: "Maço (maço)" },
  { value: "pote", label: "Pote (pote)" },
];

export const STORAGE_LOCATIONS: StorageLocation[] = [
  "Despensa",
  "Geladeira",
  "Freezer",
  "Fruteira",
];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  available: "Disponível",
  low_stock: "Estoque Baixo",
  expiring_soon: "Vencendo em Breve",
  expired: "Vencido",
  out_of_stock: "Sem Estoque",
};

export const EXPIRATION_CATEGORY_META: Record<
  ExpirationCategory,
  {
    title: string;
    subtitle: string;
    badgeLabel: string;
    tone: "danger" | "warning" | "info" | "success";
  }
> = {
  expired: {
    title: "Vencidos",
    subtitle: "Produtos com prazo de validade ultrapassado que exigem descarte ou verificação imediata.",
    badgeLabel: "Vencido",
    tone: "danger",
  },
  expiring_today: {
    title: "Vencendo Hoje",
    subtitle: "Itens cujo prazo expira na data de hoje. Priorize o consumo imediato.",
    badgeLabel: "Vence Hoje",
    tone: "danger",
  },
  within_3_days: {
    title: "Vencendo em até 3 Dias",
    subtitle: "Produtos com vencimento muito próximo. Ideais para o preparo das próximas refeições.",
    badgeLabel: "Até 3 dias",
    tone: "warning",
  },
  within_7_days: {
    title: "Vencendo em até 7 Dias",
    subtitle: "Itens que vencem nesta semana. Planeje o uso para evitar desperdício.",
    badgeLabel: "Até 7 dias",
    tone: "info",
  },
  safe: {
    title: "Seguros para Consumo",
    subtitle: "Produtos dentro da validade com mais de 7 dias de margem.",
    badgeLabel: "Seguro",
    tone: "success",
  },
};

export const DISPOSAL_REASON_LABELS: Record<DisposalReason, string> = {
  expired: "Prazo de Validade Vencido",
  spoiled: "Estragado / Deteriorado",
  excess_purchase: "Compra em Excesso",
  other: "Outro Motivo",
};

export const SHOPPING_LIST_STATUS_LABELS: Record<ShoppingListStatus, string> = {
  planejada: "Planejada",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  "Hortifruti": "#39865A",
  "Grãos e Cereais": "#3F6849",
  "Laticínios e Ovos": "#5686B7",
  "Carnes e Proteínas": "#D85B55",
  "Padaria e Matinais": "#E5A23C",
  "Mercearia e Temperos": "#91A88B",
  "Bebidas": "#4A7C77",
  "Congelados": "#6A8CAF",
};
