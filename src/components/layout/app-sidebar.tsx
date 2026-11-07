"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  Leaf,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: "expiring" | "outOfStock";
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    href: "/dashboard",
    label: "Painel Geral",
    icon: LayoutDashboard,
  },
  {
    href: "/inventory",
    label: "Meu Estoque",
    icon: Package,
    badgeKey: "outOfStock",
  },
  {
    href: "/shopping-lists",
    label: "Listas de Compras",
    icon: ShoppingCart,
  },
  {
    href: "/expiration-alerts",
    label: "Alertas de Validade",
    icon: AlertTriangle,
    badgeKey: "expiring",
  },
  {
    href: "/waste-history",
    label: "Histórico de Descarte",
    icon: Trash2,
  },
  {
    href: "/analytics",
    label: "Relatórios e Análises",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { metrics, preferences, currentSession, logout } = useDespensa();

  const displayName = currentSession?.name ?? preferences.userName;
  const isAdmin = currentSession?.role === "admin";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 border-r border-border bg-surface"
      aria-label="Navegação lateral principal"
    >
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-DEFAULT bg-forest text-white shadow-sm">
          <Leaf className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <span className="font-heading text-lg font-bold tracking-tight text-forest">
            Despensa<span className="text-primary">+</span>
          </span>
          <span className="block text-[11px] font-medium text-text-secondary leading-none">
            Consumo Consciente
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-subtle">
        <div className="mb-2 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Menu Principal
          </p>
        </div>
        <nav className="space-y-1" aria-label="Seções do aplicativo">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            const badgeValue =
              item.badgeKey === "expiring"
                ? metrics.expiringSoonCount
                : item.badgeKey === "outOfStock" && metrics.outOfStockCount > 0
                ? metrics.outOfStockCount
                : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between rounded-DEFAULT px-3 py-2.5 text-body-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-secondary text-forest font-semibold"
                    : "text-text-secondary hover:bg-surface-secondary/70 hover:text-text-primary"
                )}
              >
                {isActive ? (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-forest"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="flex items-center gap-3 truncate">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-forest"
                        : "text-text-secondary group-hover:text-text-primary"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </span>

                {badgeValue > 0 ? (
                  <span
                    className={cn(
                      "ml-2 inline-flex min-w-[1.35rem] items-center justify-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold",
                      item.badgeKey === "expiring"
                        ? "bg-warning-subtle text-[#9B6312] border border-warning/30"
                        : "bg-surface-secondary text-text-secondary border border-border"
                    )}
                  >
                    {badgeValue}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-lg border border-border bg-surface-secondary/60 p-3.5">
          <div className="flex items-center justify-between text-caption">
            <span className="font-semibold text-forest">Meta Sustentável</span>
            <span className="font-bold text-primary">
              -{metrics.wasteReductionPct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, metrics.wasteReductionPct)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-text-secondary leading-snug">
            Redução estimada no desperdício doméstico mensal.
          </p>
        </div>
      </div>

      <div className="border-t border-border p-3.5 bg-surface-secondary/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-DEFAULT bg-forest text-caption font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-semibold text-text-primary">
                {displayName}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="h-3 w-3" />
                    Administrador
                  </>
                ) : (
                  "Conta de Usuário"
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/settings"
              title="Configurações"
              aria-label="Abrir configurações da conta"
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-secondary hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Sair da conta"
              aria-label="Sair da conta"
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-danger-subtle hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
