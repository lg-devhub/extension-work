"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Leaf,
  LogOut,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { formatQuantity, getProductStatus } from "@/lib/formatters";
import { ProductStatusBadge } from "@/components/shared/product-status-badge";
import { NotificationPanel } from "./notification-panel";

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  "/dashboard": {
    title: "Painel Geral",
    breadcrumb: "Visão Geral da Despensa",
  },
  "/inventory": {
    title: "Meu Estoque",
    breadcrumb: "Inventário Doméstico",
  },
  "/shopping-lists": {
    title: "Listas de Compras",
    breadcrumb: "Planejamento de Compras",
  },
  "/expiration-alerts": {
    title: "Alertas de Validade",
    breadcrumb: "Monitoramento de Prazos",
  },
  "/waste-history": {
    title: "Histórico de Descarte",
    breadcrumb: "Controle de Desperdício",
  },
  "/analytics": {
    title: "Relatórios e Análises",
    breadcrumb: "Indicadores e Consumo",
  },
  "/settings": {
    title: "Configurações",
    breadcrumb: "Preferências da Residência",
  },
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    products,
    notifications,
    preferences,
    currentSession,
    globalSearchQuery,
    setGlobalSearchQuery,
    resetDemoData,
    logout,
  } = useDespensa();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const pageMeta = PAGE_TITLES[pathname] ?? {
    title: "Despensa+",
    breadcrumb: "Painel",
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayName = currentSession?.name ?? preferences.userName;
  const displayEmail = currentSession?.email ?? preferences.userEmail;
  const isAdmin = currentSession?.role === "admin";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const quickSearchMatches =
    globalSearchQuery.trim().length > 0
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(globalSearchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    if (pathname !== "/inventory") {
      router.push("/inventory");
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard"
          className="flex lg:hidden h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-forest text-white"
          aria-label="Ir para o Painel Geral"
        >
          <Leaf className="h-4 w-4" />
        </Link>

        <div className="min-w-0">
          <nav
            aria-label="Localização atual"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-text-secondary"
          >
            <span>Despensa+</span>
            <ChevronRight className="h-3 w-3 text-text-muted" />
            <span className="text-primary truncate">{pageMeta.breadcrumb}</span>
          </nav>
          <p className="font-heading text-body sm:text-card-title font-bold text-text-primary truncate">
            {pageMeta.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="relative hidden md:block w-64 lg:w-72">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="header-global-search" className="sr-only">
              Buscar produtos na despensa
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="header-global-search"
              type="search"
              value={globalSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() =>
                window.setTimeout(() => setSearchFocused(false), 180)
              }
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Buscar no estoque..."
              className="h-9 w-full rounded-DEFAULT border border-border bg-surface-secondary/70 pl-9 pr-3 text-caption text-text-primary placeholder:text-text-muted transition-colors focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>

          {searchFocused && globalSearchQuery.trim().length > 0 ? (
            <div className="absolute left-0 right-0 top-11 z-50 rounded-lg border border-border bg-surface p-2 shadow-lg">
              {quickSearchMatches.length === 0 ? (
                <p className="px-3 py-2 text-caption text-text-secondary">
                  Nenhum produto encontrado para &ldquo;{globalSearchQuery}&rdquo;.
                </p>
              ) : (
                <div className="space-y-1">
                  {quickSearchMatches.map((prod) => (
                    <Link
                      key={prod.id}
                      href="/inventory"
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-2 hover:bg-surface-secondary transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-caption font-semibold text-text-primary">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-text-secondary">
                          {prod.category} •{" "}
                          {formatQuantity(prod.quantity, prod.unit)}
                        </p>
                      </div>
                      <ProductStatusBadge
                        status={getProductStatus(
                          prod,
                          preferences.alertDaysBeforeExpiration
                        )}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUserMenuOpen(false);
            }}
            aria-label={`Notificações (${unreadCount} não lidas)`}
            aria-expanded={notifOpen}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-DEFAULT border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          <NotificationPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-expanded={userMenuOpen}
            aria-label="Menu do usuário"
            className="flex items-center gap-2 rounded-DEFAULT border border-border bg-surface p-1 pr-2.5 text-left transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-forest text-caption font-bold text-white">
              {initials}
            </span>
            <span className="hidden sm:block max-w-[120px] truncate text-caption font-semibold text-text-primary">
              {displayName.split(" ")[0]}
            </span>
          </button>

          {userMenuOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-border bg-surface p-2 shadow-lg"
                role="menu"
              >
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-body-sm font-semibold text-text-primary truncate">
                    {displayName}
                  </p>
                  <p className="text-caption text-text-secondary truncate">
                    {displayEmail}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-sm bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-forest">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        Administrador
                      </>
                    ) : (
                      "Conta de Usuário"
                    )}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-caption font-medium text-text-primary hover:bg-surface-secondary"
                  >
                    <User className="h-4 w-4 text-text-secondary" />
                    Perfil e Residência
                  </Link>
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-caption font-medium text-text-primary hover:bg-surface-secondary"
                  >
                    <Settings className="h-4 w-4 text-text-secondary" />
                    {isAdmin
                      ? "Configurações e Acessos"
                      : "Preferências de Alertas"}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      resetDemoData();
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-caption font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  >
                    <RotateCcw className="h-4 w-4 text-text-secondary" />
                    Restaurar Dados de Demo
                  </button>
                </div>

                <div className="pt-1 border-t border-border">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-caption font-semibold text-danger hover:bg-danger-subtle"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
