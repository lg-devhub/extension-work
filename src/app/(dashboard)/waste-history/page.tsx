import React from "react";
import type { Metadata } from "next";
import { WasteHistoryView } from "@/components/waste/waste-history-view";

export const metadata: Metadata = {
  title: "Histórico de Descarte | Despensa+",
};

export default function WasteHistoryPage() {
  return <WasteHistoryView />;
}
