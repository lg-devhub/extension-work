"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidthClassName = "max-w-lg",
}: ModalDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-forest/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dialog-title"
    >
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-t-xl sm:rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto scrollbar-subtle",
          maxWidthClassName
        )}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2
              id="modal-dialog-title"
              className="font-heading text-section-title text-text-primary"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-caption text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar janela"
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
