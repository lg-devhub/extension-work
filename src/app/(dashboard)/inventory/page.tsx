import React from "react";
import type { Metadata } from "next";
import { InventoryView } from "@/components/inventory/inventory-view";

export const metadata: Metadata = {
  title: "Meu Estoque | Despensa+",
};

export default function InventoryPage() {
  return <InventoryView />;
}
