import type { MeasurementUnit, ProductCategory, StorageLocation } from "./product";

export type ShoppingListStatus = "planejada" | "em_andamento" | "concluida";

export interface ShoppingListItem {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: MeasurementUnit;
  estimatedPrice: number;
  purchased: boolean;
  addedToInventory?: boolean;
  defaultLocation?: StorageLocation;
  defaultShelfLifeDays?: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  status: ShoppingListStatus;
  items: ShoppingListItem[];
}
