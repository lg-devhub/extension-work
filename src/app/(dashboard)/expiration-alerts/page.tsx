import React from "react";
import type { Metadata } from "next";
import { ExpirationAlertsView } from "@/components/alerts/expiration-alerts-view";

export const metadata: Metadata = {
  title: "Alertas de Validade | Despensa+",
};

export default function ExpirationAlertsPage() {
  return <ExpirationAlertsView />;
}
