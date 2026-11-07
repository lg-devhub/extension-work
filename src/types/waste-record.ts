import type { MeasurementUnit, ProductCategory } from "./product";

export type DisposalReason =
  | "expired"
  | "spoiled"
  | "excess_purchase"
  | "other";

export interface WasteRecord {
  id: string;
  productId?: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: MeasurementUnit;
  disposalDate: string;
  reason: DisposalReason;
  estimatedLoss: number;
  notes?: string;
}

export type ActivityType =
  | "product_added"
  | "quantity_updated"
  | "product_depleted"
  | "waste_recorded"
  | "list_created"
  | "list_imported";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: "warning" | "danger" | "info" | "success";
  createdAt: string;
  read: boolean;
  href: string;
}

export interface UserPreferences {
  householdName: string;
  userName: string;
  userEmail: string;
  userRole: string;
  residentsCount: number;
  alertDaysBeforeExpiration: number;
  enableLowStockAlerts: boolean;
  enableExpirationNotifications: boolean;
  enableWeeklySummary: boolean;
  monthlyWasteReductionGoalPct: number;
}
