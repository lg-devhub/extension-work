import React from "react";
import type { Metadata } from "next";
import { ShoppingListsView } from "@/components/shopping-lists/shopping-lists-view";

export const metadata: Metadata = {
  title: "Listas de Compras | Despensa+",
};

export default function ShoppingListsPage() {
  return <ShoppingListsView />;
}
