"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "./app-sidebar";

const PRIMARY_MOBILE_TABS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/inventory", label: "Estoque", icon: Package },
  { href: "/shopping-lists", label: "Compras", icon: ShoppingCart },
  { href: "/expiration-alerts", label: "Validade", icon: AlertTriangle },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { metrics, preferences, currentSession, logout } = useDespensa();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isSecondaryActive =
    pathname.startsWith("/waste-history") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/settings");

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm lg:hidden"
        aria-label="Navegação inferior móvel"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
          {PRIMARY_MOBILE_TABS.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const Icon = tab.icon;
            const showAlertBadge =
              tab.href === "/expiration-alerts" &&
              metrics.expiringSoonCount > 0;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-DEFAULT py-1 text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-forest font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {isActive ? (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-b-full bg-forest"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-forest" : "text-text-secondary"
                    )}
                  />
                  {showAlertBadge ? (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-white">
                      {metrics.expiringSoonCount}
                    </span>
                  ) : null}
                </div>
                <span className="truncate max-w-full px-1">{tab.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-expanded={drawerOpen}
            aria-label="Abrir menu completo"
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 rounded-DEFAULT py-1 text-[11px] font-medium transition-colors",
              drawerOpen || isSecondaryActive
                ? "text-forest font-semibold"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {drawerOpen || isSecondaryActive ? (
              <span
                className="absolute top-0 h-0.5 w-8 rounded-b-full bg-forest"
                aria-hidden="true"
              />
            ) : null}
            <Menu className="h-5 w-5" />
            <span>Mais</span>
          </button>
        </div>
      </nav>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-forest/40 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação completo"
        >
          <div
            className="fixed inset-0"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 rounded-t-2xl border-t border-border bg-surface p-5 pb-8 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-forest text-white">
                  <Leaf className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-heading text-body font-bold text-forest">
                    Despensa+
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {preferences.householdName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-DEFAULT px-3.5 py-3 text-body-sm font-medium transition-colors",
                      isActive
                        ? "bg-surface-secondary text-forest font-semibold"
                        : "text-text-secondary hover:bg-surface-secondary/60 hover:text-text-primary"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badgeKey === "expiring" &&
                    metrics.expiringSoonCount > 0 ? (
                      <span className="rounded-sm bg-warning-subtle px-2 py-0.5 text-caption font-semibold text-[#9B6312]">
                        {metrics.expiringSoonCount} alertas
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-caption text-text-secondary">
              <span>{currentSession?.name ?? preferences.userName}</span>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                  router.replace("/login");
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-danger hover:underline"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
