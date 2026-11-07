import React from "react";
import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const metadata: Metadata = {
  title: "Relatórios e Análises | Despensa+",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
