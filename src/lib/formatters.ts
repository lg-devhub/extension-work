import type {
  ExpirationCategory,
  MeasurementUnit,
  Product,
  ProductStatus,
} from "@/types/product";

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateOffsetISO(daysOffset: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODateLocal(isoDate: string): Date {
  const clean = isoDate.split("T")[0];
  const [year, month, day] = clean.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date();
  }
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDateBR(isoDate: string): string {
  if (!isoDate) return "—";
  const clean = isoDate.split("T")[0];
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

export function formatFullCurrentDateBR(): string {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatQuantity(quantity: number, unit: MeasurementUnit): string {
  const formattedNum = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(quantity);
  return `${formattedNum} ${unit}`;
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const today = parseISODateLocal(getTodayISO());
  const target = parseISODateLocal(expirationDate);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatExpirationRelativeLabel(expirationDate: string): string {
  const days = getDaysUntilExpiration(expirationDate);
  if (days < -1) {
    return `Venceu há ${Math.abs(days)} dias`;
  }
  if (days === -1) {
    return "Venceu ontem";
  }
  if (days === 0) {
    return "Vence hoje";
  }
  if (days === 1) {
    return "Vence amanhã";
  }
  return `Vence em ${days} dias`;
}

export function getProductStatus(
  product: Pick<Product, "quantity" | "minQuantity" | "expirationDate">,
  alertThresholdDays = 7
): ProductStatus {
  if (product.quantity <= 0) {
    return "out_of_stock";
  }
  const daysUntil = getDaysUntilExpiration(product.expirationDate);
  if (daysUntil < 0) {
    return "expired";
  }
  if (daysUntil <= alertThresholdDays) {
    return "expiring_soon";
  }
  if (product.quantity <= product.minQuantity) {
    return "low_stock";
  }
  return "available";
}

export function getExpirationCategory(expirationDate: string): ExpirationCategory {
  const days = getDaysUntilExpiration(expirationDate);
  if (days < 0) return "expired";
  if (days === 0) return "expiring_today";
  if (days <= 3) return "within_3_days";
  if (days <= 7) return "within_7_days";
  return "safe";
}
