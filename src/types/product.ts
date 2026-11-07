export type ProductCategory =
  | "Hortifruti"
  | "Grãos e Cereais"
  | "Laticínios e Ovos"
  | "Carnes e Proteínas"
  | "Padaria e Matinais"
  | "Mercearia e Temperos"
  | "Bebidas"
  | "Congelados";

export type MeasurementUnit =
  | "kg"
  | "g"
  | "L"
  | "ml"
  | "un"
  | "dz"
  | "pct"
  | "cx"
  | "maço"
  | "pote";

export type StorageLocation =
  | "Despensa"
  | "Geladeira"
  | "Freezer"
  | "Fruteira";

export type ProductStatus =
  | "available"
  | "low_stock"
  | "expiring_soon"
  | "expired"
  | "out_of_stock";

export type ExpirationCategory =
  | "expired"
  | "expiring_today"
  | "within_3_days"
  | "within_7_days"
  | "safe";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  minQuantity: number;
  unit: MeasurementUnit;
  expirationDate: string;
  addedAt: string;
  updatedAt: string;
  location: StorageLocation;
  estimatedPrice: number;
  notes?: string;
}

export interface ProductFormValues {
  name: string;
  category: ProductCategory;
  quantity: number;
  minQuantity: number;
  unit: MeasurementUnit;
  expirationDate: string;
  location: StorageLocation;
  estimatedPrice: number;
  notes?: string;
}
