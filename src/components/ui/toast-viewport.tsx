"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { cn } from "@/lib/utils";

export function ToastViewport() {
  const { toasts, dismissToast } = useDespensa();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-5 right-4 z-50 flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const variant = toast.variant ?? "info";
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface p-3.5 shadow-md transition-all",
              variant === "success" && "border-success/40",
              variant === "warning" && "border-warning/50",
              variant === "danger" && "border-danger/40",
              variant === "info" && "border-info/40"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {variant === "success" && (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              {variant === "warning" && (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
              {variant === "danger" && (
                <XCircle className="h-4 w-4 text-danger" />
              )}
              {variant === "info" && <Info className="h-4 w-4 text-info" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-text-primary">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="mt-0.5 text-caption text-text-secondary">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-sm p-1 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
              aria-label="Fechar aviso"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
