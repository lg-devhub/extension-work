import React from "react";
import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Painel Geral | Despensa+",
};

export default function DashboardPage() {
  return <DashboardView />;
}
