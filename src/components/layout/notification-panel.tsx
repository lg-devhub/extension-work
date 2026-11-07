"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useDespensa();

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-12 z-50 w-[calc(100vw-1.5rem)] max-w-sm rounded-xl border border-border bg-surface shadow-lg overflow-hidden"
        role="region"
        aria-label="Painel de notificações"
      >
        <div className="flex items-center justify-between border-b border-border bg-surface-secondary/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-forest" />
            <span className="font-heading text-body-sm font-semibold text-text-primary">
              Notificações
            </span>
            {unreadCount > 0 ? (
              <span className="rounded-sm bg-forest px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:text-forest"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar lidas
            </button>
          ) : null}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border scrollbar-subtle">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-caption text-text-secondary">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon =
                notif.severity === "danger"
                  ? XCircle
                  : notif.severity === "warning"
                  ? AlertTriangle
                  : notif.severity === "success"
                  ? CheckCircle2
                  : Info;

              const iconColor =
                notif.severity === "danger"
                  ? "text-danger"
                  : notif.severity === "warning"
                  ? "text-warning"
                  : notif.severity === "success"
                  ? "text-success"
                  : "text-info";

              return (
                <Link
                  key={notif.id}
                  href={notif.href}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    onClose();
                  }}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-secondary/80",
                    !notif.read && "bg-surface-secondary/40"
                  )}
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-caption text-text-primary truncate",
                          !notif.read ? "font-semibold" : "font-medium"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.read ? (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-primary"
                          aria-label="Não lida"
                        />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-caption text-text-secondary line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="mt-1 block text-[11px] text-text-muted">
                      {notif.createdAt}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="border-t border-border bg-surface-secondary/40 px-4 py-2.5 text-center">
          <Link
            href="/expiration-alerts"
            onClick={onClose}
            className="text-caption font-medium text-primary hover:text-forest"
          >
            Ver todos os alertas de validade →
          </Link>
        </div>
      </div>
    </>
  );
}
